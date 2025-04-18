import { useState } from "react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ConfirmDeleteDialog } from "../ui/confirm-delete-dialog";
import { EditUserDialog } from "../agency/EditUserDialog";
import { Pencil, Trash2, MailPlus, Ban, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { formatDate } from "../../lib/utils";
import { User } from "../../types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResendInvite: (user: User) => void;
  onSuspend: (user: User) => void;
  onActivate: (user: User) => void;
  loading: boolean;
}

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onResendInvite, 
  onSuspend, 
  onActivate, 
  loading 
}: UserTableProps) {
  
  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      SAFARWAY_ADMIN: "bg-red-100 text-red-800",
      SAFARWAY_USER: "bg-blue-100 text-blue-800",
      AGENCY_ADMIN: "bg-purple-100 text-purple-800",
      AGENCY_USER: "bg-green-100 text-green-800",
      CUSTOMER: "bg-gray-100 text-gray-800",
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

  if (loading) {
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
                      {user.status === "INVITED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onResendInvite(user)}
                          title="Resend Invitation"
                        >
                          <MailPlus className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSuspend(user)}
                          title="Suspend User"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === "SUSPENDED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onActivate(user)}
                          title="Activate User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                        title="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user)}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 