import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Loader2 } from 'lucide-react';

// Page sections
import AgencyHeader from '../../components/agency/public/AgencyHeader';
import AgencyAbout from '../../components/agency/public/AgencyAbout';
import AgencyPackages from '../../components/agency/public/AgencyPackages';
import AgencyReviews from '../../components/agency/public/AgencyReviews';
import AgencyMediaWall from '../../components/agency/public/AgencyMediaWall';
import AgencyFooter from '../../components/agency/public/AgencyFooter';

// API services
import { agencyPublicService } from '../../services/api/agencyPublicService';
import { Agency } from '../../services/api/agencyService';

export default function AgencyPublicProfilePage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!agencyId) {
        setError('Agency ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await agencyPublicService.getAgencyDetails(agencyId);
        console.log("response",response);
        setAgency(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching agency details:', err);
        setError('Failed to load agency details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyData();
  }, [agencyId]);
  console.log("error",error);
  console.log("agency",agency);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading agency profile...</p>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
        <p className="text-lg text-muted-foreground">{error || 'Agency not found'}</p>
      </div>
    );
  }

  return (
    <div className='py-16'>
      <Helmet>
        <title>{agency.name} | SafarWay</title>
        <meta name="description" content={agency.description || `${agency.name} - Travel Agency on SafarWay`} />
        <meta property="og:title" content={`${agency.name} | SafarWay`} />
        <meta property="og:description" content={agency.description || `${agency.name} - Travel Agency on SafarWay`} />
        {agency.logo && <meta property="og:image" content={agency.logo} />}
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Agency Header */}
        <AgencyHeader 
          agency={agency} 
          className="mb-8"
        />

        {/* Main content with tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full h-auto p-0 bg-transparent border-b flex flex-nowrap overflow-x-auto">
            <TabsTrigger 
              value="about" 
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="packages" 
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Tour Packages
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Reviews & Ratings
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Media
            </TabsTrigger>
          </TabsList>

          {/* About Agency Section */}
          <TabsContent value="about" className="mt-6">
            <AgencyAbout agency={agency} />
          </TabsContent>

          {/* Packages Section */}
          <TabsContent value="packages" className="mt-6">
            <AgencyPackages agencyId={agencyId!} />
          </TabsContent>

          {/* Reviews Section */}
          <TabsContent value="reviews" className="mt-6">
            <AgencyReviews agencyId={agencyId!} />
          </TabsContent>

          {/* Media Wall Section */}
          <TabsContent value="media" className="mt-6">
            <AgencyMediaWall agencyId={agencyId!} />
          </TabsContent>
        </Tabs>

        <Separator className="my-10" />

        {/* Footer Section */}
        <AgencyFooter agency={agency} />
      </main>
    </div>
  );
} 