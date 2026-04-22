import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import {
  fetchDashboardOverview,
  fetchTrends,
} from '../store/slices/dashboardSlice';

const activityIconMap = {
  local_shipping: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />,
  price_change: <PriceChangeOutlinedIcon sx={{ fontSize: 16 }} />,
  warning: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
  add_shopping_cart: <AddShoppingCartIcon sx={{ fontSize: 16 }} />,
};
const activityColorMap = {
  success: { bg: '#d6e4f5', color: '#00488d' },
  info: { bg: '#d6e3ff', color: '#001b3d' },
  error: { bg: '#ffdad6', color: '#93000a' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          p: 1.5,
          boxShadow: '0 8px 24px rgba(25,28,29,0.1)',
          minWidth: 130,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            mb: 0.5,
            color: '#424752',
          }}
        >
          {label}
        </Typography>
        {payload.map((p) => (
          <Typography
            key={p.name}
            sx={{ fontSize: '0.75rem', color: p.color, fontWeight: 600 }}
          >
            {p.name}: ₹{p.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const { summary, monthlySalesData, topProducts, recentActivity } =
    useSelector((s) => s.dashboard);

  const lowStockProducts = useSelector((s) =>
    (s.products.items || []).filter(
      (p) => p.status === 'Low Stock' || p.status === 'Critical',
    ),
  );

  const stats = [
    {
      title: 'Inventory Value',
      value: `₹${((summary.totalInventoryValue || 0) / 1000000).toFixed(2)}M`,
      subtitle: '4 locations',
      trend: 2.4,
      accentColor: '#a8c8ff',
      icon: <MonetizationOnIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Low Stock',
      value: summary.lowStockItems || 0,
      subtitle: 'Needs attention',
      trend: -3,
      trendLabel: 'Critical',
      accentColor: '#ffb691',
      icon: <WarningAmberIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Shipments',
      value: summary.activeShipments || 0,
      subtitle: 'In 48h',
      trend: 1.2,
      accentColor: '#d6e4f5',
      icon: <LocalShippingIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Health',
      value: `${summary.inventoryHealth || 0}%`,
      subtitle: 'vs last month',
      trend: 0.4,
      accentColor: '#bac8d8',
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
    },
  ];

  useEffect(() => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchTrends({ groupBy: 'month' }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <Header
        title="Dashboard"
        subtitle={`Status as of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
      />

      {/* Stat Cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4   gap-3 ">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Chart + Profit — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Sales vs Purchases Chart */}
        <Card className="lg:col-span-2 ">
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box className="flex items-start justify-between mb-3">
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#191c1d',
                    fontSize: { xs: '0.88rem', md: '0.95rem' },
                  }}
                >
                  Sales vs Purchases
                </Typography>
                <Typography sx={{ color: '#727783', fontSize: '0.75rem' }}>
                  Last 6 months
                </Typography>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={isMobile ? 160 : 210}>
              <AreaChart
                data={monthlySalesData || []}
                margin={{ top: 0, right: 5, left: -25, bottom: 0 }}
              >
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(194,198,212,0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#424752', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#424752', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '0.72rem', paddingTop: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#00488d"
                  strokeWidth={2}
                  fill="url(#salesGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  name="Purchases"
                  stroke="#bac8d8"
                  strokeWidth={2}
                  fill="url(#purchGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Efficiency */}
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#191c1d',
                fontSize: { xs: '0.88rem', md: '0.95rem' },
                mb: 2,
              }}
            >
              Profit Efficiency
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: isMobile ? 100 : 120,
                  height: isMobile ? 100 : 120,
                  borderRadius: '50%',
                  margin: '0 auto',
                  background: `conic-gradient(#00488d ${(summary.avgMargin || 0) * 3.6}deg, #e6e8e9 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 74 : 90,
                    height: isMobile ? 74 : 90,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: isMobile ? '1.1rem' : '1.3rem',
                      color: '#00488d',
                      lineHeight: 1,
                    }}
                  >
                    {summary.avgMargin || 0}%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.58rem',
                      color: '#727783',
                      fontWeight: 600,
                    }}
                  >
                    AVG MARGIN
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(194,198,212,0.2)', mb: 1.5 }} />
            <Box className="flex justify-between items-center">
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    color: '#727783',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05rem',
                  }}
                >
                  Projected Q4
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#00488d',
                    mt: 0.2,
                  }}
                >
                  +₹420K
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    color: '#727783',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05rem',
                  }}
                >
                  Gross Profit
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#191c1d',
                    mt: 0.2,
                  }}
                >
                  ₹{((summary.grossProfit || 0) / 1000).toFixed(1)}K
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Assets */}
        <Card className="lg:col-span-2">
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box className="flex items-center justify-between mb-2">
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#191c1d',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                }}
              >
                Top Performing Assets
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                onClick={() => navigate('/inventory')}
                sx={{
                  fontSize: '0.75rem',
                  color: '#00488d',
                  textTransform: 'none',
                  fontWeight: 600,
                  p: '4px 8px',
                }}
              >
                View All
              </Button>
            </Box>
            {topProducts ||
              [].map((p, i) => (
                <Box
                  key={p.sku}
                  className="flex items-center justify-between cursor-pointer"
                  sx={{
                    py: 1.2,
                    px: 1,
                    borderRadius: '8px',
                    transition: 'all 0.15s',
                    '&:hover': { backgroundColor: '#f2f4f5' },
                  }}
                  onClick={() => navigate(`/inventory/${p.sku}`)}
                >
                  <Box className="flex items-center gap-2 min-w-0">
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '7px',
                        flexShrink: 0,
                        background:
                          i === 0
                            ? 'linear-gradient(135deg,#00488d,#005fb8)'
                            : '#f2f4f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: i === 0 ? '#fff' : '#424752',
                        }}
                      >
                        {i + 1}
                      </Typography>
                    </Box>
                    <Box className="min-w-0">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          color: '#191c1d',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#727783' }}>
                        SKU: {p.sku}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        color: '#00488d',
                      }}
                    >
                      +₹{p.revenue.toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#727783' }}>
                      {p.margin}% margin
                    </Typography>
                  </Box>
                </Box>
              ))}
          </CardContent>
        </Card>

        {/* Alerts + Activity — side-by-side on tablet, stacked on mobile */}
        <Box className="flex flex-col gap-4">
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#191c1d',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                  mb: 1.5,
                }}
              >
                Critical Alerts
              </Typography>
              {lowStockProducts.slice(0, 3).map((p) => (
                <Box
                  key={p.id}
                  className="flex items-center gap-2 mb-1.5"
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    backgroundColor:
                      p.status === 'Critical' ? '#fff8f6' : '#fffcf8',
                    border: `1px solid ${p.status === 'Critical' ? '#ffdad6' : '#ffdbcb'}`,
                  }}
                >
                  <WarningAmberIcon
                    sx={{
                      fontSize: 15,
                      color: p.status === 'Critical' ? '#93000a' : '#7b3200',
                      flexShrink: 0,
                    }}
                  />
                  <Box className="min-w-0">
                    <Typography
                      sx={{
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: '#191c1d',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#727783' }}>
                      {p.stock} units · Reorder at {p.reorderPoint}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#191c1d',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                  mb: 1,
                }}
              >
                Recent Activity
              </Typography>
              <List dense disablePadding>
                {recentActivity ||
                  [].map((a) => {
                    const cfg = activityColorMap[a.type];
                    return (
                      <ListItem key={a.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar sx={{ minWidth: 35 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                              borderRadius: '7px',
                            }}
                          >
                            {activityIconMap[a.icon]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: '#191c1d',
                                lineHeight: 1.3,
                              }}
                            >
                              {a.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{ fontSize: '0.68rem', color: '#727783' }}
                            >
                              {a.subtitle}
                            </Typography>
                          }
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
