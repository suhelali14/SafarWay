import { Mail, Phone, Globe, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Button } from '../../ui/button';
import { AgencyPublicDetails } from '../../../services/api/agencyPublicService';

interface AgencyFooterProps {
  agency: AgencyPublicDetails;
}

const AgencyFooter = ({ agency }: AgencyFooterProps) => {
  const { email, phone, website, address} = agency;
  
  // Social media links - these should come from the agency data in a real app
  const socialLinks = {
    facebook: agency.socialLinks?.facebook || '',
    instagram: agency.socialLinks?.instagram || '',
    twitter: agency.socialLinks?.twitter || '',
    linkedin: agency.socialLinks?.linkedin || '',
    youtube: '' // Not in the current model, but could be added later
  };

  const renderSocialIcon = (type: string) => {
    switch (type) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Simple formatting for display - this should be improved based on country code
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    return phone;
  };

  return (
    <footer className="py-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <ul className="space-y-3">
            {email && (
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${email}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </li>
            )}
            
            {phone && (
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a 
                    href={`tel:${phone}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {formatPhoneNumber(phone)}
                  </a>
                </div>
              </li>
            )}
            
            {website && (
              <li className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a 
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {website}
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
        
        {/* Address */}
        {(address ) && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Office Location</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <address className="not-italic">
                {address && <p>{address}</p>}
                
              </address>
            </div>
          </div>
        )}
        
        {/* Connect */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(socialLinks).map(([platform, url]) => {
              if (!url) return null;
              
              return (
                <Button
                  key={platform}
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full"
                >
                  <a 
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${platform} page`}
                  >
                    {renderSocialIcon(platform)}
                  </a>
                </Button>
              );
            })}
            
            {Object.values(socialLinks).every(link => !link) && (
              <p className="text-sm text-gray-500">
                No social media profiles available.
              </p>
            )}
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="#packages" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                View Packages
              </a>
            </li>
            <li>
              <a 
                href="#reviews" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Customer Reviews
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                About Agency
              </a>
            </li>
            {website && (
              <li>
                <a 
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Visit Website
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {agency.name}. All rights reserved.</p>
        <p className="mt-1">
          This page is powered by SafarWay - The Ultimate Travel Platform
        </p>
      </div>
    </footer>
  );
};

export default AgencyFooter; 