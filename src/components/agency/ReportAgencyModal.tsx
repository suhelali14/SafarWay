import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { agencyApi } from '../../lib/api/agency';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { toast } from '../ui/use-toast';
import { AlertTriangle } from 'lucide-react';

interface ReportAgencyModalProps {
  agencyId: string;
  agencyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportAgencyModal({ 
  agencyId, 
  agencyName,
  open, 
  onOpenChange 
}: ReportAgencyModalProps) {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  
  // Report submission mutation
  const { mutate: submitReport, status } = useMutation({
    mutationFn: () => agencyApi.reportAgency(agencyId, reason, details),
    onSuccess: () => {
      toast.success({
        title: 'Report submitted',
        description: 'Thank you for your report. We will review it shortly.',
      
      });
      
      // Reset form and close modal
      setReason('');
      setDetails('');
      onOpenChange(false);
    },
    onError: () => {
      toast.error({
        title: 'Submission failed',
        description: 'Failed to submit your report. Please try again.',
       
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error({
        title: 'Missing information',
        description: 'Please select a reason for reporting.',
        
      });
      return;
    }
    
    submitReport();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {agencyName}</DialogTitle>
          <DialogDescription>
            Please provide details about why you're reporting this agency.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for reporting</Label>
              <RadioGroup 
                value={reason} 
                onValueChange={setReason}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="misleading" id="misleading" />
                  <Label htmlFor="misleading" className="cursor-pointer">Misleading information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="inappropriate" />
                  <Label htmlFor="inappropriate" className="cursor-pointer">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fraud" id="fraud" />
                  <Label htmlFor="fraud" className="cursor-pointer">Suspected fraud</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conduct" id="conduct" />
                  <Label htmlFor="conduct" className="cursor-pointer">Unprofessional conduct</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Additional details</Label>
              <Textarea
                id="details"
                placeholder="Please provide specific details about the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-24"
              />
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-md text-amber-800 text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p>
                We take all reports seriously. False reporting may result in account restrictions.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={status === 'pending'}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={status === 'pending' || !reason}
              className="gap-2"
            >
              {status === 'pending' ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 