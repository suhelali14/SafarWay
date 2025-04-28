import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Check, CreditCard, Info, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  bookingService
} from "../../services/api/bookingService";

// Define the PaymentMethod type
export type PaymentMethod = "ONLINE" | "PARTIAL";
export interface PaymentResult {
  success: boolean;
  bookingId?: string;
  message?: string;
}
// Define the BookingDetails type
export interface BookingDetails {
  id: string;
  totalPrice: number;
  tourPackage: {
    title: string;
    coverImage: string;
    duration: number;
    pricePerPerson: number;
  };
  travelers: Array<{
    fullName: string;
    email?: string;
    phone?: string;
  }>;
}

// Mock Razorpay integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get booking details from localStorage
    const bookingDetailsString = localStorage.getItem("bookingDetails");
    if (bookingDetailsString) {
      try {
        const parsedDetails: BookingDetails = JSON.parse(bookingDetailsString);
        setBookingDetails(parsedDetails);
      } catch (error) {
        console.error("Error parsing booking details:", error);
        toast.error("Error retrieving booking details");
        navigate("/");
      }
    } else {
      toast.error("No booking details found");
      navigate("/");
    }
  }, [navigate]);

  // Calculate deposit amount (for partial payment)
  const depositAmount = bookingDetails
    ? Math.min(5000, bookingDetails.totalPrice * 0.2)
    : 0;

  // Get contact information from the first traveler with email and phone
  const contactTraveler = bookingDetails?.travelers.find(
    (traveler) => traveler.email && traveler.phone
  );

  const handlePayment = async () => {
    if (!bookingDetails) return;

    setIsProcessing(true);

    try {
      // Update booking details with payment method
      const updatedBookingDetails = { ...bookingDetails, paymentMethod };

      if (paymentMethod === "PARTIAL") {
        // Request partial payment approval
        await bookingService.requestPartialPaymentApproval(updatedBookingDetails.id);
        navigate("/booking-confirmation", {
          state: {
            bookingDetails: updatedBookingDetails,
            partialPayment: true,
            depositAmount,
          },
        });
      } else {
        // Initialize Razorpay payment
        const { paymentUrl } = await bookingService.initiatePayment(updatedBookingDetails.id);

        if (paymentUrl) {
          // Redirect to the payment URL
          window.location.href = paymentUrl;
        } else {
          toast.error("Failed to initiate payment");
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment processing");
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-gray-600 mb-6">
          Choose your payment method for {bookingDetails.tourPackage.title}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment options */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={"ONLINE"} id="payment-online" />
                    <Label
                      htmlFor="payment-online"
                      className="flex flex-1 items-center cursor-pointer"
                    >
                      <div className="bg-blue-600 bg-opacity-10 p-2 rounded-full mr-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Pay Full Amount Online</div>
                        <div className="text-sm text-gray-500">
                          Secure payment via Razorpay
                        </div>
                      </div>
                      <div className="ml-auto font-semibold">
                        ₹{bookingDetails.totalPrice}
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={"PARTIAL"} id="payment-partial" />
                    <Label
                      htmlFor="payment-partial"
                      className="flex flex-1 items-center cursor-pointer"
                    >
                      <div className="bg-green-600 bg-opacity-10 p-2 rounded-full mr-3">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center">
                          Reserve with Partial Payment
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60">
                                  Pay deposit now and the rest later at the
                                  agency office. Requires agency approval before
                                  confirmation.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-sm text-gray-500">
                          Pay ₹{depositAmount} deposit and remainder in cash at
                          agency
                        </div>
                      </div>
                      <div className="ml-auto font-semibold">
                        ₹{depositAmount} deposit
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="w-full p-4 mb-4 bg-blue-50 rounded-md text-sm text-blue-800">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Information</p>
                      <p className="mt-1">
                        {paymentMethod === "ONLINE"
                          ? "Your booking will be instantly confirmed after successful payment."
                          : "Your booking request will be sent to the agency for approval. Once approved, you'll receive a payment link for the deposit."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === "ONLINE" ? (
                    <>
                      Pay ₹{bookingDetails.totalPrice} Now{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Request Approval{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={bookingDetails.tourPackage.coverImage}
                      alt={bookingDetails.tourPackage.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium truncate">
                      {bookingDetails.tourPackage.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {bookingDetails.tourPackage.duration} Days,{" "}
                      {bookingDetails.travelers.length}{" "}
                      {bookingDetails.travelers.length === 1
                        ? "Person"
                        : "People"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per person</span>
                    <span>₹{bookingDetails.tourPackage.pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of travelers</span>
                    <span>× {bookingDetails.travelers.length}</span>
                  </div>

                  {paymentMethod === "PARTIAL" && (
                    <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Deposit amount (now)</span>
                        <span>₹{depositAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Remaining (at agency)</span>
                        <span>
                          ₹{bookingDetails.totalPrice - depositAmount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span className="text-blue-600">
                    ₹{bookingDetails.totalPrice}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-medium mb-2">Contact Information</h4>
              {contactTraveler ? (
                <>
                  <p className="text-sm text-gray-700">
                    {contactTraveler.fullName}
                  </p>
                  <p className="text-sm text-gray-700">
                    {contactTraveler.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    {contactTraveler.phone}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-700">
                  No contact information available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}