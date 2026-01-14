import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [systemTitle, setSystemTitle] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.backgroundImage) setBackgroundImage(res.data.backgroundImage);
      if (res.data.systemTitle) setSystemTitle(res.data.systemTitle);
      if (res.data.faviconUrl) setFaviconUrl(res.data.faviconUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneralSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send batch update to reduce connections and avoid locks
      await api.post('/settings', [
        { key: 'backgroundImage', value: backgroundImage },
        { key: 'systemTitle', value: systemTitle },
        { key: 'faviconUrl', value: faviconUrl }
      ]);
      
      showMessage('success', '基本设置更新成功');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || '更新设置失败';
      showMessage('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', '两次输入的新密码不一致');
      return;
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      showMessage('error', '新密码不能与当前密码相同');
      return;
    }
    
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Success logic: Clear token, show message, and redirect
      setMessage({ type: 'success', text: '密码修改成功，正在跳转登录页...' });
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change failed:', error);
      let errMsg = '密码修改失败';
      
      if (error.response && error.response.data && error.response.data.error) {
          // Backend returned specific error message
          errMsg = error.response.data.error;
      } else if (error.message) {
          // Network or other client-side error
          errMsg = error.message;
      }
      
      showMessage('error', errMsg);
      setPasswordLoading(false); 
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="max-w-4xl relative">
      <h2 className="text-2xl font-bold text-white mb-8">系统设置</h2>

      {message.text && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-fade-in-up flex items-center gap-3 min-w-[300px] justify-center text-center ${
          message.type === 'success' 
            ? 'bg-green-500/90 text-white border-green-400/30' 
            : 'bg-red-500/90 text-white border-red-400/30'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-8">
        {/* General Settings Section */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">基本设置</h3>
          <form onSubmit={handleGeneralSave} className="max-w-xl space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">系统标题 & 浏览器标签</label>
              <input 
                type="text" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="Nu-Nav"
                value={systemTitle}
                onChange={(e) => setSystemTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">浏览器图标 (Favicon) 链接</label>
              <div className="flex gap-4">
                  <input 
                    type="url" 
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    placeholder="/logo.svg"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                  />
                  <div className="w-[46px] h-[46px] rounded-lg bg-gray-900 border border-gray-600 flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {faviconUrl ? (
                          <img src={faviconUrl} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                          <div className="text-xs text-gray-500">默认</div>
                      )}
                  </div>
              </div>
            </div>
            <div>
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
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? '保存中...' : '保存基本设置'}
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
              disabled={passwordLoading}
              className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors mt-2 flex items-center gap-2 ${passwordLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {passwordLoading ? '处理中...' : '修改密码'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;