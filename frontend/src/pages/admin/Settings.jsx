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
      showMessage('success', '背景图更新成功');
    } catch (error) {
      showMessage('error', '更新背景图失败');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', '两次输入的新密码不一致');
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showMessage('success', '密码修改成功');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.response?.data?.error || '密码修改失败');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-8">系统设置</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Background Image Section */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">外观设置</h3>
          <form onSubmit={handleBgSave} className="max-w-xl">
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">全局背景图片链接</label>
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
                    <p className="text-xs text-gray-500 mb-2">预览：</p>
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-600 relative">
                        <img src={backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              保存外观设置
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">安全设置</h3>
          <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">当前密码</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">新密码</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">确认新密码</label>
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
              修改密码
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;