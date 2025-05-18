'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Notification } from '@/lib/db';
import { db } from '@/lib/db';
import { NOTIFICATION_TYPES } from '@/lib/constants';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('user1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(Object.values(NOTIFICATION_TYPES));
  const [socketError, setSocketError] = useState<string | null>(null);
  const { on, connected } = useSocket();

  // Get list of users from the database
  const users = db.users;

  useEffect(() => {
    // Fetch notifications for selected user
    fetchNotifications(selectedUserId);

    // Listen for new notifications
    const cleanup = on('notification', (newNotification: Notification) => {
      if (newNotification.userId === selectedUserId) {
        setNotifications(prev => [newNotification, ...prev]);
      }
    });

    return cleanup;
  }, [on, selectedUserId]);

  useEffect(() => {
    if (!connected) {
      setSocketError('Real-time updates are currently unavailable. Please refresh the page to try reconnecting.');
    } else {
      setSocketError(null);
    }
  }, [connected]);

  const fetchNotifications = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleRetryConnection = () => {
    window.location.reload();
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.subject && notification.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedTypes.includes(notification.type);
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {socketError && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-yellow-700">{socketError}</p>
            <button
              onClick={handleRetryConnection}
              className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="userSelect" className="text-sm font-medium text-gray-700">
              Select User:
            </label>
            <select
              id="userSelect"
              value={selectedUserId}
              onChange={handleUserChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(NOTIFICATION_TYPES).map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow ${
              notification.status === 'FAILED' ? 'bg-red-50' :
              notification.status === 'SENT' ? 'bg-green-50' :
              'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.type}</h3>
                {notification.subject && (
                  <p className="text-gray-600">{notification.subject}</p>
                )}
                <p className="mt-2">{notification.message}</p>
              </div>
              <div className="text-sm text-gray-500">
                <div>{new Date(notification.timestamp).toLocaleString()}</div>
                <div className="mt-1">
                  Status: <span className="font-medium">{notification.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredNotifications.length === 0 && (
          <p className="text-gray-500 text-center">
            {notifications.length === 0 
              ? "No notifications found for this user"
              : "No notifications match your search criteria"}
          </p>
        )}
      </div>
    </div>
  );
}
