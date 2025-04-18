import { useState, useEffect } from "react";
import { UserTable } from "../../components/agency/UserTable";
import { AddUserDialog } from "../../components/agency/AddUserDialog";
import { EditUserDialog } from "../../components/agency/EditUserDialog";
import { ConfirmDeleteDialog } from "../../components/agency/ConfirmDeleteDialog";
import { InviteUserDialog } from "../../components/agency/InviteUserDialog";
import { Button } from "../../components/ui/button";
import { PlusIcon, MailIcon } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { 
  getAgencyUsers, 
  addAgencyUser, 
  updateAgencyUser, 
  deleteAgencyUser,
  inviteAgencyUser,
  resendInvitation,
  suspendUser,
  activateUser,
  User,
  AddUserRequest,
  UpdateUserRequest 
} from "../../services/api/userService";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAgencyUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (formData: AddUserRequest) => {
    try {
      setActionLoading(true);
      await addAgencyUser(formData);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteUser = async (formData: { email: string; role: string }) => {
    try {
      setActionLoading(true);
      await inviteAgencyUser(formData.email, formData.role);
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setInviteDialogOpen(false);
    }
  };

  const handleResendInvite = async (user: User) => {
    try {
      setActionLoading(true);
      await resendInvitation(user.id);
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend invitation",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (user: User) => {
    try {
      setActionLoading(true);
      await suspendUser(user.id);
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to suspend user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      setActionLoading(true);
      await activateUser(user.id);
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (formData: UpdateUserRequest) => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      await updateAgencyUser(selectedUser.id, formData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      await deleteAgencyUser(selectedUser.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setInviteDialogOpen(true)} variant="outline">
            <MailIcon className="mr-2 h-4 w-4" />
            Invite User
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onResendInvite={handleResendInvite}
        onSuspend={handleSuspendUser}
        onActivate={handleActivateUser}
        loading={loading}
      />

      <AddUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddUser}
        isLoading={actionLoading}
      />

      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={handleInviteUser}
        isLoading={actionLoading}
      />

      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onUpdate={handleUpdateUser}
          user={selectedUser}
          isLoading={actionLoading}
        />
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        isLoading={actionLoading}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </div>
  );
}