import React, { useEffect, useState } from 'react';
import api from '../../api';
import Modal from '../../components/Modal';
import { Plus, Pencil, Trash2, Globe, Star } from 'lucide-react';

const SearchEngines = () => {
  const [engines, setEngines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', url: '', placeholder: '', sortOrder: 0, isDefault: false 
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEngines();
  }, []);

  const fetchEngines = async () => {
    try {
      const res = await api.get('/search-engines');
      setEngines(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/search-engines/${editingId}`, formData);
      } else {
        await api.post('/search-engines', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEngines();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (eng) => {
    setFormData({
      name: eng.name,
      url: eng.url,
      placeholder: eng.placeholder || '',
      sortOrder: eng.sortOrder,
      isDefault: eng.isDefault
    });
    setEditingId(eng.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个搜索引擎吗？')) {
      try {
        await api.delete(`/search-engines/${id}`);
        fetchEngines();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', placeholder: '', sortOrder: 0, isDefault: false });
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">搜索设置</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增引擎
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400">
            <tr>
              <th className="p-4 font-medium">名称</th>
              <th className="p-4 font-medium">URL 模板</th>
              <th className="p-4 font-medium">默认</th>
              <th className="p-4 font-medium">排序</th>
              <th className="p-4 font-medium w-48 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {engines.map((eng) => (
              <tr key={eng.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{eng.name}</span>
                        {eng.isDefault && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                    </div>
                </td>
                <td className="p-4 text-gray-400 font-mono text-xs truncate max-w-xs">{eng.url}</td>
                <td className="p-4 text-gray-400">{eng.isDefault ? '是' : '否'}</td>
                <td className="p-4 text-gray-400">{eng.sortOrder}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(eng)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(eng.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? '编辑引擎' : '新增引擎'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-gray-400 mb-1.5 text-sm">名称</label>
                <input 
                  type="text" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
                />
            </div>
            <div className="col-span-2">
                <label className="block text-gray-400 mb-1.5 text-sm">URL 模板 (关键词用 %s 占位，站内请输入 local)</label>
                <input 
                  type="text" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white font-mono text-sm"
                  placeholder="https://google.com/search?q="
                  value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required 
                />
            </div>
            <div className="col-span-1">
                <label className="block text-gray-400 mb-1.5 text-sm">提示文字</label>
                <input 
                  type="text" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white"
                  value={formData.placeholder} onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
                />
            </div>
            <div className="col-span-1">
                <label className="block text-gray-400 mb-1.5 text-sm">排序</label>
                <input 
                  type="number" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white"
                  value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                />
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <input 
                  type="checkbox" id="isDefault" className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                />
                <label htmlFor="isDefault" className="text-gray-300 text-sm cursor-pointer">设为默认搜索引擎</label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-300">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">保存</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SearchEngines;
