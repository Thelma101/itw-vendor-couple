import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box, Typography, TextField, IconButton, Avatar, Chip, Button, Fade, CircularProgress,
} from '@mui/material'
import {
  Send, SmartToy, Person, Lightbulb, AttachMoney, Restaurant, CameraAlt, MusicNote,
  Favorite, Event, LocalFlorist, Celebration, AutoAwesome, Lock,
} from '@mui/icons-material'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

/* ═══════ TOKENS ═══════ */
const T = {
  bg: '#FFF6F9', primary: '#00838F', primaryBlack: '#002528',
  accentGrad: 'linear-gradient(255.71deg, #EB1948 65.18%, #B52344 232.03%)',
  accent: '#EB1948', success: '#008F53',
  text: '#2d2d2d', textSub: '#aaaaaa', font: "'Open Sans', sans-serif",
  border: '0.25px solid #00838F',
}

/* ═══════ TYPES ═══════ */
interface Message { id: string; role: 'user' | 'assistant'; text: string; timestamp: Date }
interface SuggestedPrompt { icon: React.ElementType; label: string; prompt: string; premium?: boolean }

/* ═══════ KNOWLEDGE BASE ═══════ */
const KNOWLEDGE: Record<string, string> = {
  budget: `Great question about budgeting! Here are key tips:\n\n**Budget Allocation Guide:**\n• Venue & Catering: 40-50%\n• Photography/Video: 10-12%\n• Music & Entertainment: 5-8%\n• Flowers & Décor: 8-10%\n• Attire & Beauty: 8-10%\n• Stationery: 2-3%\n• Transportation: 2-3%\n• Miscellaneous: 5-10%\n\nAlways keep a 10% contingency buffer. Use the Budget Tracker (/couple/budget) to stay on track!`,
  venue: `When choosing your venue, consider:\n\n1. **Guest count** — venue capacity should be 10-20% more than your list\n2. **Season** — rainy season in Lagos (April-July) means indoor or tented venues\n3. **Location** — central to most guests to reduce no-shows\n4. **Inclusions** — some venues include tables, chairs, generators\n5. **Payment terms** — negotiate instalment plans\n\nPro tip: Visit venues at the same time of day as your event to check lighting and ambience!`,
  photography: `Photography tips for your big day:\n\n• **Book 9-12 months** in advance for top photographers\n• Ask to see **full wedding galleries**, not just highlights\n• Discuss your shot list — couple portraits, family formals, candid moments\n• **Golden hour** (4-5 PM) gives the best natural light\n• Consider a **second photographer** for large weddings (200+ guests)\n• Ask about delivery timeline — 4-8 weeks is standard\n\nOur platform has top-rated photographers. Check Hire Vendors → Photography!`,
  catering: `Catering is typically the biggest single expense. Consider:\n\n• **Plated vs buffet** — buffet is usually 20-30% cheaper\n• **Local cuisine** — jollof rice, suya stations, and small chops are crowd pleasers\n• **Tasting** — always do a tasting before booking\n• **Head count** — order for 90% of RSVPs (some guests won't show)\n• **Dietary needs** — ask about vegetarian, halal, and allergy options\n• **Bar packages** — open bar, limited, or cash bar\n\nDon't forget: cake cutting service, cocktail hour snacks, and late-night bites!`,
  timeline: `Standard Nigerian wedding day timeline:\n\n⏰ **Traditional/Engagement:**\n• 10:00 AM — Venue setup\n• 12:00 PM — Guests arrive\n• 1:00 PM — Ceremony begins\n• 3:00 PM — Reception\n\n⏰ **White Wedding:**\n• 9:00 AM — Bridal prep\n• 11:00 AM — Church ceremony\n• 1:00 PM — Cocktail hour\n• 2:00 PM — Reception\n• 4:00 PM — First dance & toasts\n• 6:00 PM — Party!\n\nUse the Day-of Timeline page (/couple/timeline) to customise yours!`,
  guest: `Guest list management tips:\n\n• Start with an **A-list** (must-invite) and **B-list** (if budget allows)\n• Set a firm RSVP deadline — 4-6 weeks before the wedding\n• Expect **15-20% decline rate** for Nigerian weddings\n• Use categories: Family, Friends, Colleagues, Plus-ones\n• **Aso-ebi coordination** — collect sizes and payments early\n• Track RSVPs digitally through your Wedding Website\n\nManage your list in the Guest List page (/couple/guests)!`,
  music: `Music makes or breaks the party! Consider:\n\n• **Live band + DJ combo** is the gold standard for Nigerian weddings\n• Book popular acts 6-12 months ahead\n• Create a **do-not-play** list (as important as the playlist!)\n• Plan sets: Ceremony → Cocktail → Dinner → Party\n• Cultural music: highlife, afrobeats, juju for different crowd segments\n• Sound check the venue — some spaces need extra speakers\n\nBrowse Music vendors on our platform!`,
  decor: `Décor & styling tips:\n\n• Match your **colour palette** to the season and venue\n• Centrepieces: tall arrangements for large halls, low for intimate settings\n• **Lighting** transforms any space — uplighting, fairy lights, chandeliers\n• Consider **reusing ceremony flowers** at the reception\n• Trends: dried flowers, arches, neon signs, hanging installations\n• DIY elements save money — welcome signs, table numbers, favours\n\nDesign your colour scheme in the Wedding Website settings!`,
  default: `I'd love to help with your wedding planning! Here are things I can assist with:\n\n💰 **Budget** — allocation, saving tips, negotiation\n🏛️ **Venue** — selection criteria, questions to ask\n📸 **Photography** — booking tips, shot lists\n🍽️ **Catering** — menu planning, tasting tips\n⏰ **Timeline** — day-of scheduling\n👥 **Guest List** — management, RSVPs\n🎵 **Music** — entertainment planning\n🌸 **Décor** — styling and trends\n\nJust ask me anything about your wedding planning journey!`,
}

const matchTopic = (input: string): string => {
  const lower = input.toLowerCase()
  if (/budget|cost|money|price|expensive|cheap|afford|save|spend|allocat/i.test(lower)) return 'budget'
  if (/venue|hall|location|space|outdoor|indoor|garden|beach/i.test(lower)) return 'venue'
  if (/photo|camera|picture|portrait|shot|photographer/i.test(lower)) return 'photography'
  if (/food|cater|menu|dinner|lunch|buffet|chef|cake|drink|bar/i.test(lower)) return 'catering'
  if (/time|schedule|day.of|itinerary|plan.*day|when|clock|hour/i.test(lower)) return 'timeline'
  if (/guest|invite|rsvp|list|aso.?ebi|attendance|seat/i.test(lower)) return 'guest'
  if (/music|band|dj|song|dance|entertainment|live/i.test(lower)) return 'music'
  if (/decor|flower|colour|color|design|theme|style|centrepiece|light/i.test(lower)) return 'decor'
  return 'default'
}

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
]

const PREMIUM_PROMPTS: SuggestedPrompt[] = [
  { icon: AutoAwesome, label: 'Personalised plan', prompt: 'Create a personalised wedding plan for my date and budget', premium: true },
  { icon: AutoAwesome, label: 'Vendor negotiation', prompt: 'How do I negotiate with vendors effectively?', premium: true },
]

/* ═══════ MAIN COMPONENT ═══════ */
export default function AskWed() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: `Hi! I'm **AskWed**, your AI wedding planning assistant. 💍\n\nI can help with budgeting, vendor selection, timelines, guest management, and more. What would you like to know?`, timestamp: new Date() },
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

    // Simulate AI thinking delay (300-900ms)
    const delay = 300 + Math.random() * 600
    setTimeout(() => {
      const topic = matchTopic(text)
      const reply: Message = { id: `a-${Date.now()}`, role: 'assistant', text: KNOWLEDGE[topic], timestamp: new Date() }
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, delay)
  }, [])

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
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
