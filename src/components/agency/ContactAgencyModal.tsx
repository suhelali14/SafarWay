import { Mail, Phone, Globe, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { AgencyDetails } from '../../lib/api/agency';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

interface ContactAgencyModalProps {
  agency: AgencyDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactAgencyModal({ 
  agency, 
  open, 
  onOpenChange 
}: ContactAgencyModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { name, contactInfo } = agency;
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    
    toast.success({
      title: 'Copied to clipboard',
      description: `${field} has been copied to clipboard.`,
    });
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {name}</DialogTitle>
          <DialogDescription>
            Use the information below to get in touch with this agency.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {/* Email */}
          {contactInfo.email && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">{contactInfo.email}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-1"
                onClick={() => handleCopy(contactInfo.email, 'Email')}
              >
                {copiedField === 'Email' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Phone */}
          {contactInfo.phone && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <Phone className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-500">{contactInfo.phone}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-1"
                onClick={() => handleCopy(contactInfo.phone, 'Phone')}
              >
                {copiedField === 'Phone' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Website */}
          {contactInfo.website && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-full">
                  <Globe className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {contactInfo.website}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-1"
                  onClick={() => handleCopy(contactInfo.website, 'Website')}
                >
                  {copiedField === 'Website' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 