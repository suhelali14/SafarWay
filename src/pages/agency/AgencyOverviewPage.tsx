import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { agencyApi, AgencyDetails, AgencyStats } from '../../lib/api/agency';
import { AgencyHeader } from '../../components/agency/AgencyHeader';
import { AgencyStats as AgencyStatsComponent } from '../../components/agency/AgencyStats';
import { AgencyPackages } from '../../components/agency/AgencyPackages';
import { AgencyReviews } from '../../components/agency/AgencyReviews';
import { AgencyActionsBar } from '../../components/agency/AgencyActionsBar';
import { ContactAgencyModal } from '../../components/agency/ContactAgencyModal';
import { ReportAgencyModal } from '../../components/agency/ReportAgencyModal';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function AgencyOverviewPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  // Fetch agency details
  const { 
    data: agencyDetails, 
    isLoading: isLoadingDetails,
    error: detailsError
  } = useQuery({
    queryKey: ['agencyDetails', agencyId],
    queryFn: () => agencyId ? agencyApi.getAgencyDetails(agencyId).then(res => res.data) : Promise.reject('No agency ID'),
    enabled: !!agencyId
  });
  
  // Fetch agency stats
  const { 
    data: agencyStats, 
    isLoading: isLoadingStats 
  } = useQuery({
    queryKey: ['agencyStats', agencyId],
    queryFn: () => agencyId ? agencyApi.getAgencyStats(agencyId).then(res => res.data) : Promise.reject('No agency ID'),
    enabled: !!agencyId
  });
  
  // Handle contact agency action
  const handleContactAgency = () => {
    setContactModalOpen(true);
  };
  
  // Handle report agency action
  const handleReportAgency = () => {
    setReportModalOpen(true);
  };
  
  if (detailsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load agency details. The agency may not exist or there was an error connecting to the server.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLoadingDetails 
            ? 'Loading Agency...' 
            : `${agencyDetails?.name || 'Agency'} | SafarWay`}
        </title>
        <meta 
          name="description" 
          content={agencyDetails?.description || 'View travel agency details, packages, and reviews.'} 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Agency Header */}
        {isLoadingDetails ? (
          <div className="w-full h-64 bg-gray-200 animate-pulse" />
        ) : (
          <AgencyHeader agency={agencyDetails as AgencyDetails} />
        )}
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Agency Stats */}
          {isLoadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <AgencyStatsComponent stats={agencyStats as AgencyStats} />
          )}
          
          {/* Agency Packages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Tour Packages</h2>
            <AgencyPackages agencyId={agencyId as string} />
          </section>
          
          {/* Agency Reviews */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <AgencyReviews agencyId={agencyId as string} />
          </section>
        </div>
        
        {/* Sticky Agency Actions Bar */}
        {!isLoadingDetails && (
          <AgencyActionsBar 
            agencyId={agencyId as string}
            onContact={handleContactAgency}
            onReport={handleReportAgency}
          />
        )}
      </div>
      
      {/* Modals */}
      {agencyDetails && (
        <>
          <ContactAgencyModal 
            open={contactModalOpen} 
            onOpenChange={setContactModalOpen}
            agency={agencyDetails}
          />
          
          <ReportAgencyModal
            open={reportModalOpen}
            onOpenChange={setReportModalOpen}
            agencyId={agencyId as string}
            agencyName={agencyDetails.name}
          />
        </>
      )}
    </>
  );
} 