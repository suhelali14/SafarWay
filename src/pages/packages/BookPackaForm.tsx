import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowRight, Calendar, Users, Trash2, Upload, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { customerAPI } from '../../services/api'; // Import API service
import { formatCurrency } from '../../lib/utils';

// Define interfaces
import { TourPackage } from '../../services/api';

interface BookingFormData {
  tourPackageId: string;
  numberOfPeople: number;
  paymentMode: 'FULL' | 'PARTIAL';
  travelers: Traveler[];
  specialRequests?: string;
}

interface Traveler {
  fullName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
  documents: BookingDocument[];
  useContactInfo: boolean;
}

interface BookingDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  fileUrl: string;
}

interface BookPackageFormProps {
  tourPackage: TourPackage;
}

export default function BookPackageForm({ tourPackage }: BookPackageFormProps) {
  const navigate = useNavigate();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  // Initialize Cashfree SDK
  const cashfree = (window as any).Cashfree({
    mode: 'sandbox', // Use sandbox for testing
  });

  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<BookingFormData>({
    defaultValues: {
      tourPackageId: tourPackage.id,
      numberOfPeople: 1,
      paymentMode: 'FULL',
      travelers: [{ fullName: '', dateOfBirth: '', useContactInfo: true, documents: [] }],
      specialRequests: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travelers',
  });

  // Calculate total price
  const pricePerPerson = tourPackage.price ?? tourPackage.pricePerPerson;
  const totalPrice = pricePerPerson * numberOfPeople;

  // Handle document upload (simulated)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, travelerIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading((prev) => ({ ...prev, [travelerIndex]: true }));
      const file = files[0];

      // Maximum file size: 5 MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }

      // Allowed file types
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, image, or Word document.');
        return;
      }

      // Simulate document upload (replace with real storage service like AWS S3)
      const uploadedDoc: BookingDocument = {
        id: Math.random().toString(36).substring(2),
        documentType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        documentNumber: `DOC-${Math.random().toString(36).substring(2, 8)}`, // Simulated document number
        fileUrl: URL.createObjectURL(file),
      };

      // Update traveler documents
      const currentTravelers = watch('travelers');
      const updatedDocuments = [...(currentTravelers[travelerIndex].documents || []), uploadedDoc];
      setValue(`travelers.${travelerIndex}.documents`, updatedDocuments);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading((prev) => ({ ...prev, [travelerIndex]: false }));
      if (e.target) {
        e.target.value = ''; // Reset the input
      }
    }
  };

  // Handle document removal
  const handleRemoveDocument = (travelerIndex: number, docId: string) => {
    const currentTravelers = watch('travelers');
    const updatedDocuments = currentTravelers[travelerIndex].documents?.filter((doc) => doc.id !== docId) || [];
    setValue(`travelers.${travelerIndex}.documents`, updatedDocuments);
    toast.info('Document removed');
  };

  // Handle number of people change
  const handleNumberOfPeopleChange = (value: number) => {
    setNumberOfPeople(value);
    setValue('numberOfPeople', value);
    const currentTravelers = watch('travelers');

    // Add or remove traveler fields
    if (value > currentTravelers.length) {
      for (let i = currentTravelers.length; i < value; i++) {
        append({ fullName: '', dateOfBirth: '', useContactInfo: i === 0, documents: [] });
      }
    } else if (value < currentTravelers.length) {
      for (let i = currentTravelers.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  // Form submission
  const onSubmit = async (data: BookingFormData) => {
    // Validate at least one email and phone
    
    const hasEmail = data.travelers.some((traveler) => traveler.email && traveler.useContactInfo);
    const hasPhone = data.travelers.some((traveler) => traveler.phoneNumber && traveler.useContactInfo);

    if (!hasEmail || !hasPhone) {
      toast.error('At least one traveler must provide an email and phone number');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    try {
      // Format data for backend
      const bookingData = {
        tourPackageId: data.tourPackageId,
        startDate: new Date(tourPackage.startDate).toISOString(),
        endDate: tourPackage.endDate ? new Date(tourPackage.endDate).toISOString() : undefined,
        numberOfPeople: parseInt(String(data.numberOfPeople)),
        paymentMode: data.paymentMode,
        travelers: data.travelers.map((traveler) => ({
          fullName: traveler.fullName,
          dateOfBirth: new Date(traveler.dateOfBirth).toISOString(),
          email: traveler.useContactInfo ? traveler.email : undefined,
          phoneNumber: traveler.useContactInfo ? traveler.phoneNumber : undefined,
          documents: traveler.documents.map((doc) => ({
            documentType: doc.documentType,
            documentNumber: doc.documentNumber,
            fileUrl: doc.fileUrl,
          })),
        })),
        specialRequests: data.specialRequests,
      };

      // Call backend API to create booking
      const response = await customerAPI.createBooking(bookingData);
      const bookingId = response.data.id;
      const paymentSessionId = response.data.paymentSessionId;
      const paymentLink = response.data.paymentLink;

      console.log('Booking created:', { bookingId, paymentSessionId, paymentLink });

      if (paymentSessionId && paymentLink) {
        // Open Cashfree checkout
        const checkoutOptions = {
          paymentSessionId,
          redirectTarget: '_self', // Open in same tab
        };

        try {
          await cashfree.checkout(checkoutOptions);
        } catch (error) {
          console.error('Error opening Cashfree checkout:', error);
          toast.error('Failed to open payment page. Please try again.');
        }
      } else if (data.paymentMode === 'PARTIAL') {
        // Partial payment: navigate to booking details
        toast.success('Booking created. Awaiting agency approval.');
        navigate(`/bookings/${bookingId}`);
      } else {
        throw new Error('No payment session ID received for full payment');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
     
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
    
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600">

          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Include Cashfree JS SDK */}
      <div className={`${loading ? "container mx-auto px-4 py-12" :""}`} >
      <div className={loading ? "flex justify-center items-center" : "container mx-auto px-4 py-2"}>
        <div className={`${loading ? "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" : "max-w-7xl mx-auto"}`}>
          <h1 className="text-3xl font-bold mb-2">Book Your Tour</h1>
          <p className="text-gray-600 mb-6">
            Fill in your details to book {tourPackage.title}. At least one traveler must provide an email and phone number.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Traveler Information</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="numberOfPeople">Number of Travelers*</Label>
                    <div className="relative">
                      <select
                        id="numberOfPeople"
                        {...register('numberOfPeople', { required: true })}
                        className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleNumberOfPeopleChange(parseInt(e.target.value))}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} {i === 0 ? 'Person' : 'People'}
                          </option>
                        ))}
                      </select>
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    {errors.numberOfPeople && (
                      <p className="text-red-500 text-sm mt-1">Number of travelers is required</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="paymentMode">Payment Mode*</Label>
                    <select
                      id="paymentMode"
                      {...register('paymentMode', { required: true })}
                      className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="FULL">Full Payment</option>
                      <option value="PARTIAL">Partial Payment (₹5000)</option>
                    </select>
                    {errors.paymentMode && (
                      <p className="text-red-500 text-sm mt-1">Payment mode is required</p>
                    )}
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border-b pb-6 mb-6">
                      <h3 className="text-lg font-semibold">Traveler {index + 1}</h3>
                      <div>
                        <Label htmlFor={`travelers.${index}.fullName`}>Full Name*</Label>
                        <Input
                          id={`travelers.${index}.fullName`}
                          placeholder="Enter full name"
                          {...register(`travelers.${index}.fullName`, {
                            required: 'Full name is required',
                          })}
                          className={errors.travelers?.[index]?.fullName ? 'border-red-500' : ''}
                        />
                        {errors.travelers?.[index]?.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.travelers[index].fullName?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`travelers.${index}.dateOfBirth`}>Date of Birth*</Label>
                        <Input
                          id={`travelers.${index}.dateOfBirth`}
                          type="date"
                          {...register(`travelers.${index}.dateOfBirth`, {
                            required: 'Date of birth is required',
                          })}
                          className={errors.travelers?.[index]?.dateOfBirth ? 'border-red-500' : ''}
                        />
                        {errors.travelers?.[index]?.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.travelers[index].dateOfBirth?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`travelers.${index}.useContactInfo`}
                          {...register(`travelers.${index}.useContactInfo`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor={`travelers.${index}.useContactInfo`}>
                          Provide contact information
                        </Label>
                      </div>

                      {watch(`travelers.${index}.useContactInfo`) && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`travelers.${index}.email`}>Email {index === 0 ? '*' : ''}</Label>
                            <Input
                              id={`travelers.${index}.email`}
                              type="email"
                              placeholder="Enter email address"
                              {...register(`travelers.${index}.email`, {
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address',
                                },
                                required: index === 0 ? 'Email is required for at least one traveler' : false,
                              })}
                              className={errors.travelers?.[index]?.email ? 'border-red-500' : ''}
                            />
                            {errors.travelers?.[index]?.email && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.travelers[index].email?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`travelers.${index}.phoneNumber`}>Phone Number {index === 0 ? '*' : ''}</Label>
                            <Input
                              id={`travelers.${index}.phoneNumber`}
                              placeholder="Enter phone number"
                              {...register(`travelers.${index}.phoneNumber`, {
                                pattern: {
                                  value: /^[0-9+\s()-]{7,15}$/,
                                  message: 'Please enter a valid phone number',
                                },
                                required: index === 0 ? 'Phone number is required for at least one traveler' : false,
                              })}
                              className={errors.travelers?.[index]?.phoneNumber ? 'border-red-500' : ''}
                            />
                            {errors.travelers?.[index]?.phoneNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.travelers[index].phoneNumber?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-md font-semibold mb-2">Travel Documents</h4>
                        <div className="relative">
                          <Label
                            htmlFor={`document-upload-${index}`}
                            className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                              <p className="text-sm font-medium text-gray-700">Click to upload documents</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG or DOC (max 5MB)</p>
                            </div>
                          </Label>
                          <Input
                            id={`document-upload-${index}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(e, index)}
                            disabled={isUploading[index]}
                          />
                        </div>

                        {watch(`travelers.${index}.documents`)?.length > 0 && (
                          <div className="space-y-2 mt-4">
                            {watch(`travelers.${index}.documents`).map((doc: BookingDocument) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
                                <div className="flex items-center">
                                  <Lock className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="text-sm truncate max-w-xs">{doc.documentType}: {doc.documentNumber}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDocument(index, doc.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            handleNumberOfPeopleChange(numberOfPeople - 1);
                            remove(index);
                          }}
                          className="mt-2"
                        >
                          Remove Traveler
                        </Button>
                      )}
                    </div>
                  ))}

                  <Separator />

                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any special requirements or requests"
                      {...register('specialRequests')}
                      className="h-24"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Payment'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Booking summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

                <div className="mb-4">
                  <img
                    src={tourPackage.coverImage}
                    alt={tourPackage.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">{tourPackage.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{tourPackage.duration} Days</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{numberOfPeople} {numberOfPeople === 1 ? 'Person' : 'People'}</span>
                  </div>
                </div>

                <div className="space-y-2 pb-4 mb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span>{formatCurrency(pricePerPerson, 'INR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of travelers</span>
                    <span>× {numberOfPeople}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span className="text-blue-600">{formatCurrency(totalPrice, 'INR')}</span>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Secure booking with Cashfree. Choose full or partial payment (₹5000) on the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}