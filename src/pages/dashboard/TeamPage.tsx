import { useState } from 'react';
import { Plus, Search, Mail, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'AGENCY_ADMIN' | 'AGENT' | 'SUPPORT';
  status: 'invited' | 'active' | 'disabled';
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 'T001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'AGENCY_ADMIN',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: 'T002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'AGENT',
    status: 'active',
    joinedAt: '2024-02-01',
  },
  {
    id: 'T003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'SUPPORT',
    status: 'invited',
    joinedAt: '2024-04-10',
  },
  // Add more mock data as needed
];

export const TeamPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'invited':
        return 'bg-yellow-100 text-yellow-700';
      case 'disabled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'AGENCY_ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'AGENT':
        return 'bg-blue-100 text-blue-700';
      case 'SUPPORT':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Agency Team</h1>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-5 w-5" />
          Invite Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-background"
        >
          <option value="all">All Roles</option>
          <option value="AGENCY_ADMIN">Admin</option>
          <option value="AGENT">Agent</option>
          <option value="SUPPORT">Support</option>
        </select>
      </div>

      {/* Team Members Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Joined</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b last:border-none hover:bg-muted/50"
                >
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getRoleColor(
                        member.role
                      )}`}
                    >
                      {member.role.split('_').join(' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDate(member.joinedAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 