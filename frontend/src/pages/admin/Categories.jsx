import React, { useEffect, useState } from 'react';
import api from '../../api';
import Modal from '../../components/Modal';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', sortOrder: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', sortOrder: 0 });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, sortOrder: cat.sortOrder });
    setEditingId(cat.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除此分类吗？该分类下的所有标签也将被删除。')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openNew = () => {
    setFormData({ name: '', sortOrder: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">分类管理</h2>
        <button 
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增分类
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400">
            <tr>
              <th className="p-4 font-medium">名称</th>
              <th className="p-4 font-medium w-32">排序</th>
              <th className="p-4 font-medium w-48 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4 text-white font-medium">{cat.name}</td>
                <td className="p-4 text-gray-400">{cat.sortOrder}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
                <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">暂无分类</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? '编辑分类' : '新增分类'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1.5 text-sm">分类名称</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1.5 text-sm">排序权重</label>
            <input 
              type="number" 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.sortOrder}
              onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingId ? '保存修改' : '立即创建'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;