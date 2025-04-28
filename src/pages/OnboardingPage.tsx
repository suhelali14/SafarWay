import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ROUTES } from "../lib/config";

export default function OnboardingPage() {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    preferences: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update user profile
    navigate(ROUTES.DASHBOARD);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to SafarWay!</h2>
            <p className="text-gray-600">Let's get to know you better.</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Address</h2>
            <p className="text-gray-600">Where can we find you?</p>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Travel Preferences</h2>
            <p className="text-gray-600">What kind of trips interest you?</p>
            <div className="grid grid-cols-2 gap-4">
              {["Adventure", "Relaxation", "Cultural", "Family", "Luxury", "Budget"].map(
                (preference) => (
                  <Button
                    key={preference}
                    variant={formData.preferences.includes(preference) ? "default" : "outline"}
                    onClick={() => handlePreferenceToggle(preference)}
                    className="w-full"
                  >
                    {preference}
                  </Button>
                )
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 mx-1 rounded ${
                    s <= step ? "bg-sky-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Personal Info</span>
              <span>Address</span>
              <span>Preferences</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() => setStep((prev) => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 