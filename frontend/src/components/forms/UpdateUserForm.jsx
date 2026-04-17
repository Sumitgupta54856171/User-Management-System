import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const UpdateUserForm = ({ isOpen, onClose, userData, onSubmit }) => {
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'User',
        status: userData.status || 'active',
      });
      setIsActive(userData.status === 'active');
    }
  }, [userData, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleToggleStatus = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    setValue('status', newStatus ? 'active' : 'inactive');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Member Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Update credentials and permissions for this user.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" 
                alt="Profile" 
                className="w-16 h-16 rounded-full bg-red-500 object-cover border-2 border-white shadow-sm"
              />
              <button type="button" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm hover:bg-blue-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{userData?.name}</h3>
              <p className="text-xs text-gray-500">Member since Oct 2023</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organization Role</label>
                <div className="relative">
                  <select 
                    {...register('role')}
                    className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all appearance-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Status</label>
                <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-900 font-medium">{isActive ? 'Active' : 'Inactive'}</span>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <input 
                    type="hidden" 
                    {...register('status')}
                    value={isActive ? 'active' : 'inactive'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UpdateUserForm;