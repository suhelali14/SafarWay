import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Select, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserInviteFormProps {
  onSuccess?: () => void;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { inviteUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      message.error('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      await inviteUser(email, role);
      message.success('Invitation sent successfully');
      setEmail('');
      onSuccess?.();
    } catch (error) {
      message.error('Failed to send invitation');
      console.error('Invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Select
          value={role}
          onChange={setRole}
          className="w-full"
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        icon={<UserAddOutlined />}
        className="w-full"
      >
        Send Invitation
      </Button>
    </form>
  );
};

export default UserInviteForm; 