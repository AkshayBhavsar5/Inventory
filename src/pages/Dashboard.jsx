import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Button, Divider, Avatar, List,
  ListItem, ListItemAvatar, ListItemText,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';

const activityIconMap = {
  local_shipping: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />,
  price_change: <PriceChangeOutlinedIcon sx={{ fontSize: 18 }} />,
  warning: <ErrorOutlineIcon sx={{ fontSize: 18 }} />,
  add_shopping_cart: <AddShoppingCartIcon sx={{ fontSize: 18 }} />,
};
const activityColorMap = {
  success: { bg: '#d6e4f5', color: '#00488d' },
  info: { bg: '#d6e3ff', color: '#001b3d' },
  error: { bg: '#ffdad6', color: '#93000a' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: '#fff', borderRadius: '10px', p: 1.5, boxShadow: '0 8px 24px rgba(25,28,29,0.1)', minWidth: 140 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.78rem', mb: 0.5, color: '#424752' }}>{label}</Typography>
        {payload.map((p) => (
          <Typography key={p.name} sx={{ fontSize: '0.78rem', color: p.color, fontWeight: 600 }}>
            {p.name}: ${p.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { summary, monthlySalesData, topProducts, recentActivity } = useSelector(s => s.dashboard);
  const lowStockProducts = useSelector(s => s.products.items.filter(p => p.status === 'Low Stock' || p.status === 'Critical'));

  const stats = [
    {
      title: 'Total Inventory Value', value: `$${(summary.totalInventoryValue / 1000000).toFixed(2)}M`,
      subtitle: 'Across 4 locations', trend: 2.4, accentColor: '#a8c8ff',
      icon: <MonetizationOnIcon sx={{ fontSize: 18 }} />,
    },
    {
      title: 'Low Stock Items', value: summary.lowStockItems,
      subtitle: 'Requires attention', trend: -3, trendLabel: 'Critical',
      accentColor: '#ffb691', icon: <WarningAmberIcon sx={{ fontSize: 18 }} />,
    },
    {
      title: 'Active Shipments', value: summary.activeShipments,
      subtitle: 'Expected in 48h', trend: 1.2, accentColor: '#d6e4f5',
      icon: <LocalShippingIcon sx={{ fontSize: 18 }} />,
    },
    {
      title: 'Inventory Health', value: `${summary.inventoryHealth}%`,
      subtitle: 'vs last month', trend: 0.4, accentColor: '#bac8d8',
      icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    },
  ];

  return (
    <Box>
      <Header title="Dashboard Overview" subtitle={`Status as of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Sales vs Purchases Chart */}
        <Card sx={{ gridColumn: 'span 2', p: 0 }} className="lg:col-span-2">
          <CardContent sx={{ p: 3 }}>
            <Box className="flex items-center justify-between mb-4">
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}>
                  Sales vs Purchases
                </Typography>
                <Typography variant="body2" sx={{ color: '#727783', fontSize: '0.78rem' }}>Last 6 months performance</Typography>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlySalesData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00488d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00488d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bac8d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#bac8d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(194,198,212,0.2)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#424752', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#424752', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem', paddingTop: 8 }} />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#00488d" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} activeDot={{ r: 5, fill: '#00488d' }} />
                <Area type="monotone" dataKey="purchases" name="Purchases" stroke="#bac8d8" strokeWidth={2} fill="url(#purchGrad)" dot={false} activeDot={{ r: 5, fill: '#bac8d8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Efficiency */}
        <Card>
          <CardContent sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem', mb: 3 }}>
              Profit Efficiency
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                background: `conic-gradient(#00488d ${summary.avgMargin * 3.6}deg, #e6e8e9 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                <Box sx={{
                  width: 90, height: 90, borderRadius: '50%', backgroundColor: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#00488d', lineHeight: 1 }}>
                    {summary.avgMargin}%
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#727783', fontWeight: 600 }}>AVG MARGIN</Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(194,198,212,0.2)', mb: 2 }} />
            <Box className="flex justify-between items-center">
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#727783', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Projected Q4</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#00488d', mt: 0.3 }}>+$420K</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#727783', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Gross Profit</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#191c1d', mt: 0.3 }}>${(summary.grossProfit / 1000).toFixed(1)}K</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Performing Assets */}
        <Card className="lg:col-span-2">
          <CardContent sx={{ p: 3 }}>
            <Box className="flex items-center justify-between mb-3">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem' }}>
                Top Performing Assets
              </Typography>
              <Button
                size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                onClick={() => navigate('/inventory')}
                sx={{ fontSize: '0.78rem', color: '#00488d', textTransform: 'none', fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>
            {topProducts.map((p, i) => (
              <Box
                key={p.sku}
                className="flex items-center justify-between py-2 cursor-pointer"
                sx={{ borderRadius: '8px', px: 1.5, transition: 'all 0.15s', '&:hover': { backgroundColor: '#f2f4f5' } }}
                onClick={() => navigate(`/inventory/${p.sku}`)}
              >
                <Box className="flex items-center gap-3">
                  <Box sx={{
                    width: 28, height: 28, borderRadius: '7px',
                    background: i === 0 ? 'linear-gradient(135deg,#00488d,#005fb8)' : '#f2f4f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? '#fff' : '#424752' }}>{i + 1}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', color: '#191c1d' }}>{p.name}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#727783' }}>SKU: {p.sku} · {p.unitsSold.toLocaleString()} units sold</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#00488d' }}>+${p.revenue.toLocaleString()}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#727783' }}>{p.margin}% margin</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Right column: Alerts + Activity */}
        <Box className="flex flex-col gap-4">
          {/* Critical Alerts */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem', mb: 2 }}>
                Critical Alerts
              </Typography>
              {lowStockProducts.slice(0, 3).map((p) => (
                <Box key={p.id} className="flex items-center gap-2 mb-2 cursor-pointer"
                  sx={{ p: 1.2, borderRadius: '8px', backgroundColor: p.status === 'Critical' ? '#fff8f6' : '#fffcf8', border: `1px solid ${p.status === 'Critical' ? '#ffdad6' : '#ffdbcb'}` }}
                >
                  <WarningAmberIcon sx={{ fontSize: 16, color: p.status === 'Critical' ? '#93000a' : '#7b3200', flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#191c1d' }}>{p.name}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#727783' }}>{p.stock} units left · Reorder at {p.reorderPoint}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191c1d', fontSize: '0.95rem', mb: 1 }}>
                Recent Activity
              </Typography>
              <List dense disablePadding>
                {recentActivity.map((a) => {
                  const cfg = activityColorMap[a.type];
                  return (
                    <ListItem key={a.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 38 }}>
                        <Avatar sx={{ width: 30, height: 30, backgroundColor: cfg.bg, color: cfg.color, borderRadius: '8px' }}>
                          {activityIconMap[a.icon]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#191c1d' }}>{a.title}</Typography>}
                        secondary={<Typography sx={{ fontSize: '0.72rem', color: '#727783' }}>{a.subtitle}</Typography>}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </div>
    </Box>
  );
}
