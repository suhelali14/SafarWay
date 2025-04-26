import { useState } from "react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";

import { Badge } from "../ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";
import { formatDate } from "../../lib/utils";
import { User } from "../../types/user";
import { EditIcon, TrashIcon, MailIcon, BanIcon, CheckIcon } from "lucide-react";

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserFormData {
  name: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  onAddUser: (data: any) => Promise<void>;
  onUpdateUser: (id: string, data: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onResendInvite?: (user: User) => void;
  onSuspend?: (user: User) => void;
  onActivate?: (user: User) => void;
  isLoading: boolean;
}

export function UserTable({ users, onAddUser, onUpdateUser, onDeleteUser, onResendInvite, onSuspend, onActivate, isLoading }: UserTableProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      await onDeleteUser(selectedUser.id);
      setDeleteDialogOpen(false);
    }
  };

  const handleResendInvite = (user: User) => {
    if (onResendInvite) {
      onResendInvite(user);
    }
  };

  const handleSuspend = (user: User) => {
    if (onSuspend) {
      onSuspend(user);
    }
  };

  const handleActivate = (user: User) => {
    if (onActivate) {
      onActivate(user);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      SAFARWAY_ADMIN: "bg-red-100 text-red-800",
      SAFARWAY_USER: "bg-blue-100 text-blue-800",
      AGENCY_ADMIN: "bg-purple-100 text-purple-800",
      AGENCY_USER: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={roleColors[role] || "bg-gray-100 text-gray-800"}>
        {role.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      INVITED: "bg-yellow-100 text-yellow-800",
      SUSPENDED: "bg-red-100 text-red-800",
      INACTIVE: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Users</h2>
     
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.status === "INVITED" && onResendInvite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResendInvite(user)}
                          title="Resend Invitation"
                        >
                          <MailIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === "ACTIVE" && onSuspend && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSuspend(user)}
                          title="Suspend User"
                        >
                          <BanIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === "SUSPENDED" && onActivate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActivate(user)}
                          title="Activate User"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
                        title="Delete User"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <AddUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={onAddUser}
        isLoading={isLoading}
      />

      {/* Edit User Dialog */}
      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onUpdate={(data) => onUpdateUser(selectedUser.id, data)}
          user={selectedUser}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.name}"`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 