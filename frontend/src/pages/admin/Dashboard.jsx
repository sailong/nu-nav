import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Layers, Tags } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ categories: 0, tags: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags')
        ]);
        setStats({
          categories: catsRes.data.length,
          tags: tagsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Categories</h3>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Layers className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.categories}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Tags</h3>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Tags className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.tags}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
