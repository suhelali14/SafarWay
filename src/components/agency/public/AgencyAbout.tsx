import { Building2, Calendar, Globe, MapPin, Mail, Phone, Globe2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AgencyPublicDetails } from '../../../services/api/agencyPublicService';
import { motion } from 'framer-motion';

interface AgencyAboutProps {
  agency: AgencyPublicDetails;
}

const AgencyAbout = ({ agency }: AgencyAboutProps) => {
  const {
    name,
    description,
    address,
   
    phone,
    email,
    website,
    foundedYear,
    license,
    serviceRegions = [],
  } = agency;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* About Section */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About {name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {description || "No description provided by the agency."}
            </p>

            {/* Service regions */}
            {serviceRegions && serviceRegions.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Service Regions</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceRegions.map((region, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50" label={region}/>

                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Business Info */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Business Name */}
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Business Name</h4>
                  <p className="text-gray-600">{name}</p>
                </div>
              </div>
              
              {/* Founded Year */}
              {foundedYear && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Founded Year</h4>
                    <p className="text-gray-600">{foundedYear}</p>
                  </div>
                </div>
              )}
              
              {/* Address */}
              {(address) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Head Office Location</h4>
                    <p className="text-gray-600">
                      {[address]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* License */}
              {license && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">License Number</h4>
                    <p className="text-gray-600">{license}</p>
                  </div>
                </div>
              )}
              
              {/* Contact Info */}
              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact Email</h4>
                    <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              
              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact Phone</h4>
                    <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              
              {website && (
                <div className="flex items-start gap-3">
                  <Globe2 className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Website</h4>
                    <a 
                      href={website.startsWith('http') ? website : `https://${website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AgencyAbout; 