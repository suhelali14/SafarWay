import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { AgencyInviteForm } from '../../../components/admin/AgencyInviteForm';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { Icons } from '../../../components/Icons';

export default function InviteAgencyPage() {
  return (
    <>
      <Helmet>
        <title>Invite Agency - SafarWay Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invite New Agency</h1>
            <p className="text-muted-foreground">
              Send invitation to an agency to join the platform
            </p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/admin/agencies">
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Agencies
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <AgencyInviteForm 
              onSuccess={() => {
                // You can handle success actions here if needed
              }} 
            />
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Agency Invitation Process</h3>
              <p className="text-sm text-muted-foreground mb-4">
                When you invite an agency to join the platform, they will receive an email with instructions to complete their registration.
              </p>
              
              <h4 className="font-medium text-sm mb-2">The process includes:</h4>
              <ul className="space-y-2 text-sm list-disc pl-4">
                <li>Agency receives an invitation email with a unique link</li>
                <li>They click the link and complete their profile</li>
                <li>They set up their password and account details</li>
                <li>Admin can approve their account and assign permissions</li>
                <li>Once approved, they gain access to the agency dashboard</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Icons.info className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Invitations expire after 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
} 