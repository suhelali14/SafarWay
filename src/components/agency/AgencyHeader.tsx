import { motion } from 'framer-motion';
import { Globe, Mail, Phone, Facebook, Instagram, Twitter, Linkedin, MapPin, Calendar, CheckVerified } from 'lucide-react';
import { AgencyDetails } from '../../lib/api/agency';
import { Badge } from '../ui/badge';

interface AgencyHeaderProps {
  agency: AgencyDetails;
}

export function AgencyHeader({ agency }: AgencyHeaderProps) {
  const {
    name,
    description,
    logo,
    coverImage,
    contactInfo,
    socialLinks,
    address,
    foundedYear,
    verificationStatus,
    badges
  } = agency;
  
  const fallbackCover = 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
  
  const fallbackLogo = 'https://via.placeholder.com/150?text=' + encodeURIComponent(name.charAt(0));
  
  return (
    <header className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={coverImage || fallbackCover}
          alt={`${name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
      </div>
      
      {/* Agency Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 md:-mt-32 bg-white rounded-lg shadow-lg p-6 mb-8">
          <motion.div 
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={logo || fallbackLogo} 
                alt={`${name} logo`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border-4 border-white shadow-md"
              />
            </div>
            
            {/* Agency Details */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
                
                {verificationStatus === 'VERIFIED' && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                    <CheckVerified className="h-3 w-3" />
                    <span>Verified</span>
                  </Badge>
                )}
                
                {badges && badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="capitalize">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              <p className="text-gray-600 mb-4 max-w-3xl">{description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-600">
                {/* Contact Info */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Founded: {foundedYear}</span>
                </div>
                
                {contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                
                {contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                
                {contactInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {contactInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Social Links */}
            {socialLinks && Object.keys(socialLinks).length > 0 && (
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                {socialLinks.facebook && (
                  <a 
                    href={socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </a>
                )}
                
                {socialLinks.instagram && (
                  <a 
                    href={socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </a>
                )}
                
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </a>
                )}
                
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-blue-700" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
} 