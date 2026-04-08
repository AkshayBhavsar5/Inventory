import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  createProductAPI,
  updateProductAPI,
} from '../../store/slices/productsSlice';

const categories = [
  'Electronics',
  'Audio',
  'Displays',
  'Peripherals',
  'Gaming',
  'Smart Home',
  'Components',
];
const statuses = ['In Stock', 'Low Stock', 'Critical', 'Out of Stock'];
const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D'];

const emptyForm = {
  sku: '',
  name: '',
  category: '',
  quantity: '',
  reorderPoint: '',
  sellingPrice: '',
  costPrice: '',
  status: 'In Stock',
  location: 'Warehouse A',
};

export default function ProductModal({ open, onClose, editProduct = null }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(editProduct || emptyForm);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setForm(editProduct || emptyForm);
    setErrors({});
  }, [editProduct, open]);

  const validate = () => {
    const e = {};
    if (!form.sku) e.sku = 'SKU is required';
    if (!form.name) e.name = 'Name is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.quantity && form.quantity !== 0)
      e.quantity = 'Quantity is required';
    if (!form.sellingPrice) e.sellingPrice = 'Price is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Formatting the payload
    const productPayload = {
      ...form,
      quantity: Number(form.quantity),
      sellingPrice: Number(form.sellingPrice),
      costPrice: Number(form.costPrice),
      reorderPoint: Number(form.reorderPoint),
    };

    if (editProduct) {
      // Use the API thunk here
      dispatch(
        updateProductAPI({
          id: editProduct._id,
          data: productPayload,
        }),
      );
    } else {
      // Use the API thunk here
      dispatch(createProductAPI(productPayload));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1rem', color: '#191c1d' }}
            >
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#727783', fontSize: '0.78rem' }}
            >
              {editProduct
                ? `Editing SKU: ${editProduct.sku}`
                : 'Fill in the product details below'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#727783', '&:hover': { backgroundColor: '#f2f4f5' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Row 1 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="SKU *"
              value={form.sku}
              onChange={handleChange('sku')}
              error={!!errors.sku}
              helperText={errors.sku}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Category *"
              value={form.category}
              onChange={handleChange('category')}
              error={!!errors.category}
              helperText={errors.category}
              select
              size="small"
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* Row 2 */}
        <Box>
          <TextField
            fullWidth
            label="Product Name *"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            size="small"
          />
        </Box>

        {/* Row 3 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Stock Qty *"
              type="number"
              value={form.quantity}
              onChange={handleChange('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Reorder Point"
              type="number"
              value={form.reorderPoint}
              onChange={handleChange('reorderPoint')}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Status"
              value={form.status}
              onChange={handleChange('status')}
              select
              size="small"
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* Row 4 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Selling Price (₹) *"
              type="number"
              value={form.sellingPrice}
              onChange={handleChange('sellingPrice')}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Cost Price (₹)"
              type="number"
              value={form.costPrice}
              onChange={handleChange('costPrice')}
              size="small"
            />
          </Box>
        </Box>

        {/* {/* Row 5: Location Disabled */}
        {/* <Box>
            <TextField
              fullWidth
              label="Location"
              value={form.location}
              onChange={handleChange('location')}
              select
              size="small"
            >
              {locations.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </TextField>
        </Box> */}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{ color: '#424752', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ px: 3 }}
        >
          {editProduct ? 'Save Changes' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
