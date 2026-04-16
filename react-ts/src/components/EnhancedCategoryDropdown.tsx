/**
 * EnhancedCategoryDropdown — Redesigned category selector for the homepage hero.
 *
 * Key improvements over the plain MUI <Select>:
 *  • Built-in search / filter input
 *  • Category grouping (Essential, Creative, Beauty, etc.)
 *  • Vendor count badges per category
 *  • Graceful handling of incomplete / empty data
 *  • Keyboard navigation support
 *  • Responsive & accessible
 *
 * Usage:
 *   <EnhancedCategoryDropdown
 *     value={category}
 *     onChange={setCategory}
 *   />
 */

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Popper,
  ClickAwayListener,
  Chip,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  KeyboardArrowDown,
  LocationCity,
  CameraAlt,
  LocalFlorist,
  Cake,
  Restaurant,
  Checkroom,
  MusicNote,
  Face,
  Palette,
  DirectionsCar,
  EventNote,
  Category as CategoryIcon,
} from '@mui/icons-material';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CategoryOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  vendorCount?: number;
  group?: string;
}

export interface CategoryGroup {
  label: string;
  categories: CategoryOption[];
}

export interface EnhancedCategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  /** Override the default built-in categories */
  categories?: CategoryOption[];
  /** Show a loading state */
  loading?: boolean;
  /** Placeholder when no selection */
  placeholder?: string;
  sx?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Default categories with icon mapping & grouping                     */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ReactNode> = {
  'Reception Venue': <LocationCity sx={{ fontSize: 18, color: '#00838F' }} />,
  'Venue': <LocationCity sx={{ fontSize: 18, color: '#00838F' }} />,
  'Photographer': <CameraAlt sx={{ fontSize: 18, color: '#00838F' }} />,
  'Photography': <CameraAlt sx={{ fontSize: 18, color: '#00838F' }} />,
  'Florist': <LocalFlorist sx={{ fontSize: 18, color: '#00838F' }} />,
  'Cake & Desserts': <Cake sx={{ fontSize: 18, color: '#00838F' }} />,
  'Catering': <Restaurant sx={{ fontSize: 18, color: '#00838F' }} />,
  'Dress & Apparel': <Checkroom sx={{ fontSize: 18, color: '#00838F' }} />,
  'Music': <MusicNote sx={{ fontSize: 18, color: '#00838F' }} />,
  'Music & Entertainment': <MusicNote sx={{ fontSize: 18, color: '#00838F' }} />,
  'Makeup Artist': <Face sx={{ fontSize: 18, color: '#00838F' }} />,
  'Decor & Rentals': <Palette sx={{ fontSize: 18, color: '#00838F' }} />,
  'Transportation': <DirectionsCar sx={{ fontSize: 18, color: '#00838F' }} />,
  'Wedding Planner': <EventNote sx={{ fontSize: 18, color: '#00838F' }} />,
};

const DEFAULT_CATEGORIES: CategoryOption[] = [
  // Essential Services
  { value: 'Reception Venue', label: 'Reception Venue', group: 'Essential Services', vendorCount: 5 },
  { value: 'Catering', label: 'Catering', group: 'Essential Services', vendorCount: 2 },
  { value: 'Wedding Planner', label: 'Wedding Planner', group: 'Essential Services', vendorCount: 1 },
  // Creative & Visual
  { value: 'Photographer', label: 'Photographer', group: 'Creative & Visual', vendorCount: 3 },
  { value: 'Florist', label: 'Florist', group: 'Creative & Visual', vendorCount: 2 },
  { value: 'Decor & Rentals', label: 'Decor & Rentals', group: 'Creative & Visual', vendorCount: 1 },
  // Beauty & Fashion
  { value: 'Makeup Artist', label: 'Makeup Artist', group: 'Beauty & Fashion', vendorCount: 1 },
  { value: 'Dress & Apparel', label: 'Dress & Apparel', group: 'Beauty & Fashion', vendorCount: 2 },
  // Entertainment & Treats
  { value: 'Music', label: 'Music & Entertainment', group: 'Entertainment & Treats', vendorCount: 1 },
  { value: 'Cake & Desserts', label: 'Cake & Desserts', group: 'Entertainment & Treats', vendorCount: 2 },
  // Logistics
  { value: 'Transportation', label: 'Transportation', group: 'Logistics', vendorCount: 1 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function groupCategories(cats: CategoryOption[]): CategoryGroup[] {
  const map = new Map<string, CategoryOption[]>();
  for (const c of cats) {
    const g = c.group || 'Other';
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(c);
  }
  return Array.from(map.entries()).map(([label, categories]) => ({ label, categories }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const EnhancedCategoryDropdown: React.FC<EnhancedCategoryDropdownProps> = ({
  value,
  onChange,
  categories = DEFAULT_CATEGORIES,
  loading = false,
  placeholder = 'Select a category',
  sx = {},
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Attach icons
  const enriched = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        icon: c.icon || ICON_MAP[c.value] || ICON_MAP[c.label] || <CategoryIcon sx={{ fontSize: 18, color: '#00838F' }} />,
      })),
    [categories],
  );

  // Filtered list
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return enriched;
    const q = searchTerm.toLowerCase();
    return enriched.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q) ||
        (c.group && c.group.toLowerCase().includes(q)),
    );
  }, [enriched, searchTerm]);

  // Grouped
  const groups = useMemo(() => groupCategories(filtered), [filtered]);

  // Flat list for keyboard nav
  const flatFiltered = useMemo(() => groups.flatMap((g) => g.categories), [groups]);

  // Focus search input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setHighlightIndex(-1);
      setSearchTerm('');
    }
  }, [open]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
    },
    [onChange],
  );

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < flatFiltered.length) {
          handleSelect(flatFiltered[highlightIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      items[highlightIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  const selectedLabel = enriched.find((c) => c.value === value)?.label || value || placeholder;
  const selectedIcon = enriched.find((c) => c.value === value)?.icon;

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: '100%', ...sx }}>
        {/* Trigger */}
        <Box
          ref={anchorRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          tabIndex={0}
          onClick={() => setOpen((p) => !p)}
          onKeyDown={handleKeyDown}
          sx={{
            bgcolor: 'white',
            width: '100%',
            height: 51,
            border: '0.25px solid #00838F',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            gap: 1,
            cursor: 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': {
              borderColor: '#00838F',
              boxShadow: '0 0 0 2px rgba(0,131,143,0.12)',
            },
            ...(open && {
              borderColor: '#00838F',
              boxShadow: '0 0 0 2px rgba(0,131,143,0.18)',
            }),
          }}
        >
          {selectedIcon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{selectedIcon}</Box>}
          <Typography
            sx={{
              flex: 1,
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: value ? '#002528' : '#8a8a8a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedLabel}
          </Typography>
          <KeyboardArrowDown
            sx={{
              color: '#00838F',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
            }}
          />
        </Box>

        {/* Dropdown Popover */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth || 'auto' }}
          modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={8}
                sx={{
                  maxHeight: 380,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 1,
                  border: '1px solid rgba(0,131,143,0.15)',
                }}
              >
                {/* Search input */}
                <Box sx={{ p: 1.5, borderBottom: '1px solid #eee' }}>
                  <TextField
                    inputRef={searchInputRef}
                    size="small"
                    fullWidth
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setHighlightIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ fontSize: 18, color: '#8a8a8a' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: 14,
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Options list */}
                <Box ref={listRef} sx={{ overflowY: 'auto', maxHeight: 310, py: 0.5 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={28} sx={{ color: '#00838F' }} />
                    </Box>
                  ) : flatFiltered.length === 0 ? (
                    <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: 14,
                          color: '#8a8a8a',
                        }}
                      >
                        No categories match "{searchTerm}"
                      </Typography>
                    </Box>
                  ) : (
                    groups.map((group) => (
                      <Box key={group.label}>
                        {/* Group header */}
                        <Typography
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#8a8a8a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            px: 2,
                            pt: 1.5,
                            pb: 0.5,
                          }}
                        >
                          {group.label}
                        </Typography>

                        {group.categories.map((cat) => {
                          const idx = flatFiltered.indexOf(cat);
                          const isHighlighted = idx === highlightIndex;
                          const isSelected = cat.value === value;

                          return (
                            <Box
                              key={cat.value}
                              data-option
                              onClick={() => handleSelect(cat.value)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1,
                                cursor: 'pointer',
                                bgcolor: isSelected
                                  ? 'rgba(0,131,143,0.08)'
                                  : isHighlighted
                                    ? 'rgba(0,131,143,0.04)'
                                    : 'transparent',
                                transition: 'background-color 0.15s',
                                '&:hover': {
                                  bgcolor: 'rgba(0,131,143,0.08)',
                                },
                              }}
                            >
                              {cat.icon}
                              <Typography
                                sx={{
                                  flex: 1,
                                  fontFamily: "'Open Sans', sans-serif",
                                  fontSize: 14,
                                  fontWeight: isSelected ? 700 : 400,
                                  color: isSelected ? '#00838F' : '#002528',
                                }}
                              >
                                {cat.label}
                              </Typography>
                              {typeof cat.vendorCount === 'number' && (
                                <Chip
                                  label={cat.vendorCount}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    bgcolor: isSelected ? '#00838F' : '#e0f7fa',
                                    color: isSelected ? 'white' : '#00838F',
                                  }}
                                />
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default EnhancedCategoryDropdown;
