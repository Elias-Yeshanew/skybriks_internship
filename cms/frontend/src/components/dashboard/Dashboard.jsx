import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, FileText, TrendingUp, Loader2 } from 'lucide-react';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a855f7'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardService.getStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loading">
      <Loader2 size={40} className="spin" />
    </div>
  );

  const chartData = stats?.averageMarksByDept
    ? Object.entries(stats.averageMarksByDept).map(([dept, avg]) => ({ dept, avg: +avg.toFixed(1) }))
    : [];

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: Users, color: '#6366f1' },
    { label: 'Fees Collected', value: `$${stats?.totalFeesCollected ?? 0}`, icon: DollarSign, color: '#10b981' },
    { label: 'Fees Pending', value: `$${stats?.totalFeesPending ?? 0}`, icon: TrendingUp, color: '#f59e0b' },
    { label: 'Documents', value: stats?.totalDocuments ?? 0, icon: FileText, color: '#22d3ee' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.fullName}</strong> — {user?.role}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: color + '20', color }}>
              <Icon size={24} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-card">
          <h3>Average Marks by Department (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dept" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 13 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [`${v}%`, 'Avg Marks']}
              />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
