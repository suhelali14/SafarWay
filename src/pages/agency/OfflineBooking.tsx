import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Calendar, Users, Trash2, Upload, Lock, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { agencyAPI, TourPackage } from '../../services/api';
import { formatCurrency } from '../../lib/utils';
import { getUserData } from '../../utils/session';

// Interfaces
interface OfflineBookingFormData {
  tourPackageId: string;
  startDate: string;
  numberOfPeople: number;
  totalPrice: number;
  remarks?: string;
  travelers: Traveler[];
}

interface Traveler {
  fullName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber: string;
  documents: BookingDocument[];
}

interface BookingDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  fileUrl: string;
}

const OfflineBookingForm = () => {
  const navigate = useNavigate();
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    bookingId: string;
    paymentLink: string;
    paymentSessionId: string;
    platformFee: number;
    agencyPayoutAmount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const userData = getUserData();
  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<OfflineBookingFormData>({
    defaultValues: {
      tourPackageId: '',
      startDate: '',
      numberOfPeople: 1,
      totalPrice: 0,
      remarks: '',
      travelers: [{ fullName: '', dateOfBirth: '', phoneNumber: '', documents: [] }],
    },
  });
  const cashfree = (window as any).Cashfree({
    mode: 'sandbox', // Use sandbox for testing
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travelers',
  });

  const numberOfPeople = watch('numberOfPeople');
  const totalPrice = watch('totalPrice');
  const selectedTourPackageId = watch('tourPackageId');

  // Fetch agency tour packages
  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        setLoading(true);
        const response = await agencyAPI.getAllPackages({ agencyId: userData?.agencyId || undefined });
        setTourPackages(response.data.data);
      } catch (error) {
        console.error('Error fetching tour packages:', error);
        toast.error('Failed to load tour packages');
      } finally {
        setLoading(false);
      }
    };
    fetchTourPackages();
  }, []);

  // Auto-calculate totalPrice when tourPackageId or numberOfPeople changes
  useEffect(() => {
    if (selectedTourPackageId) {
      const selectedPackage = tourPackages.find((pkg) => pkg.id === selectedTourPackageId);
      if (selectedPackage) {
        const calculatedPrice = Math.round(selectedPackage.pricePerPerson * numberOfPeople);
        setValue('totalPrice', calculatedPrice, { shouldValidate: true });
      }
    } else {
      setValue('totalPrice', 0, { shouldValidate: true });
    }
  }, [selectedTourPackageId, numberOfPeople, tourPackages, setValue]);

  // Auto-assign startDate when tourPackageId changes
  useEffect(() => {
    if (selectedTourPackageId) {
      const selectedPackage = tourPackages.find((pkg) => pkg.id === selectedTourPackageId);
      if (selectedPackage && selectedPackage.startDate) {
        // Format startDate to YYYY-MM-DD
        const formattedDate = new Date(selectedPackage.startDate).toISOString().split('T')[0];
        setValue('startDate', formattedDate, { shouldValidate: true });
      }
    } else {
      setValue('startDate', '', { shouldValidate: true });
    }
  }, [selectedTourPackageId, tourPackages, setValue]);

  // Handle number of people change
  const handleNumberOfPeopleChange = (value: string) => {
    const numValue = parseInt(value);
    setValue('numberOfPeople', numValue);
    const currentTravelers = watch('travelers');

    if (numValue > currentTravelers.length) {
      for (let i = currentTravelers.length; i < numValue; i++) {
        append({ fullName: '', dateOfBirth: '', phoneNumber: '', documents: [] });
      }
    } else if (numValue < currentTravelers.length) {
      for (let i = currentTravelers.length - 1; i >= numValue; i--) {
        remove(i);
      }
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, travelerIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading((prev) => ({ ...prev, [travelerIndex]: true }));
      const file = files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF or image.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      const response = await agencyAPI.uploadDocument(formData);

      const uploadedDoc: BookingDocument = {
        id: Math.random().toString(36).substring(2),
        documentType: 'PASSPORT',
        documentNumber: `DOC-${Math.random().toString(36).substring(2, 8)}`,
        fileUrl: response.data.url,
      };

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
        e.target.value = '';
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

  // Form submission
  const onSubmit = async (data: OfflineBookingFormData) => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const hasPhone = data.travelers.some((traveler) => traveler.phoneNumber);
      if (!hasPhone) {
        toast.error('At least one traveler must provide a phone number');
        return;
      }

      const bookingData = {
        tourPackageId: data.tourPackageId,
        startDate: new Date(data.startDate).toISOString(),
        numberOfPeople: parseInt(String(data.numberOfPeople)),
        totalPrice: parseInt(String(data.totalPrice)),
        remarks: data.remarks,
        travelers: data.travelers.map((traveler) => ({
          fullName: traveler.fullName,
          dateOfBirth: new Date(traveler.dateOfBirth).toISOString(),
          email: traveler.email,
          phoneNumber: traveler.phoneNumber,
          documents: traveler.documents.map((doc) => ({
            documentType: doc.documentType,
            documentNumber: doc.documentNumber,
            fileUrl: doc.fileUrl,
          })),
        })),
      };

      const response = await agencyAPI.createOfflineBooking(bookingData);
      console.log('Booking response:', response);
      const paymentSessionId = response.data.paymentSessionId;
      const paymentLink = response.data.paymentLink;
    
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
            } 
            else {
              throw new Error('No payment session ID received for full payment');
            }
            setPaymentDetails(response.data);
    } catch (error) {
      console.error('Error creating offline booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Payment form component
  const PaymentForm = ({ bookingId, paymentLink, platformFee, agencyPayoutAmount }: {
    bookingId: string;
    paymentLink: string;
    platformFee: number;
    agencyPayoutAmount: number;
  }) => {
    const handlePayment = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        if (!paymentLink) {
          throw new Error('Payment URL not available');
        }
        // Redirect to Cashfree payment URL
        window.location.href = paymentLink;
      } catch (error) {
        console.error('Error initiating payment:', error);
        toast.error('Failed to initiate payment');
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handlePayment} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Payment Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Platform Fee (3%)</span>
              <span>{formatCurrency(platformFee, 'INR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Agency to Collect (Offline)</span>
              <span>{formatCurrency(agencyPayoutAmount, 'INR')}</span>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay Platform Fee <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  console.log("tourPackages---", tourPackages);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Offline Booking</h1>
        <p className="text-gray-600 mb-6">
          Create a booking for walk-in customers. Select a tour package and pay the 3% platform fee online to finalize.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              {(
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="tourPackageId">Tour Package*</Label>
                    <Select
                      onValueChange={(value) => setValue('tourPackageId', value)}
                      defaultValue=""
                    >
                      <SelectTrigger className={errors.tourPackageId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a tour package" />
                      </SelectTrigger>
                      <SelectContent>
                        {tourPackages.length === 0 ? (
                          <SelectItem value="" disabled>No packages available</SelectItem>
                        ) : (
                          tourPackages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                              {pkg.title} ({formatCurrency(pkg.pricePerPerson, 'INR')} per person)
                              <div>
                                <span className="text-sm text-gray-500">
                                  {pkg.duration} Days
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(pkg.pricePerPerson, 'INR')} per person
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register('tourPackageId', { required: 'Tour package is required' })}
                    />
                    {errors.tourPackageId && (
                      <p className="text-red-500 text-sm mt-1">{errors.tourPackageId.message}</p>
                    )}
                  </div>

                  <div className={!selectedTourPackageId ? 'hidden' : ''}>
                    <Label htmlFor="startDate">Start Date*</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register('startDate', {
                        required: 'Start date is required',
                        validate: {
                          matchesPackageDate: (value) => {
                            const selectedPackage = tourPackages.find((pkg) => pkg.id === selectedTourPackageId);
                            if (!selectedPackage || !selectedPackage.startDate) return true;
                            const packageDate = new Date(selectedPackage.startDate).toISOString().split('T')[0];
                            return value === packageDate || 'Start date must match the tour package start date';
                          },
                        },
                      })}
                      disabled={!!selectedTourPackageId}
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="numberOfPeople">Number of Travelers*</Label>
                    <Select
                      onValueChange={handleNumberOfPeopleChange}
                      defaultValue="1"
                    >
                      <SelectTrigger className={errors.numberOfPeople ? 'border-red-500' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>
                            {i + 1} {i === 0 ? 'Person' : 'People'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register('numberOfPeople', { required: 'Number of travelers is required' })}
                    />
                    {errors.numberOfPeople && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfPeople.message}</p>
                    )}
                  </div>

                  <div className={!selectedTourPackageId ? 'hidden' : ''}>
                    <Label htmlFor="totalPrice">Total Price (₹)*</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="1"
                      {...register('totalPrice', {
                        required: 'Total price is required',
                        min: {
                          value: tourPackages.find((pkg) => pkg.id === selectedTourPackageId)?.pricePerPerson || 0 * numberOfPeople ,
                          message: 'Total price cannot be less than the calculated price',
                        },
                        validate: {
                          matchesCalculated: (value) => {
                            const selectedPackage = tourPackages.find((pkg) => pkg.id === selectedTourPackageId);
                            const expectedPrice = selectedPackage ? Math.round(selectedPackage.pricePerPerson * numberOfPeople) : 0;
                            return value === expectedPrice || 'Total price must match the calculated price';
                          },
                        },
                        valueAsNumber: true,
                      })}
                      disabled={!!selectedTourPackageId}
                      className={errors.totalPrice ? 'border-red-500' : ''}
                    />
                    {errors.totalPrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.totalPrice.message}</p>
                    )}
                    {totalPrice > 0 && (
                      <div className="mt-2 space-y-1">
                        <p>Platform Fee (3%): {formatCurrency(totalPrice * 0.03, 'INR')}</p>
                        <p>Agency to Collect: {formatCurrency(totalPrice * 0.97, 'INR')}</p>
                      </div>
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

                      <div>
                        <Label htmlFor={`travelers.${index}.phoneNumber`}>Phone Number*</Label>
                        <Input
                          id={`travelers.${index}.phoneNumber`}
                          placeholder="Enter phone number"
                          {...register(`travelers.${index}.phoneNumber`, {
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9+\s()-]{7,15}$/,
                              message: 'Please enter a valid phone number',
                            },
                          })}
                          className={errors.travelers?.[index]?.phoneNumber ? 'border-red-500' : ''}
                        />
                        {errors.travelers?.[index]?.phoneNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.travelers[index].phoneNumber?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`travelers.${index}.email`}>Email (Optional)</Label>
                        <Input
                          id={`travelers.${index}.email`}
                          type="email"
                          placeholder="Enter email address"
                          {...register(`travelers.${index}.email`, {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
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
                        <h4 className="text-md font-semibold mb-2">Travel Documents</h4>
                        <div className="relative">
                          <Label
                            htmlFor={`document-upload-${index}`}
                            className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                              <p className="text-sm font-medium text-gray-700">Click to upload documents</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB)</p>
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
                            handleNumberOfPeopleChange(`${numberOfPeople - 1}`);
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
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Textarea
                      id="remarks"
                      placeholder="Any additional notes or remarks"
                      {...register('remarks')}
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
              )}
            </div>
          </div>

          {/* Booking summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 animate-slide-up">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              {selectedTourPackageId && tourPackages.find((pkg) => pkg.id === selectedTourPackageId) ? (
                <>
                  <div className="mb-4">
                    <img
                      src={tourPackages.find((pkg) => pkg.id === selectedTourPackageId)?.coverImage}
                      alt={tourPackages.find((pkg) => pkg.id === selectedTourPackageId)?.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">
                      {tourPackages.find((pkg) => pkg.id === selectedTourPackageId)?.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{tourPackages.find((pkg) => pkg.id === selectedTourPackageId)?.duration} Days</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{numberOfPeople} {numberOfPeople === 1 ? 'Person' : 'People'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">Select a tour package to view details</p>
              )}

              <div className="space-y-2 pb-4 mb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price</span>
                  <span>{formatCurrency(totalPrice, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (3%)</span>
                  <span>{formatCurrency(totalPrice * 0.03, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Collect Offline</span>
                  <span>{formatCurrency(totalPrice * 0.97, 'INR')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Secure payment with Cashfree for the 3% platform fee. Collect the remaining amount offline from the customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBookingForm;