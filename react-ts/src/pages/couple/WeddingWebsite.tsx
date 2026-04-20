import { useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { ExpandMore, Language, Publish } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'

interface WebsiteDraft {
  title: string
  subtitle: string
  story: string
  isPublished: boolean
  requiresPassword: boolean
  password: string
}

const key = 'itw_website'

const readDraft = (): WebsiteDraft => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return {
        title: 'Our Wedding Day',
        subtitle: 'Join us for the celebration',
        story: '',
        isPublished: false,
        requiresPassword: false,
        password: '',
      }
    }
    const parsed = JSON.parse(raw) as WebsiteDraft
    return {
      title: parsed.title || 'Our Wedding Day',
      subtitle: parsed.subtitle || 'Join us for the celebration',
      story: parsed.story || '',
      isPublished: Boolean(parsed.isPublished),
      requiresPassword: Boolean(parsed.requiresPassword),
      password: parsed.password || '',
    }
  } catch {
    return {
      title: 'Our Wedding Day',
      subtitle: 'Join us for the celebration',
      story: '',
      isPublished: false,
      requiresPassword: false,
      password: '',
    }
  }
}

export default function WeddingWebsite() {
  const [draft, setDraft] = useState<WebsiteDraft>(readDraft)

  const update = (next: WebsiteDraft) => {
    setDraft(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  const previewUrl = `itheewed.com/${draft.title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <CouplePageShell
      title="Wedding Website"
      subtitle="Publish a beautiful guest-facing page with strong privacy controls and clear content flow."
      badge={draft.isPublished ? 'Published' : 'Draft'}
      actions={
        <Button
          variant="contained"
          startIcon={<Publish />}
          onClick={() => update({ ...draft, isPublished: true })}
          sx={{ bgcolor: '#EB1948', textTransform: 'none', fontWeight: 700, borderRadius: 6, '&:hover': { bgcolor: '#C41438' } }}
        >
          Publish
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 1fr' }, gap: 2.5 }}>
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2.2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A', mb: 1.2 }}>Website Content</Typography>
          <Stack spacing={1.8}>
            <TextField
              label="Page title"
              value={draft.title}
              onChange={(event) => update({ ...draft, title: event.target.value })}
              fullWidth
            />
            <TextField
              label="Subtitle"
              value={draft.subtitle}
              onChange={(event) => update({ ...draft, subtitle: event.target.value })}
              fullWidth
            />
            <TextField
              label="Your Story"
              value={draft.story}
              onChange={(event) => update({ ...draft, story: event.target.value })}
              fullWidth
              multiline
              rows={4}
            />

            <Accordion disableGutters elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 700 }}>Privacy Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 14, color: '#334155' }}>Require password</Typography>
                    <Switch
                      checked={draft.requiresPassword}
                      onChange={(event) => update({ ...draft, requiresPassword: event.target.checked })}
                    />
                  </Stack>
                  {draft.requiresPassword && (
                    <TextField
                      label="Guest password"
                      value={draft.password}
                      onChange={(event) => update({ ...draft, password: event.target.value })}
                      size="small"
                    />
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2.2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
            <Language sx={{ color: '#0F766E' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Live Preview</Typography>
          </Stack>

          <Box sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2, bgcolor: '#FCFDFE' }}>
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B2D31' }}>{draft.title || 'Untitled wedding page'}</Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B', mt: 0.5 }}>{draft.subtitle}</Typography>
            <Typography sx={{ fontSize: 13, color: '#475569', mt: 2 }}>{draft.story || 'Your story will appear here in a refined narrative layout.'}</Typography>
          </Box>

          <Stack spacing={1} sx={{ mt: 1.8 }}>
            <Chip label={draft.isPublished ? 'Publicly accessible' : 'Not yet published'} sx={{ alignSelf: 'flex-start', bgcolor: draft.isPublished ? '#DCFCE7' : '#FEF3C7', color: draft.isPublished ? '#166534' : '#92400E', fontWeight: 700 }} />
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>{previewUrl}</Typography>
          </Stack>
        </Paper>
      </Box>
    </CouplePageShell>
  )
}
