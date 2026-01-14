import React, { useEffect, useState } from 'react';
import api from '../../api';

const Settings = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.backgroundImage) setBackgroundImage(res.data.backgroundImage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBgSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings', { key: 'backgroundImage', value: backgroundImage });
      showMessage('success', 'Background image updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update background');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showMessage('success', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to change password');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Background Image Section */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
          <form onSubmit={handleBgSave} className="max-w-xl">
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Global Background Image URL</label>
              <input 
                type="url" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="https://images.unsplash.com/photo..."
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
              />
            </div>
            {backgroundImage && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-600 relative">
                        <img src={backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Save Appearance
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
          <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Current Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors mt-2"
            >
              Change Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
