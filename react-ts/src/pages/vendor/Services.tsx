import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  TextField,
  Switch,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  active: boolean;
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Essential Package',
    description: 'Perfect for intimate ceremonies',
    price: 150000,
    duration: '4 hours',
    features: ['4 hours coverage', '100 edited photos', 'Online gallery', '1 photographer'],
    popular: false,
    active: true,
  },
  {
    id: '2',
    name: 'Premium Package',
    description: 'Our most popular package',
    price: 350000,
    duration: '8 hours',
    features: ['8 hours coverage', '300 edited photos', 'Online gallery', '2 photographers', 'Engagement shoot', 'Photo album'],
    popular: true,
    active: true,
  },
  {
    id: '3',
    name: 'Luxury Package',
    description: 'The complete experience',
    price: 650000,
    duration: 'Full day',
    features: ['Full day coverage', 'Unlimited photos', 'Online gallery', '3 photographers', 'Engagement shoot', 'Premium album', 'Drone footage', 'Same-day edits'],
    popular: false,
    active: true,
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const handleToggleActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 24, color: '#002528' }}>
            Services & Pricing
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#666', mt: 0.5 }}>
            Manage your service packages and pricing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingService(null); setDialogOpen(true); }}
          sx={{ bgcolor: '#00838F', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: '#006b75' } }}
        >
          Add Service
        </Button>
      </Box>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid size={{ xs: 12, md: 4 }} key={service.id}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: service.popular ? '2px solid #00838F' : '1px solid #CCFDF2',
                boxShadow: 'none',
                position: 'relative',
                opacity: service.active ? 1 : 0.6,
              }}
            >
              {service.popular && (
                <Chip
                  icon={<StarIcon sx={{ fontSize: 14 }} />}
                  label="Most Popular"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#00838F',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#002528' }}>
                    {service.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#666' }}>
                    {service.description}
                  </Typography>
                </Box>
                <Switch
                  checked={service.active}
                  onChange={() => handleToggleActive(service.id)}
                  size="small"
                  sx={{ '& .Mui-checked': { color: '#00838F' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#00838F' } }}
                />
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: 32, color: '#00838F', mb: 0.5 }}>
                {formatPrice(service.price)}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#666', mb: 2 }}>
                {service.duration} coverage
              </Typography>

              <Box sx={{ mb: 3 }}>
                {service.features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
                    <Typography sx={{ fontSize: 14, color: '#666' }}>{feature}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(service)}
                  sx={{ borderColor: '#00838F', color: '#00838F', textTransform: 'none' }}
                >
                  Edit
                </Button>
                <IconButton onClick={() => handleDelete(service.id)} sx={{ color: '#f44336' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Service Name" fullWidth defaultValue={editingService?.name} />
            <TextField label="Description" fullWidth multiline rows={2} defaultValue={editingService?.description} />
            <TextField label="Price (₦)" type="number" fullWidth defaultValue={editingService?.price} />
            <TextField label="Duration" fullWidth defaultValue={editingService?.duration} />
            <TextField label="Features (comma separated)" fullWidth multiline rows={3} defaultValue={editingService?.features.join(', ')} />
            <FormControlLabel control={<Switch defaultChecked={editingService?.popular} />} label="Mark as Popular" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#00838F' }} onClick={() => setDialogOpen(false)}>
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
