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
import { UserTable } from "../../components/agency/UserTable";
import { AddUserDialog } from "../../components/agency/AddUserDialog";
import { InviteUserDialog } from "../../components/agency/InviteUserDialog";
import { EditUserDialog } from "../../components/agency/EditUserDialog";
import { ConfirmDeleteDialog } from "../../components/ui/confirm-delete-dialog";
import { Pagination } from "../../components/ui/pagination";
import { useToast } from "../../hooks/use-toast";
import { MailIcon, FilterIcon } from "lucide-react";
import { agencyUserService, UserFilters } from "../../services/api/agencyUserService";
import { User } from "../../types/user";
import * as z from "zod";


interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Define form schemas to match dialog components
const addUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["SAFARWAY_ADMIN", "SAFARWAY_USER", "AGENCY_ADMIN", "AGENCY_USER"]),
});

const updateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["SAFARWAY_ADMIN", "SAFARWAY_USER", "AGENCY_ADMIN", "AGENCY_USER"]),
});

type AddUserFormData = z.infer<typeof addUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Original interface definition to maintain compatibility with the API
interface AddUserAPIRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserAPIRequest {
  name: string;
  email: string;
  role: string;
}

export default function UsersManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, _setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const filters: UserFilters = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined
      };
      
      const response = await agencyUserService.getAgencyUsers(filters);
      
      // Set users from the response data
      setUsers(response.data || []);
      
      // Set pagination metadata
      setPaginationMeta(response.meta);
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
  const handleAddUser = async (data: AddUserFormData): Promise<void> => {
    try {
      setActionLoading(true);
      // Convert form data to API request format
      const userData: AddUserAPIRequest = {
        ...data,
        password: 'temporaryPassword', // Or generate a random password
      };
      await agencyUserService.addAgencyUser(userData);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      await fetchUsers();
      setAddDialogOpen(false);
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
  const handleUpdateUser = async (id: string, data: UpdateUserFormData): Promise<void> => {
    try {
      setActionLoading(true);
      // Convert form data to API request format
      const userData: UpdateUserAPIRequest = {
        ...data,
      };
      await agencyUserService.updateAgencyUser(id, userData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      await fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      await agencyUserService.deleteAgencyUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      await fetchUsers();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle inviting a user
  const handleInviteUser = async (data: { name: string; email: string; role: string; agencyId?: string }) => {
    try {
      setActionLoading(true);
      await agencyUserService.inviteAgencyUser({
        name: data.name,
        email: data.email,
        role: data.role,
        agencyId: data.agencyId
      });
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      await fetchUsers();
      setInviteDialogOpen(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle resending invitation
  const handleResendInvite = (user: User) => {
    setActionLoading(true);
    agencyUserService.resendInvitation(user.id)
      .then(() => {
        toast({
          title: "Success",
          description: "Invitation resent successfully",
        });
        fetchUsers();
      })
      .catch(error => {
        console.error('Error resending invitation:', error);
        toast({
          title: "Error",
          description: "Failed to resend invitation",
          variant: "destructive",
        });
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  // Handle suspending a user
  const handleSuspendUser = (user: User) => {
    setActionLoading(true);
    agencyUserService.suspendUser(user.id)
      .then(() => {
        toast({
          title: "Success",
          description: "User suspended successfully",
        });
        fetchUsers();
      })
      .catch(error => {
        console.error('Error suspending user:', error);
        toast({
          title: "Error",
          description: "Failed to suspend user",
          variant: "destructive",
        });
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  // Handle activating a user
  const handleActivateUser = (user: User) => {
    setActionLoading(true);
    agencyUserService.activateUser(user.id)
      .then(() => {
        toast({
          title: "Success",
          description: "User activated successfully",
        });
        fetchUsers();
      })
      .catch(error => {
        console.error('Error activating user:', error);
        toast({
          title: "Error",
          description: "Failed to activate user",
          variant: "destructive",
        });
      })
      .finally(() => {
        setActionLoading(false);
      });
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

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <>
      <Helmet>
        <title>User Management - Agency Dashboard</title>
      </Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex gap-2">
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
          <div className="flex items-center space-x-2 ml-4">
            <FilterIcon className="h-4 w-4" />
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="AGENCY_ADMIN">Admin</SelectItem>
                <SelectItem value="AGENCY_USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <UserTable
          users={users}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onResendInvite={handleResendInvite}
          onSuspend={handleSuspendUser}
          onActivate={handleActivateUser}
          isLoading={loading}
        />

        {paginationMeta.pages > 1 && (
          <Pagination
            currentPage={paginationMeta.page}
            totalPages={paginationMeta.pages}
            onPageChange={handlePageChange}
          />
        )}

        <AddUserDialog
          onAdd={handleAddUser}
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
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
            user={selectedUser}
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            onUpdate={(data: any) => {
              return handleUpdateUser(selectedUser.id, data);
            }}
          />
        )}

        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
          isLoading={actionLoading}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        />
      </div>
    </>
  );
}