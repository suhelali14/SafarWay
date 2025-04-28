import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { UserTable } from "../../components/admin/UserTable";
import { AddUserDialog } from "../../components/agency/AddUserDialog";
import { InviteUserDialog } from "../../components/agency/InviteUserDialog";
import { EditUserDialog } from "../../components/agency/EditUserDialog";
import { ConfirmDeleteDialog } from "../../components/ui/confirm-delete-dialog";
import { Pagination } from "../../components/ui/pagination";
import { useToast } from "../../hooks/use-toast";
import { MailIcon, PlusIcon, FilterIcon } from "lucide-react";
import {
  inviteAgencyUser,
  resendInvitation,
  suspendUser,
  activateUser,
} from "../../services/api/userService";
import { adminAPI } from "../../services/api/adminAPI";
import { User } from "../../types/user";

interface Agency {
  id: string;
  name: string;
}

interface PaginationMeta {
  page: number;
  pages: number;
  total: number;
}

export default function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [_addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [_loadingAgencies, setLoadingAgencies] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchAgencies = async () => {
    try {
      setLoadingAgencies(true);
      const agenciesList = await adminAPI.getAllAgenciesList();
      setAgencies(agenciesList);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agencies list",
        variant: "destructive",
      });
    } finally {
      setLoadingAgencies(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Use adminAPI instead of getAgencyUsers
      const response = await adminAPI.getUsers({
        search: searchTerm,
        status: statusFilter,
        limit: itemsPerPage,
        offset: offset
      });
      
      // Set users from the response data
      setUsers(response.data || []);
      
      // Set pagination metadata
      setPaginationMeta({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a user
  const handleAddUser = async (userData: any) => {
    try {
      setActionLoading(true);
      await adminAPI.createUser(userData);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle updating a user
  const handleUpdateUser = async (id: string, userData: any) => {
    try {
      setActionLoading(true);
      await adminAPI.updateUser(id, userData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setEditDialogOpen(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteUser(selectedUser.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle inviting a user
  const handleInviteUser = async (data: any) => {
    try {
      setActionLoading(true);
      await inviteAgencyUser({ email: data.email, name: data.name, role: data.role, agencyId: data.agencyId });
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setInviteDialogOpen(false);
    }
  };

  // Handle resending an invitation
  const handleResendInvite = async (user: User) => {
    try {
      setActionLoading(true);
      await resendInvitation(user.id);
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle suspending a user
  const handleSuspendUser = async (user: User) => {
    try {
      setActionLoading(true);
      await suspendUser(user.id);
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle activating a user
  const handleActivateUser = async (user: User) => {
    try {
      setActionLoading(true);
      await activateUser(user.id);
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      toast({
        title: "Error",
        description: "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when changing filters
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
    <>
      <Helmet>
        <title>User Management - SafarWay Admin</title>
      </Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <MailIcon className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>
          <div className="flex items-center space-x-2 ml-4">
            <FilterIcon className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="INVITED">Invited</SelectItem>
              </SelectContent>
            </Select>
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

        {paginationMeta.pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={paginationMeta.pages}
            onPageChange={handlePageChange}
          />
        )}

        <AddUserDialog onAdd={handleAddUser} />

        <InviteUserDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={handleInviteUser}
          isLoading={actionLoading}
          agencies={agencies}
        />

        {selectedUser && (
          <EditUserDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            onUpdate={(data) => handleUpdateUser(selectedUser.id, data)}
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
    </>
  );
} 