import ReusableTable from "./Listpage";
import AddUserForm from "../forms/AddUserForm";
import { useState } from "react";
import UpdateUserForm from "../forms/UpdateUserForm";
import { useSelector } from 'react-redux';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../store/api';
import { Navigate } from 'react-router-dom';
import Notification from '../common/Notification';
import useNotification from '../../hooks/useNotification';

const UserDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);
  const [isUpdateUserFormOpen, setIsUpdateUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Only make API calls if user is authenticated and has admin or manager role
  const { data: users, isLoading, error, refetch } = useGetUsersQuery(
    {},
    {
      skip: !isAuthenticated || !token || (user?.role !== 'Admin' && user?.role !== 'Manager')
    }
  );
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // If not admin or manager, redirect to profile
  if (!user || (user.role !== 'Admin' && user.role !== 'Manager')) {
    return <Navigate to="/profile" />;
  }

  // If not authenticated, show loading state
  if (!isAuthenticated || !token) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    const errorMessage = error?.data?.message || error?.message || 'Error loading users';
    const isAuthError = errorMessage.includes('Not authorized') || errorMessage.includes('no token provided');
    
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-red-600 mb-4">
              {isAuthError ? 'Authentication required. Please login first.' : 'Error loading users'}
            </p>
            {isAuthError ? (
              <p className="text-gray-600 mb-4 text-sm">
                Please login with admin credentials to access user management.
              </p>
            ) : (
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsUpdateUserFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        showSuccess('User deleted successfully');
      } catch (error) {
        const errorMessage = error?.data?.message || error?.message || 'Failed to delete user';
        showError(errorMessage);
      }
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const result = await createUser(userData).unwrap();
      console.log('User created successfully:', result);
      setIsAddUserFormOpen(false);
      // Show success message based on backend response
      if (result.message) {
        showSuccess(result.message);
      } else {
        showSuccess('User created successfully');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      // Show more detailed error message
      const errorMessage = error?.data?.message || error?.message || 'Failed to create user';
      showError(errorMessage);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const result = await updateUser({ id: selectedUser._id, ...userData }).unwrap();
      console.log('User updated successfully:', result);
      setIsUpdateUserFormOpen(false);
      // Show success message based on backend response
      if (result.message) {
        showSuccess(result.message);
      } else {
        showSuccess('User updated successfully');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update user';
      showError(errorMessage);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <nav>
        <ul>
            <li></li>
        </ul>
      </nav>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">
          {user?.role === 'Admin' ? 'User Management' : 'Manage Users'}
        </h1>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsAddUserFormOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New User
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <ReusableTable
          data={users?.data || users || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          // yahan isActivityLog pass nahi kiya, toh default 'false' rahega aur actions dikhenge
        />
      </div>
      <AddUserForm
        isOpen={isAddUserFormOpen}
        onClose={() => setIsAddUserFormOpen(false)}
        onSubmit={handleAddUser}
      />
      <UpdateUserForm
        isOpen={isUpdateUserFormOpen}
        onClose={() => setIsUpdateUserFormOpen(false)}
        userData={selectedUser}
        onSubmit={handleUpdateUser}
      />
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};
export default UserDashboard;