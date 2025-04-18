import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { Label } from '../ui/label';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: { name: string; email: string; role: string; agencyId?: string }) => void;
  isLoading: boolean;
  agencies?: Array<{ id: string; name: string }>;
}

export function InviteUserDialog({
  open,
  onClose,
  onInvite,
  isLoading,
  agencies = [],
}: InviteUserDialogProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('AGENCY_USER');
  const [agencyId, setAgencyId] = useState('');
  const [showAgencySelect, setShowAgencySelect] = useState(false);

  // Determine if current user is a SafarWay role (admin or user)
  const isSafarWayRole = user?.role === 'SAFARWAY_ADMIN' || user?.role === 'SAFARWAY_USER';
  
  useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setEmail('');
      setName('');
      setRole('AGENCY_USER');
      setAgencyId('');
      
      // Only show agency selection for SafarWay roles AND when inviting AGENCY roles
      updateAgencySelectVisibility('AGENCY_USER');
    }
  }, [open, user]);
  
  // Update agency select visibility based on selected role
  const updateAgencySelectVisibility = (selectedRole: string) => {
    // Only SafarWay roles need to select an agency
    // AND only when they're inviting AGENCY roles (not other SafarWay roles)
    const needsAgency = isSafarWayRole && 
      (selectedRole === 'AGENCY_ADMIN' || selectedRole === 'AGENCY_USER');
    
    setShowAgencySelect(needsAgency);
    
    // If we're not showing agency select, clear the agencyId
    if (!needsAgency) {
      setAgencyId('');
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    updateAgencySelectVisibility(newRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only include agencyId if needed based on role
    const needsAgency = showAgencySelect;
    
    onInvite({ 
      name,
      email, 
      role,
      ...(needsAgency ? { agencyId } : {})
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={handleRoleChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGENCY_USER">Agency User</SelectItem>
                  <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                  {isSafarWayRole && (
                    <>
                      <SelectItem value="SAFARWAY_USER">SafarWay User</SelectItem>
                      <SelectItem value="SAFARWAY_ADMIN">SafarWay Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {showAgencySelect && (
              <div className="grid gap-2">
                <Label htmlFor="agency">Select Agency</Label>
                <Select value={agencyId} onValueChange={setAgencyId} required={showAgencySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      agencies.length === 0 
                      ? "Loading agencies..." 
                      : "Select Agency"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies.length === 0 ? (
                      <SelectItem value="loading" disabled>Loading agencies...</SelectItem>
                    ) : (
                      agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>
                          {agency.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (showAgencySelect && !agencyId)}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 