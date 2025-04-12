import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Form, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    inviteCode: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(values.email, values.password, values.inviteCode);
      message.success('Registration successful');
      onSuccess?.();
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      onFinish={handleSubmit}
      layout="vertical"
      className="space-y-4"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="inviteCode"
        label="Invite Code"
        rules={[{ required: true, message: 'Please input your invite code!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<UserAddOutlined />}
          className="w-full"
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm; 