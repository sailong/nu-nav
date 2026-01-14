import React, { useEffect, useState } from 'react';
import api from '../../api';
import Modal from '../../components/Modal';
import { Plus, Pencil, Trash2, ExternalLink, Globe } from 'lucide-react';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', url: '', logo: '', description: '', categoryId: '', sortOrder: 0 
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tagsRes, catsRes] = await Promise.all([
        api.get('/tags'),
        api.get('/categories')
      ]);
      setTags(tagsRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tags/${editingId}`, formData);
      } else {
        await api.post('/tags', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (tag) => {
    setFormData({
      name: tag.name,
      url: tag.url,
      logo: tag.logo || '',
      description: tag.description || '',
      categoryId: tag.categoryId,
      sortOrder: tag.sortOrder
    });
    setEditingId(tag.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await api.delete(`/tags/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', url: '', logo: '', description: '', categoryId: categories.length > 0 ? categories[0].id : '', sortOrder: 0 
    });
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Tags</h2>
        <button 
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tag
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400">
            <tr>
              <th className="p-4 font-medium">Logo</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">URL</th>
              <th className="p-4 font-medium w-48 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4">
                    {tag.logo ? (
                        <img src={tag.logo} alt="" className="w-8 h-8 rounded-full bg-white/10 object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                        </div>
                    )}
                </td>
                <td className="p-4">
                    <div className="text-white font-medium">{tag.name}</div>
                    {tag.description && <div className="text-gray-500 text-xs truncate max-w-[200px]">{tag.description}</div>}
                </td>
                <td className="p-4 text-gray-400">{getCategoryName(tag.categoryId)}</td>
                <td className="p-4 text-blue-400 truncate max-w-[200px] hover:underline">
                    <a href={tag.url} target="_blank" rel="noopener noreferrer">{tag.url}</a>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(tag)}
                      className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(tag.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {tags.length === 0 && (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No tags found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Tag' : 'New Tag'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-gray-400 mb-1.5 text-sm">Category</label>
                <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
                >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                </select>
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-400 mb-1.5 text-sm">Name</label>
                <input 
                type="text" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-400 mb-1.5 text-sm">Sort Order</label>
                <input 
                type="number" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.sortOrder}
                onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1.5 text-sm">URL</label>
            <input 
              type="url" 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1.5 text-sm">Logo URL</label>
            <div className="flex gap-4">
                <input 
                type="url" 
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                />
                <div className="w-[46px] h-[46px] rounded-lg bg-gray-900 border border-gray-600 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.logo ? (
                        <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Globe className="w-5 h-5 text-gray-600" />
                    )}
                </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1.5 text-sm">Description</label>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingId ? 'Save Changes' : 'Create Tag'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tags;
