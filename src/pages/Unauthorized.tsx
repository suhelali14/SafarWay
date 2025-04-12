import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is a mistake.
        </p>
        <Link to="/">
          <Button type="primary" icon={<HomeOutlined />} size="large">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized; 