import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

import UserInviteForm from '../components/UserInviteForm';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  invitedBy: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
 

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Invited By',
      dataIndex: 'invitedBy',
      key: 'invitedBy',
      render: (invitedBy: string) => {
        const inviter = users.find(user => user.id === invitedBy);
        return inviter?.email || 'N/A';
      },
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="User Management"
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsInviteModalVisible(true)}
          >
            Invite User
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Invite User"
        open={isInviteModalVisible}
        onCancel={() => setIsInviteModalVisible(false)}
        footer={null}
      >
        <UserInviteForm
          onSuccess={() => {
            setIsInviteModalVisible(false);
            fetchUsers();
          }}
        />
      </Modal>
    </div>
  );
};

export default UserManagement; 