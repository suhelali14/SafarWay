import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgencySettings {
  name: string;
  address: string;
  contactEmail: string;
  businessHours: string;
  logo: string | null;
  paymentGateway: string;
  notifications: {
    email: boolean;
    inApp: boolean;
  };
}

const initialSettings: AgencySettings = {
  name: 'Travel Agency Name',
  address: '123 Main Street, City, Country',
  contactEmail: 'contact@agency.com',
  businessHours: '9:00 AM - 6:00 PM',
  logo: null,
  paymentGateway: 'stripe',
  notifications: {
    email: true,
    inApp: true,
  },
};

export const SettingsPage = () => {
  const [settings, setSettings] = useState<AgencySettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type: 'email' | 'inApp') => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          logo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agency Settings</h1>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agency Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-lg border space-y-4"
        >
          <h2 className="text-lg font-medium">Agency Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Agency Name
              </label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border bg-background resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Hours
              </label>
              <input
                type="text"
                name="businessHours"
                value={settings.businessHours}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border bg-background"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Logo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-lg border space-y-4"
        >
          <h2 className="text-lg font-medium">Agency Logo</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-background">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Agency Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <Upload className="h-5 w-5" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Recommended size: 512x512px
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-lg border space-y-4"
        >
          <h2 className="text-lg font-medium">Payment Settings</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Gateway
            </label>
            <select
              name="paymentGateway"
              value={settings.paymentGateway}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border bg-background"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="razorpay">Razorpay</option>
            </select>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-lg border space-y-4"
        >
          <h2 className="text-lg font-medium">Notification Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.inApp}
                onChange={() => handleNotificationChange('inApp')}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>In-App Notifications</span>
            </label>
          </div>
        </motion.div>
      </form>
    </div>
  );
}; 