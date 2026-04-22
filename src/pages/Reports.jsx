import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import Header from "../components/layout/Header";
import StatCard from "../components/common/StatCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import {
  fetchReportOverview,
  fetchProductReport,
  fetchReportTrends,
} from "../store/slices/reportSlice";

const COLORS = ["#00488d", "#005fb8", "#a8c8ff", "#bac8d8", "#e1e3e4"];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          p: 1.5,
          boxShadow: "0 8px 24px rgba(25,28,29,0.1)",
          minWidth: 120,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "#191c1d",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        {payload.map((p) => (
          <Typography
            key={p.name}
            sx={{
              fontSize: "0.72rem",
              color: p.fill || "#00488d",
              fontWeight: 600,
            }}
          >
            {p.name}: ₹{Number(p.value).toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { overview, productReport, trends, loading } = useSelector(
    (s) => s.report,
  );

  useEffect(() => {
    dispatch(fetchReportOverview());
    dispatch(fetchReportTrends({ groupBy: "month" }));
  }, [dispatch]);

  useEffect(() => {
    const firstProduct = productReport?.products?.[0];
    const id = firstProduct?.id;
    console.log(id);
    if (id) {
      dispatch(fetchProductReport({ id }));
    }
  }, [dispatch]);

  const summary = {
    totalRevenue: Number(overview?.totalSales || 0),
    costOfGoods: Number(overview?.totalPurchases || 0),
    grossProfit: Number(overview?.profitOrLoss || 0),
    netMargin: Number(overview?.netMargin || 0),
  };

  const categoryShare = overview?.categoryShare || [];
  const topProducts = overview?.topProducts || [];

  const summaryStats = [
    {
      title: "Total Revenue",
      value: `₹${summary.totalRevenue}`,
      trend: 12.4,
      accentColor: "#a8c8ff",
      icon: <MonetizationOnIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: "Cost of Goods",
      value: `₹${summary.costOfGoods}`,
      trend: -2.1,
      accentColor: "#ffb691",
      icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: "Gross Profit",
      value: `₹${summary.grossProfit.toFixed(1)}`,
      trend: 18.7,
      accentColor: "#d6e4f5",
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
    },
    {
      title: "Net Margin",
      value: `${summary.netMargin}%`,
      trend: 3.1,
      accentColor: "#bac8d8",
      icon: <PercentIcon sx={{ fontSize: 16 }} />,
    },
  ];

  const barData = (trends || []).map((m) => {
    const sales = Number(m.totalSales || 0);

    const purchases = Number(m.totalPurchases || 0);
    return {
      month: m.month || m.label || m.period || "",
      sales,
      purchases,
      profit: sales - purchases,
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <Header title="Reports" subtitle="Performance insights " />

      {/* Stats — 2×2 on mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {summaryStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#191c1d",
                fontSize: { xs: "0.88rem", md: "0.95rem" },
                mb: 0.3,
              }}
            >
              Monthly Profit Trends
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#727783", mb: 2 }}>
              Revenue vs Purchases vs Profit
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 230}>
              <BarChart
                data={barData}
                margin={{ top: 0, right: 5, left: -22, bottom: 0 }}
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(194,198,212,0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#424752", fontFamily: "Inter" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#424752", fontFamily: "Inter" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "0.72rem" }}
                />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#00488d"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={isMobile ? 18 : 26}
                />
                <Bar
                  dataKey="purchases"
                  name="Purchases"
                  fill="#bac8d8"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={isMobile ? 18 : 26}
                />
                <Bar
                  dataKey="profit"
                  name="Profit"
                  fill="#a8c8ff"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={isMobile ? 18 : 26}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#191c1d",
                fontSize: { xs: "0.88rem", md: "0.95rem" },
                mb: 0.3,
              }}
            >
              Category Share
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#727783", mb: 1 }}>
              Revenue by category
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 150 : 180}>
              <PieChart>
                <Pie
                  data={categoryShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 38 : 48}
                  outerRadius={isMobile ? 62 : 76}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {categoryShare.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <Box className="space-y-1 mt-1">
              {categoryShare.map((c, i) => (
                <Box key={c.name} className="flex items-center justify-between">
                  <Box className="flex items-center gap-1.5">
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: COLORS[i],
                      }}
                    />
                    <Typography sx={{ fontSize: "0.73rem", color: "#424752" }}>
                      {c.name}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.73rem",
                      fontWeight: 700,
                      color: "#191c1d",
                    }}
                  >
                    {c.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance — scrollable table on mobile */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: { xs: 2, md: 3 }, pb: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#191c1d",
                fontSize: { xs: "0.88rem", md: "0.95rem" },
              }}
            >
              Per-Product Performance
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#727783" }}>
              Top {topProducts.length} Product by revenue
            </Typography>
          </Box>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: isMobile ? 480 : undefined }}>
              <TableHead>
                <TableRow>
                  {["Product", "Units Sold", "Revenue", "Margin"].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((p, i) => (
                  <TableRow
                    key={p.sku}
                    sx={{ "&:hover": { backgroundColor: "#f2f4f5" } }}
                  >
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "6px",
                            flexShrink: 0,
                            background:
                              i < 3
                                ? "linear-gradient(135deg,#00488d,#005fb8)"
                                : "#f2f4f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              color: i < 3 ? "#fff" : "#424752",
                            }}
                          >
                            {i + 1}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.82rem",
                              color: "#191c1d",
                            }}
                          >
                            {p.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.7rem", color: "#727783" }}
                          >
                            {p.sku}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                        fontSize: "0.84rem",
                      }}
                    >
                      {Number(p.totalSoldQty || 0).toLocaleString()}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        color: "#00488d",
                      }}
                    >
                      {" "}
                      ₹{Number(p.totalSalesAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#191c1d",
                            mb: 0.3,
                          }}
                        >
                          {p.netMargin || 0}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.max(
                            0,
                            Math.min(100, Number(p.netMargin || 0)),
                          )}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: "#e6e8e9",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#00488d",
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && topProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography
                        sx={{ fontSize: "0.82rem", color: "#727783" }}
                      >
                        No product performance data found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
