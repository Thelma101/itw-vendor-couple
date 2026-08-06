import { useState, useMemo, useCallback } from 'react'
import {
  Box, Typography, Button, Chip, Slider, TextField, Card, Rating, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Fade,
  FormControlLabel, Checkbox,
} from '@mui/material'
import {
  Close, LocationOn,
  CheckCircle, AutoAwesome, FilterList, ArrowForward, Lock, Science,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Nav from '@/couple/components/Nav'
import Footer from '@/marketing/components/Footer'
import { mockVendors, getAllCategories, type Vendor } from '@/shared/data/mockVendors'

/* ═══════ TOKENS ═══════ */
const T = {
  bg: '#FFF6F9', primary: '#00838F', primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948', success: '#008F53',
  text: '#2d2d2d', textSub: '#aaaaaa', font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
}

/* ═══════ TYPES ═══════ */
interface CouplePreferences {
  weddingStyle: string[]
  budgetRange: [number, number]
  guestCount: number
  priorityFactors: string[]
  preferredLocation: string
  weddingDate: string
}

interface VendorWithScore extends Vendor {
  chemistryScore: number
  scoreBreakdown: { factor: string; score: number; weight: number }[]
  matchReasons: string[]
  badge?: 'Perfect Match' | 'Great Fit' | 'Good Option'
}

/* ═══════ SCORING ENGINE ═══════ */
const STYLE_KEYWORDS: Record<string, string[]> = {
  'Elegant': ['elegant', 'luxury', 'royal', 'dreams', 'elite'],
  'Rustic': ['garden', 'bloom', 'natural', 'green'],
  'Modern': ['studio', 'pro', 'modern', 'lens'],
  'Traditional': ['classic', 'golden', 'divine', 'sweet'],
  'Boho': ['garden', 'bloom', 'blossom', 'petal'],
  'Glamorous': ['glamour', 'designer', 'luxury', 'royal'],
  'Minimalist': ['minimal', 'simple', 'clean', 'modern'],
  'Beach': ['beach', 'coastal', 'tropical', 'island', 'seaside'],
}

const PRIORITY_OPTIONS = [
  { id: 'rating', label: 'High Ratings' },
  { id: 'value', label: 'Best Value' },
  { id: 'experience', label: 'Experience' },
  { id: 'responsiveness', label: 'Quick Response' },
  { id: 'reviews', label: 'Most Reviews' },
]

const STYLE_OPTIONS = ['Elegant', 'Modern', 'Rustic', 'Traditional', 'Boho', 'Glamorous', 'Minimalist', 'Beach']

const parsePrice = (price: string): number => {
  return parseInt(price.replace(/[^0-9]/g, '')) || 0
}

function calculateChemistryScore(vendor: Vendor, prefs: CouplePreferences): VendorWithScore {
  const breakdown: { factor: string; score: number; weight: number }[] = []
  const reasons: string[] = []

  // 1. Budget fit (25% weight)
  const price = parsePrice(vendor.price)
  const [minB, maxB] = prefs.budgetRange
  let budgetScore = 0
  if (price >= minB && price <= maxB) { budgetScore = 100; reasons.push('Within your budget range') }
  else if (price < minB) { budgetScore = 70; reasons.push('Under budget — great savings potential') }
  else {
    const overBy = ((price - maxB) / maxB) * 100
    budgetScore = Math.max(0, 80 - overBy)
    if (budgetScore > 40) reasons.push('Slightly above budget but high quality')
  }
  breakdown.push({ factor: 'Budget Fit', score: budgetScore, weight: 25 })

  // 2. Rating quality (25% weight)
  const ratingScore = (vendor.rating / 5) * 100
  if (vendor.rating >= 4.8) reasons.push('Exceptional ratings from couples')
  else if (vendor.rating >= 4.5) reasons.push('Consistently high-rated')
  breakdown.push({ factor: 'Quality Rating', score: ratingScore, weight: 25 })

  // 3. Style match (20% weight)
  let styleScore = 50 // default
  for (const style of prefs.weddingStyle) {
    const keywords = STYLE_KEYWORDS[style] || []
    if (keywords.some(kw => vendor.name.toLowerCase().includes(kw))) {
      styleScore = 90
      reasons.push(`Matches your ${style} style`)
      break
    }
  }
  breakdown.push({ factor: 'Style Match', score: styleScore, weight: 20 })

  // 4. Location convenience (15% weight)
  let locationScore = 60
  if (prefs.preferredLocation && vendor.location.toLowerCase().includes(prefs.preferredLocation.toLowerCase())) {
    locationScore = 95
    reasons.push('Located in your preferred area')
  } else if (vendor.location.includes('Lagos')) {
    locationScore = 70
  }
  breakdown.push({ factor: 'Location', score: locationScore, weight: 15 })

  // 5. Social proof / reviews (15% weight)
  const reviewScore = Math.min(100, (vendor.reviewCount / 200) * 100)
  if (vendor.reviewCount > 150) reasons.push('Highly reviewed by many couples')
  breakdown.push({ factor: 'Social Proof', score: reviewScore, weight: 15 })

  // Weighted total
  const total = Math.round(breakdown.reduce((sum, b) => sum + (b.score * b.weight / 100), 0))

  // Badge
  let badge: VendorWithScore['badge']
  if (total >= 85) badge = 'Perfect Match'
  else if (total >= 70) badge = 'Great Fit'
  else if (total >= 55) badge = 'Good Option'

  return { ...vendor, chemistryScore: total, scoreBreakdown: breakdown, matchReasons: reasons.slice(0, 3), badge }
}

/* ═══════ SCORE COLOUR ═══════ */
const getScoreColor = (score: number) => {
  if (score >= 85) return '#008F53'
  if (score >= 70) return T.primary
  if (score >= 55) return '#f59e0b'
  return T.textSub
}

const getBadgeColor = (badge?: string) => {
  if (badge === 'Perfect Match') return { bg: 'rgba(0,143,83,0.12)', color: '#008F53' }
  if (badge === 'Great Fit') return { bg: 'rgba(0,131,143,0.12)', color: T.primary }
  return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' }
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function VendorMatching() {
  const navigate = useNavigate()
  const categories = getAllCategories()

  /* ── Preferences state ── */
  const [prefs, setPrefs] = useState<CouplePreferences>({
    weddingStyle: ['Elegant'],
    budgetRange: [100000, 500000],
    guestCount: 200,
    priorityFactors: ['rating', 'value'],
    preferredLocation: 'Lagos',
    weddingDate: '2026-06-15',
  })

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showPrefsPanel, setShowPrefsPanel] = useState(true)
  const [detailVendor, setDetailVendor] = useState<VendorWithScore | null>(null)

  /* ── Compute scores ── */
  const scoredVendors = useMemo(() => {
    const vendors = selectedCategory === 'All' ? mockVendors : mockVendors.filter(v => v.category === selectedCategory)
    const scored = vendors.map(v => calculateChemistryScore(v, prefs))
    return scored.sort((a, b) => b.chemistryScore - a.chemistryScore)
  }, [prefs, selectedCategory])

  const updatePrefs = useCallback((updates: Partial<CouplePreferences>) => {
    setPrefs(prev => ({ ...prev, ...updates }))
  }, [])

  const toggleStyle = (style: string) => {
    setPrefs(prev => ({
      ...prev,
      weddingStyle: prev.weddingStyle.includes(style)
        ? prev.weddingStyle.filter(s => s !== style)
        : [...prev.weddingStyle, style],
    }))
  }

  const togglePriority = (id: string) => {
    setPrefs(prev => ({
      ...prev,
      priorityFactors: prev.priorityFactors.includes(id)
        ? prev.priorityFactors.filter(p => p !== id)
        : [...prev.priorityFactors, id],
    }))
  }

  const formatBudget = (v: number) => `₦${(v / 1000).toFixed(0)}K`

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: T.bg, display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <Box sx={{ width: '100%', height: 3, bgcolor: T.primary }} />

      {/* HEADER */}
      <Box sx={{ px: { xs: 3, md: '120px' }, pt: { xs: 3, md: '32px' }, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 4, height: 48, background: T.accentGrad, borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: { xs: 24, md: 28 }, color: T.primaryBlack }}>Smart Vendor Match</Typography>
              <Chip icon={<Science sx={{ fontSize: '16px !important' }} />} label="Chemistry Score" size="small" sx={{ bgcolor: 'rgba(0,131,143,0.1)', color: T.primary, fontFamily: T.font, fontWeight: 700, fontSize: 11 }} />
            </Box>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>AI-powered vendor matching based on your wedding preferences</Typography>
          </Box>
          <Button onClick={() => setShowPrefsPanel(!showPrefsPanel)} startIcon={<FilterList />}
            sx={{ bgcolor: '#fff', color: T.primary, fontFamily: T.font, fontWeight: 600, fontSize: 14, textTransform: 'none', border: T.border, borderRadius: 0, px: 2, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>
            {showPrefsPanel ? 'Hide Preferences' : 'Edit Preferences'}
          </Button>
        </Box>
      </Box>

      {/* MAIN LAYOUT */}
      <Box sx={{ flex: 1, px: { xs: 2, md: '120px' }, pb: 8, display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

        {/* PREFERENCES PANEL */}
        {showPrefsPanel && (
          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Wedding Style */}
            <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 2 }}>Wedding Style</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {STYLE_OPTIONS.map(s => (
                  <Chip key={s} label={s} onClick={() => toggleStyle(s)}
                    sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 12, bgcolor: prefs.weddingStyle.includes(s) ? T.primary : '#fff', color: prefs.weddingStyle.includes(s) ? '#fff' : T.primaryBlack, border: `1px solid ${prefs.weddingStyle.includes(s) ? T.primary : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer', '&:hover': { bgcolor: prefs.weddingStyle.includes(s) ? '#006670' : 'rgba(0,131,143,0.04)' } }} />
                ))}
              </Box>
            </Box>

            {/* Budget Range */}
            <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1 }}>Budget Range</Typography>
              <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.primary, fontWeight: 700, mb: 2 }}>
                {formatBudget(prefs.budgetRange[0])} — {formatBudget(prefs.budgetRange[1])}
              </Typography>
              <Slider
                value={prefs.budgetRange} onChange={(_, v) => updatePrefs({ budgetRange: v as [number, number] })}
                min={50000} max={2000000} step={25000}
                valueLabelDisplay="auto" valueLabelFormat={formatBudget}
                sx={{ color: T.primary, '& .MuiSlider-thumb': { width: 20, height: 20 } }}
              />
            </Box>

            {/* Guest Count */}
            <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Guest Count</Typography>
              <TextField type="number" fullWidth size="small" value={prefs.guestCount}
                onChange={e => updatePrefs({ guestCount: parseInt(e.target.value) || 0 })}
                sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>

            {/* Priority Factors */}
            <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 2 }}>Priority Factors</Typography>
              {PRIORITY_OPTIONS.map(p => (
                <FormControlLabel key={p.id} label={p.label}
                  control={<Checkbox checked={prefs.priorityFactors.includes(p.id)} onChange={() => togglePriority(p.id)} size="small" sx={{ color: T.primary, '&.Mui-checked': { color: T.primary } }} />}
                  sx={{ display: 'flex', mb: 0.5, '& .MuiTypography-root': { fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.primaryBlack } }} />
              ))}
            </Box>

            {/* Location */}
            <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5 }}>Preferred Location</Typography>
              <TextField fullWidth size="small" placeholder="e.g. Lekki, Lagos" value={prefs.preferredLocation}
                onChange={e => updatePrefs({ preferredLocation: e.target.value })}
                sx={{ '& .MuiInputBase-root': { fontFamily: T.font } }} />
            </Box>

            {/* Premium upsell */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid rgba(235,25,72,0.2)', p: 2.5, background: 'linear-gradient(135deg, #fff5f7 0%, #fff 100%)' }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.primaryBlack, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome sx={{ color: T.accent, fontSize: 18 }} /> Premium Matching
              </Typography>
              <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub, mb: 1.5 }}>
                Get AI-powered personality matching, vendor response-time data, and detailed compatibility reports.
              </Typography>
              <Button fullWidth variant="contained" startIcon={<Lock sx={{ fontSize: '14px !important' }} />}
                sx={{ bgcolor: T.accent, '&:hover': { bgcolor: '#c01438' }, textTransform: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 13, borderRadius: 0 }}>
                Upgrade to Premium
              </Button>
            </Box>
          </Box>
        )}

        {/* RESULTS */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Category filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip label="All" onClick={() => setSelectedCategory('All')}
              sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, bgcolor: selectedCategory === 'All' ? T.primary : '#fff', color: selectedCategory === 'All' ? '#fff' : T.primaryBlack, border: `1px solid ${selectedCategory === 'All' ? T.primary : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer' }} />
            {categories.map(cat => (
              <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)}
                sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, bgcolor: selectedCategory === cat ? T.primary : '#fff', color: selectedCategory === cat ? '#fff' : T.primaryBlack, border: `1px solid ${selectedCategory === cat ? T.primary : 'rgba(0,131,143,0.2)'}`, cursor: 'pointer' }} />
            ))}
          </Box>

          <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>
            {scoredVendors.length} vendors ranked by Chemistry Score
          </Typography>

          {/* Vendor Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {scoredVendors.map((vendor, idx) => (
              <Fade in key={vendor.id} timeout={200 + idx * 50}>
                <Card onClick={() => setDetailVendor(vendor)} sx={{ display: 'flex', height: { xs: 'auto', md: 160 }, cursor: 'pointer', border: idx === 0 ? `2px solid ${T.success}` : T.border, overflow: 'hidden', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,37,40,0.08)' } }}>
                  {/* Image */}
                  <Box sx={{ width: { xs: 120, md: 200 }, flexShrink: 0, position: 'relative' }}>
                    <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {vendor.badge && (
                      <Chip label={vendor.badge} size="small" sx={{ position: 'absolute', top: 8, left: 8, fontFamily: T.font, fontWeight: 700, fontSize: 10, ...getBadgeColor(vendor.badge) }} />
                    )}
                    {idx === 0 && (
                      <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: T.success, px: 1, py: 0.5 }}>
                        <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 9, color: '#fff' }}>#1 MATCH</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primaryBlack }}>{vendor.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                            <Chip label={vendor.category} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 600, fontFamily: T.font, bgcolor: 'rgba(0,131,143,0.08)', color: T.primary }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <LocationOn sx={{ fontSize: 14, color: T.textSub }} />
                              <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub }}>{vendor.location}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        {/* Chemistry Score Circle */}
                        <Box sx={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
                          <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${getScoreColor(vendor.chemistryScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Typography sx={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: getScoreColor(vendor.chemistryScore), lineHeight: 1 }}>{vendor.chemistryScore}</Typography>
                            <Typography sx={{ fontFamily: T.font, fontSize: 7, fontWeight: 700, color: T.textSub, lineHeight: 1 }}>SCORE</Typography>
                          </Box>
                        </Box>
                      </Box>
                      {/* Match reasons */}
                      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mt: 1 }}>
                        {vendor.matchReasons.map((r, i) => (
                          <Typography key={i} sx={{ fontFamily: T.font, fontSize: 11, color: T.success, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <CheckCircle sx={{ fontSize: 12 }} /> {r}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={vendor.rating} precision={0.1} readOnly size="small" sx={{ color: '#f59e0b' }} />
                        <Typography sx={{ fontFamily: T.font, fontSize: 12, color: T.textSub }}>{vendor.rating} ({vendor.reviewCount})</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: T.primary }}>{vendor.price}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>

      {/* DETAIL DIALOG */}
      <Dialog open={detailVendor !== null} onClose={() => setDetailVendor(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        {detailVendor && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primaryBlack }}>{detailVendor.name}</Typography>
                <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.textSub }}>{detailVendor.category} · {detailVendor.location}</Typography>
              </Box>
              <IconButton onClick={() => setDetailVendor(null)} size="small"><Close /></IconButton>
            </DialogTitle>
            <DialogContent>
              {/* Score hero */}
              <Box sx={{ textAlign: 'center', py: 3, mb: 3, borderRadius: '8px', bgcolor: 'rgba(0,131,143,0.03)', border: '1px solid rgba(0,131,143,0.1)' }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', border: `5px solid ${getScoreColor(detailVendor.chemistryScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mx: 'auto', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: T.font, fontWeight: 800, fontSize: 28, color: getScoreColor(detailVendor.chemistryScore), lineHeight: 1 }}>{detailVendor.chemistryScore}</Typography>
                </Box>
                {detailVendor.badge && <Chip label={detailVendor.badge} sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, ...getBadgeColor(detailVendor.badge) }} />}
                <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, mt: 1 }}>Chemistry Score</Typography>
              </Box>

              {/* Score breakdown */}
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 2 }}>Score Breakdown</Typography>
              {detailVendor.scoreBreakdown.map((b, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.primaryBlack }}>{b.factor}</Typography>
                    <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: getScoreColor(b.score) }}>{Math.round(b.score)}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={b.score} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,131,143,0.08)', '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(b.score), borderRadius: 4 } }} />
                  <Typography sx={{ fontFamily: T.font, fontSize: 11, color: T.textSub, mt: 0.3 }}>Weight: {b.weight}%</Typography>
                </Box>
              ))}

              {/* Match reasons */}
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1.5, mt: 3 }}>Why You Match</Typography>
              {detailVendor.matchReasons.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: T.success }} />
                  <Typography sx={{ fontFamily: T.font, fontSize: 14, color: T.text }}>{r}</Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setDetailVendor(null)} sx={{ textTransform: 'none', fontFamily: T.font, fontWeight: 600, color: '#666' }}>Close</Button>
              <Button variant="contained" endIcon={<ArrowForward />} onClick={() => { navigate(`/couple/vendor/${detailVendor.id}`); setDetailVendor(null) }}
                sx={{ bgcolor: T.primary, '&:hover': { bgcolor: '#006670' }, textTransform: 'none', fontWeight: 700, fontFamily: T.font, borderRadius: 0 }}>
                View Full Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </Box>
  )
}
