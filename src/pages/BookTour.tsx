import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface BookingFormData {
  date: Date | null;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

// Mock tour data - replace with actual API call
const mockTour = {
  id: "1",
  title: "Himalayan Adventure",
  price: 29999,
  duration: 7,
  maxGroupSize: 12,
};

export default function BookTour() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: null,
    adults: 1,
    children: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const totalPrice = (formData.adults + formData.children) * mockTour.price;

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    return formData.date !== null && formData.adults > 0;
  };

  const validateStep2 = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Tour</h1>
          <p className="text-gray-600 mt-2">{mockTour.title}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                1
              </div>
              <div className="ml-4">
                <div className="font-medium">Select Date & Guests</div>
                <div className="text-sm text-gray-500">Choose when and who</div>
              </div>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(currentStep - 1) * 50}%` }}
              />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                2
              </div>
              <div className="ml-4">
                <div className="font-medium">Personal Details</div>
                <div className="text-sm text-gray-500">Your information</div>
              </div>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(currentStep - 2) * 100}%` }}
              />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                3
              </div>
              <div className="ml-4">
                <div className="font-medium">Review & Pay</div>
                <div className="text-sm text-gray-500">Confirm and complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => handleInputChange("date", date)}
                      className="w-full h-10 px-3 border rounded-md"
                      minDate={new Date()}
                      placeholderText="Choose a date"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adults</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleInputChange("adults", Math.max(1, formData.adults - 1))}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={formData.adults}
                          onChange={(e) => handleInputChange("adults", parseInt(e.target.value))}
                          min={1}
                          max={mockTour.maxGroupSize}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleInputChange("adults", Math.min(mockTour.maxGroupSize, formData.adults + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Children</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleInputChange("children", Math.max(0, formData.children - 1))}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={formData.children}
                          onChange={(e) => handleInputChange("children", parseInt(e.target.value))}
                          min={0}
                          max={mockTour.maxGroupSize - formData.adults}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleInputChange("children", Math.min(mockTour.maxGroupSize - formData.adults, formData.children + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requests</Label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="Any special requests or requirements?"
                      className="w-full h-32 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tour</span>
                        <span>{mockTour.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span>{formData.date?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adults</span>
                        <span>{formData.adults} × ₹{mockTour.price.toLocaleString()}</span>
                      </div>
                      {formData.children > 0 && (
                        <div className="flex justify-between">
                          <span>Children</span>
                          <span>{formData.children} × ₹{mockTour.price.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-24">
                        <CreditCard className="h-6 w-6 mr-2" />
                        Credit Card
                      </Button>
                      <Button variant="outline" className="h-24">
                        <CreditCard className="h-6 w-6 mr-2" />
                        Debit Card
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    className="ml-auto"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !validateStep1()) ||
                      (currentStep === 2 && !validateStep2())
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto">
                    Complete Booking
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Price per person</span>
                  <span>₹{mockTour.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of guests</span>
                  <span>{formData.adults + formData.children}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 