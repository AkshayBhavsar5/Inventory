import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Divider, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer, LinearProgress,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line,
} from 'recharts';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PercentIcon from '@mui/icons-material/Percent';

const COLORS = ['#00488d', '#005fb8', '#a8c8ff', '#bac8d8', '#e1e3e4'];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Box sx={{ backgroundColor: '#fff', borderRadius: '10px', p: 1.5, boxShadow: '0 8px 24px rgba(25,28,29,0.1)', minWidth: 130 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#191c1d', mb: 0.5 }}>{label}</Typography>
        {payload.map(p => (
          <Typography key={p.name} sx={{ fontSize: '0.75rem', color: p.fill || '#00488d', fontWeight: 600 }}>
            {p.name}: ${Number(p.value).toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const ProductPerformanceRow = ({ product, rank }) => {
  const margin = ((product.revenue - product.revenue * 0.42) / product.revenue * 100).toFixed(1);
  return (
    <TableRow sx={{ '&:hover': { backgroundColor: '#f2f4f5' } }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 24, height: 24, borderRadius: '6px', flexShrink: 0,
            background: rank <= 3 ? 'linear-gradient(135deg,#00488d,#005fb8)' : '#f2f4f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: rank <= 3 ? '#fff' : '#424752' }}>{rank}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#191c1d' }}>{product.name}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#727783' }}>{product.sku}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: '0.84rem' }}>{product.unitsSold.toLocaleString()}</TableCell>
      <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '0.84rem', color: '#00488d' }}>${product.revenue.toLocaleString()}</TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#191c1d', mb: 0.3 }}>{product.margin}%</Typography>
          <LinearProgress variant="determinate" value={product.margin}
            sx={{ height: 4, borderRadius: 2, backgroundColor: '#e6e8e9', '& .MuiLinearProgress-bar': { backgroundColor: '#00488d', borderRadius: 2 } }} />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default function Reports() {
  const { summary, monthlySalesData, categoryShare, topProducts } = useSelector(s => s.dashboard);

  const summaryStats = [
    { title: 'Total Revenue',  value: `$${(summary.totalRevenue / 1000).toFixed(1)}K`,  trend: 12.4, accentColor: '#a8c8ff', icon: <MonetizationOnIcon sx={{ fontSize: 18 }} /> },
    { title: 'Cost of Goods',  value: `$${(summary.costOfGoods / 1000).toFixed(1)}K`,   trend: -2.1, accentColor: '#ffb691', icon: <AccountBalanceIcon sx={{ fontSize: 18 }} /> },
    { title: 'Gross Profit',   value: `$${(summary.grossProfit / 1000).toFixed(1)}K`,   trend: 18.7, accentColor: '#d6e4f5', icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
    { title: 'Net Margin',     value: `${summary.netMargin}%`,                           trend: 3.1,  accentColor: '#bac8d8', icon: <PercentIcon sx={{ fontSize: 18 }} /> },
  ];

  const barData = monthlySalesData.map(m => ({ ...m, profit: m.sales - m.purchases }));

  return (
    <Box>
      <Header title="Reports & Analytics" subtitle="Performance insights for Fiscal Year 2024" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Monthly Profit Trends Bar */}
        <Card className="lg:col-span-2">
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem', mb: 0.5 }}>Monthly Profit Trends</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783', mb: 3 }}>Revenue vs Purchases vs Profit — Last 6 months</Typography>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(194,198,212,0.2)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#424752', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#424752', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="sales"     name="Sales"     fill="#00488d" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="purchases" name="Purchases" fill="#bac8d8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="profit"    name="Profit"    fill="#a8c8ff" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Share Pie */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem', mb: 0.5 }}>Category Share</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783', mb: 2 }}>Revenue by product category</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryShare} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {categoryShare.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <Box className="mt-2 space-y-1">
              {categoryShare.map((c, i) => (
                <Box key={c.name} className="flex items-center justify-between">
                  <Box className="flex items-center gap-1.5">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[i] }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#424752' }}>{c.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#191c1d' }}>{c.value}%</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}>Per-Product Performance</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#727783' }}>Showing top {topProducts.length} of 248 products</Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Product', 'Units Sold', 'Revenue', 'Margin'].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((p, i) => (
                  <ProductPerformanceRow key={p.sku} product={p} rank={i + 1} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
