import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Box, Typography, TextField, IconButton, Avatar, Chip, Button, Fade, CircularProgress,
  Tooltip, LinearProgress,
} from '@mui/material'
import {
  Send, SmartToy, Person, Lightbulb, AttachMoney, Restaurant, CameraAlt, MusicNote,
  Favorite, Event, LocalFlorist, Celebration, AutoAwesome, Lock,
  ChecklistRtl, Checkroom, TheaterComedy,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { AskWedEngine, type EngineResponse } from '@/lib/askwed-engine'

/* ═══════ TOKENS ═══════ */
const T = {
  bg: '#FFFFFF', primary: '#00838F', primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948', success: '#008F53',
  text: '#2d2d2d', textSub: '#aaaaaa', font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
}

/* ═══════ TYPES ═══════ */
interface Message { id: string; role: 'user' | 'assistant'; text: string; timestamp: Date; meta?: EngineResponse }
interface SuggestedPrompt { icon: React.ElementType; label: string; prompt: string; premium?: boolean }

/* ═══════ SUGGESTED PROMPTS ═══════ */
const SUGGESTED: SuggestedPrompt[] = [
  { icon: AttachMoney, label: 'Budget allocation', prompt: 'How should I allocate my wedding budget?' },
  { icon: Event,       label: 'Day-of timeline', prompt: 'What does a typical wedding day timeline look like?' },
  { icon: Restaurant,  label: 'Catering tips', prompt: 'What should I consider for wedding catering?' },
  { icon: CameraAlt,   label: 'Photography guide', prompt: 'Tips for choosing a wedding photographer?' },
  { icon: MusicNote,   label: 'Music & entertainment', prompt: 'How do I plan wedding music and entertainment?' },
  { icon: LocalFlorist, label: 'Décor & styling', prompt: 'What are current wedding décor trends?' },
  { icon: Favorite,    label: 'Guest management', prompt: 'How do I manage my wedding guest list?' },
  { icon: Celebration, label: 'Venue selection', prompt: 'What should I look for when choosing a venue?' },
  { icon: Checkroom,   label: 'Wedding attire', prompt: 'What should I know about choosing wedding attire?' },
  { icon: ChecklistRtl, label: 'Planning guide', prompt: 'Where do I start with wedding planning?' },
  { icon: TheaterComedy, label: 'Cultural traditions', prompt: 'Tell me about Nigerian wedding traditions and customs' },
]

const PREMIUM_PROMPTS: SuggestedPrompt[] = [
  { icon: AutoAwesome, label: 'Personalised plan', prompt: 'Create a personalised wedding plan for my date and budget', premium: true },
  { icon: AutoAwesome, label: 'Vendor negotiation', prompt: 'How do I negotiate with vendors effectively?', premium: true },
]

/* ═══════ CONFIDENCE COLOURS ═══════ */
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.7) return T.success
  if (confidence >= 0.4) return '#f59e0b'
  return T.accent
}

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.7) return 'High confidence'
  if (confidence >= 0.4) return 'Medium confidence'
  if (confidence > 0) return 'Low confidence'
  return ''
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function AskWed() {
  const engine = useMemo(() => new AskWedEngine(), [])

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: `Hi! I'm **AskWed**, your AI wedding planning assistant. 💍\n\nI can help with budgeting, venues, photography, catering, timelines, guest management, music, décor, attire, cultural traditions, and general planning. What would you like to know?`, timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: text.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay (300-900ms) — proportional to confidence work
    const delay = 300 + Math.random() * 600
    setTimeout(() => {
      const result = engine.processQuery(text)
      const reply: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: result.text,
        timestamp: new Date(),
        meta: result,
      }
      // Track in engine for follow-up context
      engine.addToHistory({
        id: reply.id, role: 'assistant', text: reply.text, timestamp: reply.timestamp,
        meta: { topic: result.topic, confidence: result.confidence, matchedKeywords: result.matchedKeywords, multiTopic: result.multiTopic },
      })
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, delay)
  }, [engine])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  /* ── render markdown-lite (bold, bullet, newline) ── */
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={j}>{part.slice(2, -2)}</strong>
        return <span key={j}>{part}</span>
      })
      return <Typography key={i} component="div" sx={{ fontFamily: T.font, fontSize: 14, color: 'inherit', lineHeight: 1.8, minHeight: line === '' ? 8 : 'auto' }}>{parts}</Typography>
    })
  }

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
              <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: { xs: 24, md: 28 }, color: T.primaryBlack }}>AskWed</Typography>
              <Chip label="AI Assistant" size="small" sx={{ bgcolor: 'rgba(0,131,143,0.1)', color: T.primary, fontFamily: T.font, fontWeight: 700, fontSize: 11 }} />
            </Box>
            <Typography sx={{ fontFamily: T.font, fontWeight: 400, fontSize: 15, color: T.textSub, mt: 0.3 }}>Your personal wedding planning concierge</Typography>
          </Box>
        </Box>
      </Box>

      {/* CHAT AREA */}
      <Box sx={{ flex: 1, px: { xs: 2, md: '120px' }, pb: 4, display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* MAIN CHAT */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: T.border, minHeight: 500 }}>
          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {messages.map((msg) => (
              <Fade in key={msg.id} timeout={300}>
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: msg.role === 'assistant' ? T.primary : T.accent, flexShrink: 0 }}>
                    {msg.role === 'assistant' ? <SmartToy sx={{ fontSize: 20 }} /> : <Person sx={{ fontSize: 20 }} />}
                  </Avatar>
                  <Box sx={{
                    maxWidth: '75%', p: 2.5, borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    bgcolor: msg.role === 'user' ? T.primary : 'rgba(0,131,143,0.04)',
                    color: msg.role === 'user' ? '#fff' : T.text,
                    border: msg.role === 'assistant' ? '1px solid rgba(0,131,143,0.1)' : 'none',
                  }}>
                    {renderText(msg.text)}
                    {/* Confidence indicator for assistant messages */}
                    {msg.role === 'assistant' && msg.meta && msg.meta.confidence > 0 && (
                      <Tooltip title={`${getConfidenceLabel(msg.meta.confidence)} (${(msg.meta.confidence * 100).toFixed(0)}%) — Topic: ${msg.meta.topic}${msg.meta.multiTopic ? ' (multi-topic)' : ''} — ${msg.meta.processingTimeMs.toFixed(0)}ms`}>
                        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={msg.meta.confidence * 100}
                            sx={{
                              flex: 1, maxWidth: 80, height: 3, borderRadius: 2,
                              bgcolor: 'rgba(0,0,0,0.06)',
                              '& .MuiLinearProgress-bar': { bgcolor: getConfidenceColor(msg.meta.confidence) },
                            }}
                          />
                          <Typography sx={{ fontFamily: T.font, fontSize: 10, color: T.textSub }}>
                            {getConfidenceLabel(msg.meta.confidence)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Fade>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: T.primary }}><SmartToy sx={{ fontSize: 20 }} /></Avatar>
                <Box sx={{ p: 2, borderRadius: '16px 16px 16px 4px', bgcolor: 'rgba(0,131,143,0.04)', border: '1px solid rgba(0,131,143,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: T.primary }} />
                  <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub }}>AskWed is thinking...</Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested prompts (show when few messages) */}
          {messages.length <= 2 && (
            <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
              <Typography sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.textSub, mb: 1.5 }}>Suggested questions:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SUGGESTED.map((s, i) => (
                  <Chip key={i} icon={<s.icon sx={{ fontSize: '16px !important' }} />} label={s.label} onClick={() => sendMessage(s.prompt)}
                    sx={{ fontFamily: T.font, fontWeight: 600, fontSize: 12, bgcolor: '#fff', border: '1px solid rgba(0,131,143,0.2)', color: T.primaryBlack, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,131,143,0.04)', borderColor: T.primary } }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Input */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: '1px solid rgba(0,131,143,0.1)', display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
            <TextField
              inputRef={inputRef}
              fullWidth multiline maxRows={3} placeholder="Ask me anything about wedding planning..."
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              sx={{ '& .MuiOutlinedInput-root': { fontFamily: T.font, fontSize: 14, borderRadius: '12px', bgcolor: 'rgba(0,131,143,0.02)', '& fieldset': { borderColor: 'rgba(0,131,143,0.15)' }, '&:hover fieldset': { borderColor: T.primary }, '&.Mui-focused fieldset': { borderColor: T.primary } } }}
            />
            <IconButton onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
              sx={{ bgcolor: T.primary, color: '#fff', width: 44, height: 44, '&:hover': { bgcolor: '#006670' }, '&.Mui-disabled': { bgcolor: 'rgba(0,131,143,0.2)', color: '#fff' } }}>
              <Send sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* SIDEBAR — Quick Topics + Premium */}
        <Box sx={{ width: { xs: '100%', md: 280 }, display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          {/* Quick topics */}
          <Box sx={{ bgcolor: '#fff', border: T.border, p: 2.5 }}>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb sx={{ color: '#f59e0b', fontSize: 20 }} /> Quick Topics
              <Chip label="11" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(0,131,143,0.1)', color: T.primary, fontWeight: 700, fontSize: 11, height: 20 }} />
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 400, overflowY: 'auto' }}>
              {SUGGESTED.map((s, i) => (
                <Button key={i} onClick={() => { sendMessage(s.prompt); inputRef.current?.focus() }} startIcon={<s.icon />} fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.primaryBlack, py: 1, '&:hover': { bgcolor: 'rgba(0,131,143,0.04)' } }}>
                  {s.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Premium upsell */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid rgba(235,25,72,0.2)', p: 2.5, borderRadius: '4px', background: 'linear-gradient(135deg, #fff5f7 0%, #fff 100%)' }}>
            <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.primaryBlack, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome sx={{ color: T.accent, fontSize: 20 }} /> Premium AI
            </Typography>
            <Typography sx={{ fontFamily: T.font, fontSize: 13, color: T.textSub, mb: 2 }}>Unlock personalised plans, vendor negotiation scripts, and unlimited follow-ups.</Typography>
            {PREMIUM_PROMPTS.map((p, i) => (
              <Button key={i} startIcon={<Lock sx={{ fontSize: '14px !important' }} />} fullWidth disabled
                sx={{ justifyContent: 'flex-start', textTransform: 'none', fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.textSub, py: 0.8, mb: 0.5 }}>
                {p.label}
              </Button>
            ))}
            <Button fullWidth variant="contained"
              sx={{ mt: 1.5, bgcolor: T.accent, '&:hover': { bgcolor: '#c01438' }, textTransform: 'none', fontFamily: T.font, fontWeight: 700, fontSize: 14, borderRadius: 0 }}>
              Upgrade to Premium
            </Button>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}
