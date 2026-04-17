import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '../store/api';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProfile(data).unwrap();
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={user.role}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;