import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AutoAwesome, Send, SmartToy } from '@mui/icons-material'
import CouplePageShell from '@/components/couple/CouplePageShell'
import { AskWedEngine } from '@/lib/askwed-engine'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export default function AskWed() {
  const engine = useMemo(() => new AskWedEngine(), [])

  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Welcome to AskWed. Ask about budget, vendors, timeline, decor, guest planning, or traditions.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const ask = (prompt: string) => {
    if (!prompt.trim() || loading) return

    const user = { id: `u-${Date.now()}`, role: 'user' as const, text: prompt.trim() }
    setMessages((prev) => [...prev, user])
    setInput('')
    setLoading(true)

    window.setTimeout(() => {
      const result = engine.processQuery(prompt)
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: result.text }])
      setLoading(false)
    }, 350)
  }

  return (
    <CouplePageShell
      title="AskWed"
      subtitle="An intelligent planning assistant with focused answers and clear next-step guidance."
      badge="AI Enabled"
      actions={<Chip icon={<AutoAwesome />} label="Smart Replies" sx={{ bgcolor: '#E6F7F8', color: '#0F766E', fontWeight: 700 }} />}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.2fr 1fr' }, gap: 2.5 }}>
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2.2, minHeight: 520, display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto', pr: 0.8 }}>
            {messages.map((message) => (
              <Stack key={message.id} direction="row" spacing={1.1} justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                {message.role === 'assistant' && <Avatar sx={{ bgcolor: '#00838F', width: 32, height: 32 }}><SmartToy sx={{ fontSize: 18 }} /></Avatar>}
                <Box sx={{ maxWidth: '85%', p: 1.6, borderRadius: 2.4, bgcolor: message.role === 'user' ? '#00838F' : '#F8FAFC', color: message.role === 'user' ? '#fff' : '#334155', border: message.role === 'assistant' ? '1px solid #E2E8F0' : 'none' }}>
                  <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{message.text}</Typography>
                </Box>
              </Stack>
            ))}

            {loading && (
              <Stack direction="row" spacing={1.1} alignItems="center">
                <Avatar sx={{ bgcolor: '#00838F', width: 32, height: 32 }}><SmartToy sx={{ fontSize: 18 }} /></Avatar>
                <Paper elevation={0} sx={{ p: 1.2, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={14} sx={{ color: '#00838F' }} />
                  <Typography sx={{ fontSize: 13, color: '#64748B' }}>Generating response...</Typography>
                </Paper>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1.2} sx={{ pt: 1.5 }}>
            <TextField
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about wedding planning..."
              fullWidth
              multiline
              maxRows={3}
              inputProps={{ 'aria-label': 'AskWed input' }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  ask(input)
                }
              }}
            />
            <Button onClick={() => ask(input)} variant="contained" sx={{ minWidth: 46, bgcolor: '#00838F', borderRadius: 2.5, '&:hover': { bgcolor: '#006670' } }}>
              <Send sx={{ fontSize: 18 }} />
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, p: 2.2 }}>
          <Typography sx={{ fontWeight: 800, color: '#0F172A', mb: 1.4 }}>Prompt Starters</Typography>
          <Stack spacing={0.8}>
            {[
              'How should I split my budget by category?',
              'What should my day-of timeline include?',
              'How can I compare vendors efficiently?',
              'How many guests can fit my venue?',
              'What questions should I ask photographers?',
            ].map((starter) => (
              <Button
                key={starter}
                onClick={() => ask(starter)}
                variant="outlined"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', borderRadius: 2.2, borderColor: '#D1E8EB', color: '#334155', fontWeight: 700 }}
              >
                {starter}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>
    </CouplePageShell>
  )
}
