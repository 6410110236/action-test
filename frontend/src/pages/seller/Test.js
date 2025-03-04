import React from 'react';
import { Card, Typography, Divider, Button } from 'antd';
import useAuthStore from '../../logic/authStore';

const { Title, Text } = Typography;

const Test = () => {
  const { isLoggedIn, user, role } = useAuthStore();

  const testItems = [
    { label: 'Login Status', value: isLoggedIn ? 'Logged In' : 'Not Logged In' },
    { label: 'User Role', value: role || 'No Role' },
    { label: 'User Name', value: user?.name || 'No User' },
    { label: 'User Email', value: user?.email || 'No Email' },
  ];

  const handleTestAction = async () => {
    try {
      // Add test actions here
      console.log('Test action triggered');
    } catch (error) {
      console.error('Test action failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <Title level={2} className="text-center mb-6">
            Debug & Test Panel
          </Title>

          <div className="space-y-6">
            {/* Status Section */}
            <section>
              <Title level={4}>Current Status</Title>
              <Card className="bg-gray-50">
                {testItems.map((item, index) => (
                  <div key={index} className="mb-2">
                    <Text type="secondary">{item.label}: </Text>
                    <Text strong>{item.value}</Text>
                  </div>
                ))}
              </Card>
            </section>

            <Divider />

            {/* Test Actions Section */}
            <section>
              <Title level={4}>Test Actions</Title>
              <div className="space-y-4">
                <Button 
                  type="primary" 
                  onClick={handleTestAction}
                  className="w-full"
                >
                  Trigger Test Action
                </Button>
                <Button 
                  onClick={() => console.log('Current State:', useAuthStore.getState())}
                  className="w-full"
                >
                  Log Current State
                </Button>
              </div>
            </section>

            <Divider />

            {/* Environment Info */}
            <section>
              <Title level={4}>Environment Information</Title>
              <Card className="bg-gray-50">
                <Text type="secondary">API URL: </Text>
                <Text strong>{process.env.REACT_APP_API_URL || 'Not set'}</Text>
                <br />
                <Text type="secondary">Environment: </Text>
                <Text strong>{process.env.NODE_ENV}</Text>
              </Card>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Test;