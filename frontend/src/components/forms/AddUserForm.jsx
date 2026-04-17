import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddUserForm = ({ isOpen, onClose, onSubmit }) => {
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'User',
      status: 'active',
    }
  });

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
            <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new account and set permissions.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" 
              {...register('name', { required: 'Name is required' })}
              placeholder="e.g. John Doe"
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
              placeholder="name@company.com"
              className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              placeholder="Set a secure password"
              className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organization Role</label>
              <div className="relative">
                <select 
                  {...register('role')}
                  className="w-full bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none transition-all appearance-none"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
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
              Create User
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddUserForm;