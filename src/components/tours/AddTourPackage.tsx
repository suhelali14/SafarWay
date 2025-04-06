import { useState } from "react"
import { MapPin, Calendar as CalendarIcon, Users, Clock, IndianRupee, Image as ImageIcon, Plus, Trash2, Check, AlertCircle, Camera, Mountain, Navigation, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Alert, AlertDescription } from "../../components/ui/alert"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format } from "date-fns"

interface Activity {
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}

interface DayItinerary {
  title: string;
  description: string;
  date: Date | null;
  activities: Activity[];
  accommodation?: {
    name: string;
    type: 'hotel' | 'resort' | 'homestay' | 'camping' | 'other';
    rating?: number;
    notes?: string;
  };
  transport?: {
    type: 'car' | 'bus' | 'train' | 'flight' | 'other';
    details: string;
  };
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
}

interface TourPackage {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  minAge: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tourType: string;
  startLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  highlights: string[];
  itinerary: DayItinerary[];
  included: string[];
  excluded: string[];
  images: File[];
  coverImage: File | null;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  cancellationPolicy: string;
  additionalInfo: string;
}

interface StepValidation {
  isValid: boolean
  errors: string[]
}

interface FormStep {
  id: string
  label: string
  isCompleted: boolean
  validation: StepValidation
}

interface DatePickerInputProps {
  dayIndex: number
  handleItineraryChange: (dayIndex: number, field: string, value: any) => void
  selectedDate: Date | null
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ dayIndex, handleItineraryChange, selectedDate }) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => handleItineraryChange(dayIndex, "date", date)}
        dateFormat="dd MMM, yyyy"
        placeholderText="Select date"
        minDate={new Date()}
        className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        showPopperArrow={false}
      />
    </div>
  );
};

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => (
  <div className="relative mt-8 mb-12">
    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
    {itinerary.map((day, index) => (
      <div key={index} className="relative pl-16 pb-8">
        <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md"></div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Day {index + 1}</h3>
            {day.date && (
              <span className="text-sm text-gray-500">
                {new Date(day.date).toLocaleDateString()}
              </span>
            )}
          </div>
          <h4 className="text-blue-600 font-medium mb-2">{day.title || 'Untitled'}</h4>
          <p className="text-gray-600 text-sm mb-3">{day.description || 'No description'}</p>
          
          {day.activities && day.activities.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Activities:</h5>
              <div className="grid gap-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                    <div className="w-1 self-stretch bg-blue-200 rounded"></div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.startTime} - {activity.endTime}
                      </div>
                      {activity.description && (
                        <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3">
            {/* Accommodation */}
            {day.accommodation && (
              <div className="bg-green-50 p-3 rounded-md">
                <h5 className="text-sm font-medium text-green-700 mb-1">Accommodation</h5>
                <div className="text-sm text-green-600">
                  <div className="font-medium">{day.accommodation.name}</div>
                  <div className="text-green-500">{day.accommodation.type}</div>
                  {day.accommodation.notes && (
                    <div className="mt-1 text-green-600">{day.accommodation.notes}</div>
                  )}
                </div>
              </div>
            )}

            {/* Transport */}
            {day.transport && (
              <div className="bg-purple-50 p-3 rounded-md">
                <h5 className="text-sm font-medium text-purple-700 mb-1">Transport</h5>
                <div className="text-sm text-purple-600">
                  <div className="font-medium">{day.transport.type}</div>
                  <div className="text-purple-500">{day.transport.details}</div>
                </div>
              </div>
            )}

            {/* Meals */}
            {(day.breakfast || day.lunch || day.dinner) && (
              <div className="bg-orange-50 p-3 rounded-md">
                <h5 className="text-sm font-medium text-orange-700 mb-2">Included Meals</h5>
                <div className="flex gap-2 text-sm">
                  {day.breakfast && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">Breakfast</span>
                  )}
                  {day.lunch && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">Lunch</span>
                  )}
                  {day.dinner && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">Dinner</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export function AddTourPackage() {
  const [activeStep, setActiveStep] = useState("basic")
  const [steps, setSteps] = useState<FormStep[]>([
    { id: "basic", label: "Basic Info", isCompleted: false, validation: { isValid: false, errors: [] } },
    { id: "details", label: "Details", isCompleted: false, validation: { isValid: false, errors: [] } },
    { id: "itinerary", label: "Itinerary", isCompleted: false, validation: { isValid: false, errors: [] } },
    { id: "media", label: "Media", isCompleted: false, validation: { isValid: false, errors: [] } },
    { id: "additional", label: "Additional Info", isCompleted: false, validation: { isValid: false, errors: [] } }
  ])

  const initialTourData: TourPackage = {
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    duration: 0,
    maxGroupSize: 0,
    minAge: 0,
    difficulty: 'easy',
    tourType: '',
    startLocation: {
      lat: 0,
      lng: 0,
      name: ''
    },
    endLocation: {
      lat: 0,
      lng: 0,
      name: ''
    },
    highlights: [],
    itinerary: [{
      title: 'Day 1',
      description: '',
      date: null,
      activities: [{
        title: '',
        startTime: '',
        endTime: '',
        description: ''
      }],
      breakfast: false,
      lunch: false,
      dinner: false
    }],
    included: [],
    excluded: [],
    images: [],
    coverImage: null,
    contactInfo: {
      phone: '',
      email: '',
      whatsapp: ''
    },
    cancellationPolicy: '',
    additionalInfo: ''
  };

  const [tourData, setTourData] = useState<TourPackage>(initialTourData);

  const [isLoading, setIsLoading] = useState(false)
  const [visibleSection, setVisibleSection] = useState<"basic" | "details" | "itinerary" | "media" | "additional">("basic")

  const handleBasicInfoChange = (field: string, value: string | number) => {
    setTourData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleListChange = (field: 'included' | 'excluded' | 'highlights', index: number, value: string) => {
    setTourData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (
        i === index ? value : item
      ))
    }));
  };

  const handleAddListItem = (field: 'included' | 'excluded' | 'highlights') => {
    setTourData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveListItem = (field: 'included' | 'excluded' | 'highlights', index: number) => {
    setTourData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleItineraryChange = (dayIndex: number, field: string, value: any) => {
    setTourData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      )
    }))
  }

  const handleAddDay = () => {
    setTourData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          title: '',
          description: '',
          date: null,
          activities: [],
          accommodation: undefined,
          transport: undefined,
          breakfast: false,
          lunch: false,
          dinner: false
        }
      ]
    }));
  };

  const handleAddActivity = (dayIndex: number) => {
    setTourData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) => {
        if (idx === dayIndex) {
          return {
            ...day,
            activities: [
              ...day.activities,
              {
                title: '',
                startTime: '',
                endTime: '',
                description: ''
              }
            ]
          };
        }
        return day;
      })
    }));
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, field: keyof Activity, value: string) => {
    setTourData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) => {
        if (idx === dayIndex) {
          return {
            ...day,
            activities: day.activities.map((activity, actIdx) => {
              if (actIdx === activityIndex) {
                return {
                  ...activity,
                  [field]: value
                };
              }
              return activity;
            })
          };
        }
        return day;
      })
    }));
  };

  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    setTourData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((d, idx) => 
        idx === dayIndex ? {
          ...d,
          activities: d.activities.filter((_, i) => i !== activityIndex)
        } : d
      )
    }));
  };

  const handleDeleteDay = (dayIndex: number) => {
    if (tourData.itinerary.length > 1) {
      setTourData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, index) => index !== dayIndex)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log(tourData)
  }

  const validateBasicInfo = (): StepValidation => {
    const errors: string[] = [];
    const { title, duration, maxGroupSize, price, tourType } = tourData;

    if (!title) errors.push("Tour title is required");
    if (duration < 1) errors.push("Duration must be at least 1 day");
    if (maxGroupSize < 1) errors.push("Group size must be at least 1");
    if (price < 0) errors.push("Price cannot be negative");
    if (!tourType) errors.push("Tour type is required");

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  const validateDetails = (): StepValidation => {
    const errors: string[] = []
    
    if (!tourData.description) errors.push("Tour description is required")
    if (tourData.highlights.length === 0 || !tourData.highlights[0]) errors.push("At least one highlight is required")
    if (tourData.included.length === 0 || !tourData.included[0]) errors.push("At least one included item is required")

    return { isValid: errors.length === 0, errors }
  }

  const validateItinerary = (): StepValidation => {
    return { isValid: true, errors: [] }
  }

  const validateMedia = (): StepValidation => {
    const errors: string[] = []
    
    if (!tourData.coverImage) errors.push("Cover image is required")
    if (tourData.images.length === 0) errors.push("At least one gallery image is required")

    return { isValid: errors.length === 0, errors }
  }

  const validateAdditional = (): StepValidation => {
    const errors: string[] = []
    const { phone, email } = tourData.contactInfo
    
    if (!phone) errors.push("Contact phone is required")
    if (!email) errors.push("Contact email is required")
    if (!tourData.cancellationPolicy) errors.push("Cancellation policy is required")

    return { isValid: errors.length === 0, errors }
  }

  const validateStep = (stepId: string): StepValidation => {
    switch (stepId) {
      case "basic": return validateBasicInfo()
      case "details": return validateDetails()
      case "itinerary": return validateItinerary()
      case "media": return validateMedia()
      case "additional": return validateAdditional()
      default: return { isValid: false, errors: [] }
    }
  }

  const handleStepChange = (stepId: string) => {
    const currentStepIndex = steps.findIndex(step => step.id === activeStep)
    const targetStepIndex = steps.findIndex(step => step.id === stepId)
    
    // Validate current step before allowing to proceed
    const validation = validateStep(activeStep)
    
    setSteps(prev => prev.map(step => 
      step.id === activeStep 
        ? { ...step, validation, isCompleted: validation.isValid }
        : step
    ))

    // Only allow moving forward if current step is valid
    if (targetStepIndex > currentStepIndex && !validation.isValid) {
      return false // Return false if validation fails
    }

    setActiveStep(stepId)
    return true // Return true if step change is successful
  }

  const isStepAccessible = (stepId: string): boolean => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const previousSteps = steps.slice(0, stepIndex)
    return previousSteps.every(step => step.isCompleted)
  }

  const getStepStatus = (stepId: string): "completed" | "current" | "upcoming" | "error" => {
    const step = steps.find(s => s.id === stepId)
    if (!step) return "upcoming"
    
    if (step.id === activeStep) return "current"
    if (!step.isCompleted && step.validation.errors.length > 0) return "error"
    if (step.isCompleted) return "completed"
    return "upcoming"
  }

  const getStepStyles = (status: "completed" | "current" | "upcoming" | "error") => {
    switch (status) {
      case "completed":
        return {
          button: "hover:bg-emerald-50",
          circle: "bg-emerald-100 text-emerald-600",
          text: "text-emerald-600"
        }
      case "current":
        return {
          button: "bg-blue-50",
          circle: "bg-blue-100 text-blue-600",
          text: "text-blue-600"
        }
      case "error":
        return {
          button: "hover:bg-red-50",
          circle: "bg-red-100 text-red-600",
          text: "text-red-600"
        }
      default:
        return {
          button: "hover:bg-gray-50",
          circle: "bg-gray-100 text-gray-600",
          text: "text-gray-600"
        }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Welcome Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
        <h1 className="text-lg font-medium text-gray-900">Welcome back, Mountain Adventures</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar - Progress */}
        <div className="w-[320px] p-6 bg-white border-r border-gray-200 sticky top-[60px] h-[calc(100vh-60px)] overflow-auto z-10">
          <h2 className="text-base font-medium text-gray-900 mb-4">Progress</h2>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id)
              const styles = getStepStyles(status)
              
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    handleStepChange(step.id)
                    setVisibleSection(step.id as "basic" | "details" | "itinerary" | "media" | "additional")
                  }}
                  disabled={!isStepAccessible(step.id)}
                  className={`w-full flex items-center p-3 rounded-md text-sm transition-all duration-200 ${styles.button} ${
                    !isStepAccessible(step.id) ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${styles.circle} transition-all duration-200`}>
                    {status === "completed" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`${styles.text} font-medium`}>
                    {step.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 relative">
          <div className="max-w-[1000px] p-6 relative">
            {/* Validation Errors */}
            {steps.find(step => step.id === activeStep)?.validation.errors.map((error, index) => (
              <div key={index} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm animate-in slide-in-from-top duration-300 relative z-10">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-red-600 font-medium">
                    {error}
                  </div>
                </div>
              </div>
            ))}

            {/* Form Content */}
            <div className={`space-y-8 transition-all duration-300 relative ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {visibleSection === "basic" && (
                <div className="animate-in slide-in-from-right duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the fundamental details of your tour package
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Tour Title
                      </Label>
                      <Input
                        id="title"
                        value={tourData.title}
                        onChange={(e) => handleBasicInfoChange("title", e.target.value)}
                        placeholder="Enter an attractive title"
                        className="h-11 px-4 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
                        Subtitle
                      </Label>
                      <Input
                        id="subtitle"
                        value={tourData.subtitle}
                        onChange={(e) => handleBasicInfoChange("subtitle", e.target.value)}
                        placeholder="A brief, catchy description"
                        className="h-11 px-4 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                        Duration (Days)
                      </Label>
                      <div className="relative">
                        <Input
                          id="duration"
                          type="number"
                          min={1}
                          value={tourData.duration}
                          onChange={(e) => handleBasicInfoChange("duration", parseInt(e.target.value))}
                          className="h-11 pl-10 pr-4 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        />
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groupSize" className="text-sm font-medium text-gray-700">
                        Max Group Size
                      </Label>
                      <div className="relative">
                        <Input
                          id="groupSize"
                          type="number"
                          min={1}
                          value={tourData.maxGroupSize}
                          onChange={(e) => handleBasicInfoChange("maxGroupSize", parseInt(e.target.value))}
                          className="h-11 pl-10 pr-4 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        />
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Price per Person
                      </Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          value={tourData.price}
                          onChange={(e) => handleBasicInfoChange("price", parseInt(e.target.value))}
                          className="h-11 pl-10 pr-4 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        />
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tourType" className="text-sm font-medium text-gray-700">
                        Tour Type
                      </Label>
                      <Select
                        value={tourData.tourType}
                        onValueChange={(value) => handleBasicInfoChange("tourType", value)}
                      >
                        <SelectTrigger className="h-11 pl-10 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                          <Mountain className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Select tour type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                          <SelectItem value="adventure" className="py-2.5 pl-8 pr-3 hover:bg-blue-50 cursor-pointer relative">
                            Adventure
                          </SelectItem>
                          <SelectItem value="cultural" className="py-2.5 pl-8 pr-3 hover:bg-blue-50 cursor-pointer relative">
                            Cultural
                          </SelectItem>
                          <SelectItem value="wildlife" className="py-2.5 pl-8 pr-3 hover:bg-blue-50 cursor-pointer relative">
                            Wildlife
                          </SelectItem>
                          <SelectItem value="religious" className="py-2.5 pl-8 pr-3 hover:bg-blue-50 cursor-pointer relative">
                            Religious
                          </SelectItem>
                          <SelectItem value="heritage" className="py-2.5 pl-8 pr-3 hover:bg-blue-50 cursor-pointer relative">
                            Heritage
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {visibleSection === "details" && (
                <div className="animate-in slide-in-from-right duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Tour Details</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Provide comprehensive information about your tour package
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Tour Description
                      </Label>
                      <Textarea
                        id="description"
                        value={tourData.description}
                        onChange={(e) => setTourData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Write a detailed description of your tour..."
                        className="min-h-[150px] transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-y"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="highlights" className="text-base font-medium text-gray-900">
                          Tour Highlights
                        </Label>
                        <Button
                          type="button"
                          onClick={() => handleAddListItem("highlights")}
                          className="h-8 px-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Highlight
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {tourData.highlights.map((highlight, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={highlight}
                              onChange={(e) => handleListChange("highlights", index, e.target.value)}
                              placeholder="Enter a tour highlight"
                              className="h-11 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                            />
                            <Button
                              type="button"
                              onClick={() => handleRemoveListItem("highlights", index)}
                              className="h-11 px-3 text-red-600 hover:bg-red-50 transition-colors rounded-md"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="included" className="text-base font-medium text-gray-900">
                          What's Included
                        </Label>
                        <Button
                          type="button"
                          onClick={() => handleAddListItem("included")}
                          className="h-8 px-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {tourData.included.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => handleListChange("included", index, e.target.value)}
                              placeholder="Enter an included item"
                              className="h-11 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                            />
                            <Button
                              type="button"
                              onClick={() => handleRemoveListItem("included", index)}
                              className="h-11 px-3 text-red-600 hover:bg-red-50 transition-colors rounded-md"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="excluded" className="text-base font-medium text-gray-900">
                          What's Not Included
                        </Label>
                        <Button
                          type="button"
                          onClick={() => handleAddListItem("excluded")}
                          className="h-8 px-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {tourData.excluded.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => handleListChange("excluded", index, e.target.value)}
                              placeholder="Enter a not included item"
                              className="h-11 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                            />
                            <Button
                              type="button"
                              onClick={() => handleRemoveListItem("excluded", index)}
                              className="h-11 px-3 text-red-600 hover:bg-red-50 transition-colors rounded-md"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {visibleSection === "itinerary" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tour Itinerary</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-8">
                        {tourData.itinerary.map((day, dayIndex) => (
                          <div key={dayIndex} className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">Day {dayIndex + 1}</h3>
                              <button
                                type="button"
                                onClick={() => handleDeleteDay(dayIndex)}
                                className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:scale-105"
                                title="Delete Day"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                              {/* Date Field */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Date</Label>
                                <DatePickerInput
                                  dayIndex={dayIndex}
                                  handleItineraryChange={handleItineraryChange}
                                  selectedDate={day.date}
                                />
                              </div>

                              {/* Description */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Description</Label>
                                <Textarea
                                  value={day.description}
                                  onChange={(e) => handleItineraryChange(dayIndex, "description", e.target.value)}
                                  placeholder="Describe the day's itinerary..."
                                  className="min-h-[100px] resize-y"
                                />
                              </div>

                              {/* Activities */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Label className="text-base font-medium text-gray-900">Activities</Label>
                                  <Button
                                    type="button"
                                    onClick={() => handleAddActivity(dayIndex)}
                                    className="h-8 px-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md flex items-center gap-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Activity
                                  </Button>
                                </div>

                                <div className="space-y-4">
                                  {day.activities.map((activity, actIndex) => (
                                    <div key={actIndex} className="bg-gray-50 rounded-lg p-4 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <Input
                                          value={activity.title}
                                          onChange={(e) => handleActivityChange(dayIndex, actIndex, "title", e.target.value)}
                                          placeholder="Activity Title"
                                          className="flex-1 mr-2"
                                        />
                                        <Button
                                          type="button"
                                          onClick={() => handleRemoveActivity(dayIndex, actIndex)}
                                          className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm text-gray-600">Start Time</Label>
                                          <Input
                                            type="time"
                                            value={activity.startTime}
                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, "startTime", e.target.value)}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm text-gray-600">End Time</Label>
                                          <Input
                                            type="time"
                                            value={activity.endTime}
                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, "endTime", e.target.value)}
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-600">Description</Label>
                                        <Textarea
                                          value={activity.description || ''}
                                          onChange={(e) => handleActivityChange(dayIndex, actIndex, "description", e.target.value)}
                                          placeholder="Describe the activity..."
                                          className="min-h-[80px]"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Accommodation */}
                              <div className="space-y-4">
                                <Label className="text-base font-medium text-gray-900">Accommodation</Label>
                                <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">Name</Label>
                                    <Input
                                      value={day.accommodation?.name || ''}
                                      onChange={(e) => handleItineraryChange(dayIndex, "accommodation", {
                                        ...day.accommodation,
                                        name: e.target.value
                                      })}
                                      placeholder="Hotel/Resort name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">Type</Label>
                                    <Select
                                      value={day.accommodation?.type || 'hotel'}
                                      onValueChange={(value) => handleItineraryChange(dayIndex, "accommodation", {
                                        ...day.accommodation,
                                        type: value
                                      })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="hotel">Hotel</SelectItem>
                                        <SelectItem value="resort">Resort</SelectItem>
                                        <SelectItem value="homestay">Homestay</SelectItem>
                                        <SelectItem value="camping">Camping</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-2 space-y-2">
                                    <Label className="text-sm text-gray-600">Notes</Label>
                                    <Textarea
                                      value={day.accommodation?.notes || ''}
                                      onChange={(e) => handleItineraryChange(dayIndex, "accommodation", {
                                        ...day.accommodation,
                                        notes: e.target.value
                                      })}
                                      placeholder="Any additional notes about accommodation..."
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Transport */}
                              <div className="space-y-4">
                                <Label className="text-base font-medium text-gray-900">Transport</Label>
                                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">Type</Label>
                                    <Select
                                      value={day.transport?.type || 'car'}
                                      onValueChange={(value) => handleItineraryChange(dayIndex, "transport", {
                                        ...day.transport,
                                        type: value
                                      })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="car">Car</SelectItem>
                                        <SelectItem value="bus">Bus</SelectItem>
                                        <SelectItem value="train">Train</SelectItem>
                                        <SelectItem value="flight">Flight</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">Details</Label>
                                    <Input
                                      value={day.transport?.details || ''}
                                      onChange={(e) => handleItineraryChange(dayIndex, "transport", {
                                        ...day.transport,
                                        details: e.target.value
                                      })}
                                      placeholder="Transport details"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Meals */}
                              <div className="space-y-4">
                                <Label className="text-base font-medium text-gray-900">Included Meals</Label>
                                <div className="flex gap-4 bg-orange-50 p-4 rounded-lg">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={day.breakfast}
                                      onChange={(e) => handleItineraryChange(dayIndex, "breakfast", e.target.checked)}
                                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-200"
                                    />
                                    <span className="text-sm text-orange-700">Breakfast</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={day.lunch}
                                      onChange={(e) => handleItineraryChange(dayIndex, "lunch", e.target.checked)}
                                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-200"
                                    />
                                    <span className="text-sm text-orange-700">Lunch</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={day.dinner}
                                      onChange={(e) => handleItineraryChange(dayIndex, "dinner", e.target.checked)}
                                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-200"
                                    />
                                    <span className="text-sm text-orange-700">Dinner</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleAddDay}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 px-4 rounded-lg border-2 border-dashed border-blue-200 transition-colors duration-200"
                      >
                        + Add New Day
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {visibleSection === "media" && (
                <div className="animate-in slide-in-from-right duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Tour Media</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload images related to your tour package
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Cover Image Upload */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Cover Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors bg-white">
                        <div className="flex flex-col items-center justify-center gap-3">
                          {tourData.coverImage ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(tourData.coverImage)}
                                alt="Cover"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                onClick={() => setTourData(prev => ({ ...prev, coverImage: null }))}
                                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white shadow-md hover:bg-gray-50 text-red-600 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <Camera className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="text-center">
                                <Button
                                  type="button"
                                  onClick={() => document.getElementById('coverImage')?.click()}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                  Upload a cover image
                                </Button>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG or JPEG (max. 10MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                id="coverImage"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setTourData(prev => ({ ...prev, coverImage: file }))
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Gallery Images</Label>
                        <Button
                          type="button"
                          onClick={() => document.getElementById('galleryImages')?.click()}
                          className="h-8 px-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Images
                        </Button>
                        <input
                          type="file"
                          id="galleryImages"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setTourData(prev => ({
                              ...prev,
                              images: [...prev.images, ...files]
                            }))
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {tourData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                onClick={() => {
                                  setTourData(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))
                                }}
                                className="h-8 w-8 p-0 bg-white shadow-md hover:bg-gray-50 text-red-600 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {tourData.images.length === 0 && (
                          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 p-4 bg-white">
                            <Camera className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500 text-center">
                              No gallery images yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {visibleSection === "additional" && (
                <div className="animate-in slide-in-from-right duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Provide contact details and other important information
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Contact Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                              Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="phone"
                                type="tel"
                                value={tourData.contactInfo.phone}
                                onChange={(e) => setTourData(prev => ({
                                  ...prev,
                                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                                }))}
                                placeholder="Enter contact phone number"
                                className="pl-10"
                              />
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email Address <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="email"
                                type="email"
                                value={tourData.contactInfo.email}
                                onChange={(e) => setTourData(prev => ({
                                  ...prev,
                                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                                }))}
                                placeholder="Enter contact email"
                                className="pl-10"
                              />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                              WhatsApp Number
                            </Label>
                            <div className="relative">
                              <Input
                                id="whatsapp"
                                type="tel"
                                value={tourData.contactInfo.whatsapp}
                                onChange={(e) => setTourData(prev => ({
                                  ...prev,
                                  contactInfo: { ...prev.contactInfo, whatsapp: e.target.value }
                                }))}
                                placeholder="Enter WhatsApp number"
                                className="pl-10"
                              />
                              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cancellation Policy */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">Cancellation Policy <span className="text-red-500">*</span></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Textarea
                            id="cancellationPolicy"
                            value={tourData.cancellationPolicy}
                            onChange={(e) => setTourData(prev => ({
                              ...prev,
                              cancellationPolicy: e.target.value
                            }))}
                            placeholder="Describe your cancellation policy..."
                            className="min-h-[150px] resize-y"
                          />
                          <p className="text-sm text-gray-500">
                            Clearly outline your cancellation and refund policies, including any deadlines or penalties.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Textarea
                            id="additionalInfo"
                            value={tourData.additionalInfo}
                            onChange={(e) => setTourData(prev => ({
                              ...prev,
                              additionalInfo: e.target.value
                            }))}
                            placeholder="Any other important information..."
                            className="min-h-[150px] resize-y"
                          />
                          <p className="text-sm text-gray-500">
                            Include any other relevant details like special requirements, what to bring, or important notes.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t sticky bottom-0 bg-white z-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === activeStep)
                  if (currentIndex > 0) {
                    setIsLoading(true)
                    setTimeout(() => {
                      handleStepChange(steps[currentIndex - 1].id)
                      setVisibleSection(steps[currentIndex - 1].id as "basic" | "details" | "itinerary" | "media" | "additional")
                      setIsLoading(false)
                    }, 300)
                  }
                }}
                disabled={activeStep === steps[0].id || isLoading}
                className="h-11 px-6 text-gray-600 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </Button>

              <Button
                type="button"
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === activeStep)
                  if (currentIndex < steps.length - 1) {
                    setIsLoading(true)
                    setTimeout(() => {
                      // Only proceed if validation passes
                      const canProceed = handleStepChange(steps[currentIndex + 1].id)
                      if (canProceed) {
                        setVisibleSection(steps[currentIndex + 1].id as "basic" | "details" | "itinerary" | "media" | "additional")
                      }
                      setIsLoading(false)
                    }, 300)
                  }
                }}
                disabled={isLoading || !validateStep(activeStep).isValid} // Disable if current step is invalid
                className={`h-11 px-6 transition-all duration-200 rounded-lg disabled:opacity-50 hover:scale-[1.02] ${
                  validateStep(activeStep).isValid 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 