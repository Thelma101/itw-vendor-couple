/**
 * AskWed AI Engine — v2.0
 * ─────────────────────────
 * A comprehensive NLP-lite engine for the AskWed wedding planning assistant.
 *
 * Improvements over v1 (regex-only matcher):
 *  1. Weighted keyword scoring (TF-IDF inspired)
 *  2. Fuzzy matching for typos (Levenshtein distance)
 *  3. Sub-topic granularity — specific answers per nuance
 *  4. Confidence scores with thresholds
 *  5. Multi-topic blending for complex queries
 *  6. Conversation context tracking (follow-up detection)
 *  7. Input validation and normalisation
 *  8. Greeting / farewell / gratitude intent detection
 *  9. Expandable knowledge graph structure
 */

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

export interface EngineMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
  meta?: {
    topic?: string
    confidence?: number
    matchedKeywords?: string[]
    multiTopic?: boolean
  }
}

export interface TopicScore {
  topic: string
  score: number
  matchedKeywords: string[]
}

export interface EngineResponse {
  text: string
  topic: string
  confidence: number
  matchedKeywords: string[]
  multiTopic: boolean
  processingTimeMs: number
}

/* ═══════════════════════════════════════════════════════════════
   KEYWORD DEFINITIONS — weighted terms per topic
   Each keyword has a weight (0-10).  Higher = more diagnostic.
   ═══════════════════════════════════════════════════════════════ */

interface WeightedKeyword {
  word: string
  weight: number
  /** Optional aliases (incl. common misspellings) */
  aliases?: string[]
}

const TOPIC_KEYWORDS: Record<string, WeightedKeyword[]> = {
  budget: [
    { word: 'budget', weight: 10, aliases: ['buget', 'budgt', 'budjet'] },
    { word: 'cost', weight: 9, aliases: ['costs', 'costing'] },
    { word: 'money', weight: 8 },
    { word: 'price', weight: 8, aliases: ['prices', 'pricing', 'pricelist'] },
    { word: 'expensive', weight: 7, aliases: ['expnsive'] },
    { word: 'cheap', weight: 7, aliases: ['cheaper', 'cheapest'] },
    { word: 'afford', weight: 7, aliases: ['affordable', 'affordability'] },
    { word: 'save', weight: 6, aliases: ['saving', 'savings'] },
    { word: 'spend', weight: 7, aliases: ['spending', 'spent'] },
    { word: 'allocat', weight: 8, aliases: ['allocate', 'allocation'] },
    { word: 'negotiate', weight: 6, aliases: ['negotiation', 'haggle', 'bargain'] },
    { word: 'payment', weight: 5, aliases: ['pay', 'paying', 'instalment', 'installment'] },
    { word: 'naira', weight: 7, aliases: ['ngn', '₦'] },
    { word: 'deposit', weight: 5 },
    { word: 'quote', weight: 5, aliases: ['quotation', 'estimate'] },
    { word: 'finance', weight: 5, aliases: ['financial'] },
    { word: 'splurge', weight: 4 },
    { word: 'investment', weight: 4, aliases: ['invest'] },
    { word: 'overbudget', weight: 8 },
    { word: 'underbudget', weight: 8 },
    { word: 'how much', weight: 9 },
    { word: 'total cost', weight: 9 },
  ],
  venue: [
    { word: 'venue', weight: 10, aliases: ['venu', 'venues'] },
    { word: 'hall', weight: 8, aliases: ['halls', 'banquet'] },
    { word: 'location', weight: 7, aliases: ['locations'] },
    { word: 'space', weight: 5 },
    { word: 'outdoor', weight: 6, aliases: ['open-air', 'openair'] },
    { word: 'indoor', weight: 6 },
    { word: 'garden', weight: 7, aliases: ['gardens'] },
    { word: 'beach', weight: 7, aliases: ['beachside', 'seaside'] },
    { word: 'capacity', weight: 6 },
    { word: 'reception', weight: 5 },
    { word: 'ballroom', weight: 8 },
    { word: 'marquee', weight: 8, aliases: ['tent', 'canopy'] },
    { word: 'event centre', weight: 9, aliases: ['event center'] },
    { word: 'rooftop', weight: 7 },
    { word: 'restaurant', weight: 4 },
    { word: 'hotel', weight: 5, aliases: ['resort'] },
    { word: 'church', weight: 5, aliases: ['chapel', 'mosque', 'synagogue'] },
    { word: 'parking', weight: 3 },
    { word: 'generator', weight: 4, aliases: ['gen', 'power supply'] },
  ],
  photography: [
    { word: 'photo', weight: 10, aliases: ['photograph', 'photos', 'photographs'] },
    { word: 'photographer', weight: 10, aliases: ['photographers', 'photog'] },
    { word: 'camera', weight: 7, aliases: ['cameras'] },
    { word: 'picture', weight: 7, aliases: ['pictures', 'pic', 'pics'] },
    { word: 'portrait', weight: 6, aliases: ['portraits'] },
    { word: 'shot', weight: 5, aliases: ['shots', 'shot list', 'shotlist'] },
    { word: 'video', weight: 7, aliases: ['videography', 'videographer', 'filming'] },
    { word: 'drone', weight: 6 },
    { word: 'album', weight: 6, aliases: ['albums', 'photo album'] },
    { word: 'editing', weight: 5, aliases: ['edit', 'retouch', 'retouching'] },
    { word: 'golden hour', weight: 7 },
    { word: 'candid', weight: 5 },
    { word: 'gallery', weight: 4 },
    { word: 'pre-wedding shoot', weight: 9, aliases: ['pre-wedding', 'prewedding', 'engagement shoot'] },
  ],
  catering: [
    { word: 'catering', weight: 10, aliases: ['cater', 'caterer', 'caterers'] },
    { word: 'food', weight: 9, aliases: ['foods'] },
    { word: 'menu', weight: 8, aliases: ['menus'] },
    { word: 'dinner', weight: 6 },
    { word: 'lunch', weight: 6 },
    { word: 'buffet', weight: 7 },
    { word: 'chef', weight: 6, aliases: ['chefs', 'cook'] },
    { word: 'cake', weight: 7, aliases: ['cakes', 'wedding cake'] },
    { word: 'drink', weight: 5, aliases: ['drinks', 'beverage', 'beverages'] },
    { word: 'bar', weight: 4, aliases: ['cocktail bar', 'open bar'] },
    { word: 'jollof', weight: 8, aliases: ['jollof rice'] },
    { word: 'small chop', weight: 8, aliases: ['small chops', 'appetizer', 'appetizers', 'starter'] },
    { word: 'suya', weight: 7 },
    { word: 'tasting', weight: 7 },
    { word: 'vegetarian', weight: 4, aliases: ['vegan', 'dietary'] },
    { word: 'halal', weight: 4 },
    { word: 'wine', weight: 4, aliases: ['champagne', 'palm wine'] },
  ],
  timeline: [
    { word: 'timeline', weight: 10, aliases: ['timelines', 'time line'] },
    { word: 'schedule', weight: 9, aliases: ['scheduling', 'schedules'] },
    { word: 'day of', weight: 8, aliases: ['day-of'] },
    { word: 'itinerary', weight: 9, aliases: ['itineraries'] },
    { word: 'plan the day', weight: 8 },
    { word: 'when', weight: 3 },
    { word: 'clock', weight: 4 },
    { word: 'hour', weight: 3, aliases: ['hours'] },
    { word: 'morning', weight: 3 },
    { word: 'evening', weight: 3 },
    { word: 'ceremony time', weight: 9 },
    { word: 'reception time', weight: 8 },
    { word: 'run of show', weight: 9 },
    { word: 'order of events', weight: 9, aliases: ['order of event'] },
    { word: 'first dance', weight: 5 },
    { word: 'bridal prep', weight: 6, aliases: ['getting ready'] },
    { word: 'toast', weight: 4, aliases: ['toasts', 'speech', 'speeches'] },
  ],
  guest: [
    { word: 'guest', weight: 10, aliases: ['guests'] },
    { word: 'invite', weight: 8, aliases: ['invites', 'invitation', 'invitations', 'inviting'] },
    { word: 'rsvp', weight: 9, aliases: ['r.s.v.p', 'r.s.v.p.'] },
    { word: 'list', weight: 4 },
    { word: 'aso ebi', weight: 8, aliases: ['asoebi', 'aso-ebi'] },
    { word: 'attendance', weight: 6, aliases: ['attendees', 'attendee'] },
    { word: 'seating', weight: 7, aliases: ['seat', 'seats', 'seating chart', 'seating plan'] },
    { word: 'plus one', weight: 6, aliases: ['plus-one', 'plus ones'] },
    { word: 'headcount', weight: 7, aliases: ['head count'] },
    { word: 'family', weight: 3 },
    { word: 'friends', weight: 3 },
    { word: 'colleagues', weight: 3, aliases: ['coworkers', 'co-workers'] },
    { word: 'children', weight: 4, aliases: ['kids', 'child-free'] },
  ],
  music: [
    { word: 'music', weight: 10, aliases: ['musical'] },
    { word: 'band', weight: 8, aliases: ['bands', 'live band'] },
    { word: 'dj', weight: 9, aliases: ['disc jockey', 'deejay'] },
    { word: 'song', weight: 7, aliases: ['songs', 'playlist'] },
    { word: 'dance', weight: 6, aliases: ['dancing', 'dances'] },
    { word: 'entertainment', weight: 7, aliases: ['entertain'] },
    { word: 'live', weight: 4 },
    { word: 'afrobeat', weight: 6, aliases: ['afrobeats', 'afro'] },
    { word: 'highlife', weight: 6 },
    { word: 'juju', weight: 5, aliases: ['juju music'] },
    { word: 'sound system', weight: 6, aliases: ['speakers', 'speaker'] },
    { word: 'mc', weight: 5, aliases: ['emcee', 'master of ceremonies', 'compere'] },
    { word: 'first dance song', weight: 8 },
    { word: 'walkdown', weight: 5, aliases: ['walk down', 'processional'] },
  ],
  decor: [
    { word: 'decor', weight: 10, aliases: ['décor', 'decoration', 'decorations', 'decorating'] },
    { word: 'flower', weight: 8, aliases: ['flowers', 'floral', 'florist'] },
    { word: 'colour', weight: 6, aliases: ['color', 'colours', 'colors', 'colour palette', 'color palette'] },
    { word: 'design', weight: 5 },
    { word: 'theme', weight: 7, aliases: ['themes', 'themed'] },
    { word: 'style', weight: 5, aliases: ['styling', 'styled'] },
    { word: 'centrepiece', weight: 8, aliases: ['centerpiece', 'centrepieces', 'centerpieces'] },
    { word: 'lighting', weight: 7, aliases: ['lights', 'light', 'fairy lights'] },
    { word: 'arch', weight: 6, aliases: ['arches', 'archway'] },
    { word: 'aisle', weight: 5, aliases: ['aisle runner'] },
    { word: 'table setting', weight: 7, aliases: ['tablescape', 'table decor'] },
    { word: 'backdrop', weight: 7, aliases: ['backdrops'] },
    { word: 'neon sign', weight: 5, aliases: ['neon'] },
    { word: 'draping', weight: 6, aliases: ['drapes', 'drapery'] },
    { word: 'balloon', weight: 5, aliases: ['balloons'] },
  ],
  /* ── New topics not in v1 ── */
  attire: [
    { word: 'dress', weight: 9, aliases: ['dresses', 'gown', 'gowns', 'wedding dress'] },
    { word: 'attire', weight: 10 },
    { word: 'suit', weight: 7, aliases: ['suits', 'tuxedo', 'tux'] },
    { word: 'bridesmaid', weight: 7, aliases: ['bridesmaids', 'bridesmaid dress'] },
    { word: 'groomsman', weight: 7, aliases: ['groomsmen'] },
    { word: 'traditional', weight: 5, aliases: ['traditional attire', 'aso oke', 'agbada'] },
    { word: 'makeup', weight: 7, aliases: ['make-up', 'beauty', 'bridal makeup'] },
    { word: 'hair', weight: 5, aliases: ['hairstyle', 'hairstyles', 'bridal hair'] },
    { word: 'accessories', weight: 5, aliases: ['jewelry', 'jewellery', 'tiara', 'veil'] },
    { word: 'fitting', weight: 6, aliases: ['fittings', 'alterations'] },
    { word: 'designer', weight: 5 },
  ],
  planning: [
    { word: 'planning', weight: 8, aliases: ['plan', 'planner', 'coordinator'] },
    { word: 'wedding planner', weight: 10 },
    { word: 'checklist', weight: 8, aliases: ['check list', 'to-do', 'todo'] },
    { word: 'organise', weight: 6, aliases: ['organize', 'organisation', 'organization'] },
    { word: 'prepare', weight: 5, aliases: ['preparation', 'preparations', 'prep'] },
    { word: 'months before', weight: 7, aliases: ['months ahead', 'weeks before'] },
    { word: 'stress', weight: 5, aliases: ['stressful', 'overwhelmed', 'overwhelming'] },
    { word: 'where to start', weight: 9 },
    { word: 'first steps', weight: 8, aliases: ['first step', 'getting started'] },
    { word: 'delegate', weight: 5, aliases: ['delegating'] },
    { word: 'coordination', weight: 6 },
  ],
  cultural: [
    { word: 'traditional', weight: 6, aliases: ['tradition', 'traditions', 'cultural'] },
    { word: 'engagement ceremony', weight: 9, aliases: ['engagement'] },
    { word: 'introduction', weight: 5, aliases: ['introduction ceremony'] },
    { word: 'wine carrying', weight: 8, aliases: ['palm wine carrying', 'igba nkwu'] },
    { word: 'yoruba', weight: 7, aliases: ['yoruba wedding'] },
    { word: 'igbo', weight: 7, aliases: ['igbo wedding'] },
    { word: 'hausa', weight: 7, aliases: ['hausa wedding', 'nikkai', 'nikkah'] },
    { word: 'dowry', weight: 7, aliases: ['bride price'] },
    { word: 'aso oke', weight: 8 },
    { word: 'kola nut', weight: 7, aliases: ['kolanut', 'kola'] },
    { word: 'libation', weight: 5 },
    { word: 'nikah', weight: 7 },
    { word: 'white wedding', weight: 5 },
  ],
}

/* ═══════════════════════════════════════════════════════════════
   EXPANDED KNOWLEDGE BASE — with sub-topic variants
   ═══════════════════════════════════════════════════════════════ */

const KNOWLEDGE_BASE: Record<string, string> = {
  /* ── budget ── */
  budget: `Great question about budgeting! Here are key tips:\n\n**Budget Allocation Guide:**\n• Venue & Catering: 40-50%\n• Photography/Video: 10-12%\n• Music & Entertainment: 5-8%\n• Flowers & Décor: 8-10%\n• Attire & Beauty: 8-10%\n• Stationery: 2-3%\n• Transportation: 2-3%\n• Miscellaneous: 5-10%\n\n**Pro Tips:**\n• Always keep a **10% contingency buffer** for unexpected costs\n• Negotiate instalment payment plans with vendors\n• Book off-peak days (weekdays / January-March) for discounts up to 30%\n• Get at least 3 quotes for every vendor category\n• Track every naira in the Budget Tracker (/couple/budget)\n\nWant specific budget advice? Tell me your total budget and I'll break it down!`,

  /* ── venue ── */
  venue: `When choosing your venue, consider these key factors:\n\n**Selection Criteria:**\n1. **Guest count** — capacity should be 10-20% more than your final list\n2. **Season awareness** — rainy season in Lagos (April-July) means indoor or tented venues are safer\n3. **Location** — central to most guests reduces no-shows\n4. **Inclusions** — check if tables, chairs, generators, and AC are included\n5. **Payment terms** — negotiate instalment plans, typical deposits are 40-60%\n6. **Accessibility** — parking, disabled access, proximity to hotels\n\n**Pro Tips:**\n• Visit venues at the **same time of day** as your event for lighting/ambience check\n• Ask about **noise restrictions** and end times\n• Check the **backup plan** for outdoor venues (rain cover)\n• Read the contract carefully — cancellation policy, overtime charges, cleanup fees\n• Ask for **references** from recent couples\n\nBrowse top-rated venues on our platform under Hire Vendors!`,

  /* ── photography ── */
  photography: `Photography tips for your big day:\n\n**Booking & Selection:**\n• Book **9-12 months** in advance for top photographers\n• Ask to see **full wedding galleries**, not just highlight reels\n• Look at their work in **similar venues/lighting** to yours\n• Check their editing style matches your preference (moody vs airy vs vibrant)\n\n**Shot Planning:**\n• Create a detailed **shot list** — couple portraits, family formals, candid moments\n• **Golden hour** (4-5 PM) gives the best natural light portraits\n• Allocate **30-45 mins** for couple portraits in your timeline\n\n**What to Ask:**\n• Delivery timeline — 4-8 weeks is standard\n• Number of edited photos expected\n• Are **RAW files** included?\n• Consider a **second photographer** for large weddings (200+ guests)\n• Do they offer **pre-wedding shoots**?\n\nOur platform has top-rated photographers — check Hire Vendors → Photography!`,

  /* ── catering ── */
  catering: `Catering is typically the biggest single expense. Here's your complete guide:\n\n**Service Styles:**\n• **Plated dinner** — elegant but pricier\n• **Buffet** — 20-30% cheaper, more variety\n• **Food stations** — interactive (suya station, jollof bar, small chops corner)\n• **Family-style** — platters to share at each table\n\n**Nigerian Crowd Pleasers:**\n🍚 Jollof rice (the star!), fried rice, white rice & stew\n🍖 Suya stations, asun, peppered chicken\n🥘 Small chops — spring rolls, samosa, puff-puff, peppered gizzard\n🎂 Wedding cake — typically 3-5 tiers\n\n**Planning Tips:**\n• **Always do a tasting** before booking — flavour and presentation matter\n• Order for **90% of RSVPs** (some guests won't show)\n• Ask about vegetarian, halal, and allergy options\n• Decide: open bar, limited bar, or cash bar\n• Don't forget cocktail hour snacks and late-night bites!\n\nDon't forget: cake-cutting service fees and staff gratuity!`,

  /* ── timeline ── */
  timeline: `Standard Nigerian wedding day timeline:\n\n⏰ **Traditional/Engagement Day:**\n• 10:00 AM — Venue setup complete\n• 11:00 AM — Technical rehearsal\n• 12:00 PM — Guests arrive\n• 1:00 PM — Ceremony begins\n• 3:00 PM — Reception & festivities\n• 5:00 PM — Event wraps up\n\n⏰ **White Wedding Day:**\n• 7:00 AM — Bridal prep begins\n• 9:00 AM — Groom's prep\n• 10:30 AM — First look (optional)\n• 11:00 AM — Church ceremony\n• 12:30 PM — Couple portraits\n• 1:00 PM — Cocktail hour\n• 2:00 PM — Reception grand entrance\n• 3:00 PM — Lunch service\n• 4:00 PM — First dance, toasts & speeches\n• 5:00 PM — Cake cutting\n• 6:00 PM — Party & dancing!\n• 9:00 PM — Send-off\n\n**Pro Tips:**\n• Build in **30-min buffers** — Nigerian events never start on time!\n• Assign a trusted friend or planner to keep everyone on schedule\n• Customise yours in the Day-of Timeline page (/couple/timeline)`,

  /* ── guest ── */
  guest: `Guest list management tips:\n\n**Building Your List:**\n• Start with an **A-list** (must-invite) and **B-list** (if budget allows)\n• Categories: Immediate Family → Extended Family → Close Friends → Colleagues → Plus-ones\n• Agree on a **per-side quota** with your partner to keep things fair\n\n**Managing RSVPs:**\n• Set a firm RSVP deadline — **4-6 weeks** before the wedding\n• Expect **15-20% decline rate** for Nigerian weddings\n• Send reminders at **2 weeks** and **1 week** before deadline\n• Use digital RSVPs through your Wedding Website for easy tracking\n\n**Special Considerations:**\n• **Aso-ebi coordination** — collect sizes and payments early, set a deadline\n• **Plus-ones** — decide your policy early and communicate clearly\n• **Children policy** — specify on the invitation if it's adults-only\n• **Seating arrangements** — check the Seating Chart tool (/couple/seating)\n\nManage your list in the Guest List page (/couple/guests)!`,

  /* ── music ── */
  music: `Music makes or breaks the party! Here's your entertainment guide:\n\n**The Dream Setup:**\n• **Live band + DJ combo** is the gold standard for Nigerian weddings\n• Book popular acts **6-12 months** ahead — they fill up fast\n\n**Planning Your Soundtrack:**\n• **Ceremony:** Soft instrumentals, hymns, or your special song for the walk-down\n• **Cocktail hour:** Smooth jazz, light afrobeats\n• **Dinner:** Mid-tempo, conversational-level music\n• **Party:** High-energy afrobeats, highlife, juju, amapiano — get people on their feet!\n\n**Important Details:**\n• Create a **do-not-play list** (as important as the playlist!)\n• Sound-check the venue — some spaces need extra speakers\n• Hire a great **MC/Compere** — they keep energy high between sets\n• Plan cultural music moments: money spraying songs, traditional dances\n• Discuss **overtime rates** upfront — parties often run long!\n\nBrowse Music & Entertainment vendors on our platform!`,

  /* ── decor ── */
  decor: `Décor & styling tips to transform your venue:\n\n**Start with Strategy:**\n• Pick your **colour palette** first (2-3 main colours + 1-2 accents)\n• Match the palette to your season and venue architecture\n• Create a **mood board** on Inspiration Gallery (/couple/inspiration)\n\n**Key Elements:**\n🌸 **Florals** — ceremony arch, centrepieces, bouquets, aisle markers\n💡 **Lighting** — uplighting, fairy lights, chandeliers, candles (LED-safe)\n🎪 **Backdrops** — stage backdrop, photo booth backdrop, entrance arch\n🪑 **Furniture** — chair covers/sashes, lounge areas, sweetheart table styling\n\n**Trends for 2026:**\n• Dried flowers + fresh flower combos\n• Suspended installations & hanging greenery\n• Neon signs with custom quotes\n• Earth tones (terracotta, sage, rust)\n• Geometric structures\n\n**Budget-Saving Hacks:**\n• Reuse ceremony flowers at the reception\n• DIY welcome signs, table numbers, and favours\n• Candles are cheaper than elaborate florals and equally stunning\n\nDesign your colour scheme in the Wedding Website settings!`,

  /* ── attire (NEW) ── */
  attire: `Your wedding attire guide:\n\n**Bridal Looks:**\n• **White wedding gown** — start shopping 6-9 months ahead for custom designs\n• **Traditional attire** — aso oke, George wrapper, or lace depending on your culture\n• **Reception outfit** — many Nigerian brides do a 2nd or 3rd outfit change!\n• Book **3-4 fittings** for custom gowns\n\n**Groom's Attire:**\n• Classic: suit or tuxedo with personalised touches (pocket square, cufflinks)\n• Traditional: agbada, senator suit, or cultural equivalent\n• Match your colour to the bridal party palette\n\n**Bridal Party:**\n• Bridesmaids — choose a flattering silhouette that suits multiple body types\n• Groomsmen — matching suits or traditional attire depending on ceremony type\n• Coordinate colours/fabrics across both parties\n\n**Beauty Prep:**\n• Book makeup artist **6+ months** in advance\n• Do a **trial session** for both hair and makeup\n• Start skincare routine **3-6 months** before the wedding\n• Bring your headpiece/veil to the trial\n\nBrowse Makeup & Styling vendors on our platform!`,

  /* ── planning (NEW) ── */
  planning: `Wedding planning roadmap — where to start and how to stay on track:\n\n**12+ Months Out:**\n• Set your **budget** — be realistic and include a 10% buffer\n• Choose your **date** (check family/venue availability)\n• Book your **venue** — this is the biggest decision and fills up fastest\n• Hire a **wedding planner** (full-service, partial, or day-of coordinator)\n\n**9-12 Months:**\n• Book photographer, videographer, caterer, and entertainment\n• Start dress shopping / traditional attire commissioning\n• Send save-the-dates\n\n**6-9 Months:**\n• Book décor vendor and florist\n• Order invitations and aso ebi\n• Plan ceremony readings, vows, and music\n\n**3-6 Months:**\n• Final guest list and seating chart\n• Menu tasting and final food selection\n• Bridal party fittings\n• Marriage licence and legal requirements\n\n**1 Month:**\n• Final vendor confirmations and payments\n• Detailed timeline / run of show\n• Rehearsal dinner planning\n\n**Week Of:**\n• Final dress fitting, pack emergency kit, delegate day-of tasks\n\nUse the Checklist page (/couple/checklist) to track every item!`,

  /* ── cultural (NEW) ── */
  cultural: `Nigerian wedding culture and traditions guide:\n\n**Yoruba Traditional Wedding (Engagement):**\n• Formal letter of introduction\n• *Eru iyawo* — bride price presentation with symbolic items\n• Prostrating/kneeling ceremonies\n• *Iketa* — the tasting ceremony\n• Money spraying and dancing\n\n**Igbo Traditional Wedding (Igba Nkwu):**\n• Bride carries palm wine to the groom's family\n• *Iku Aka* — formal price negotiation\n• Wine-carrying ceremony — bride searches for groom in the crowd\n• Dancing and gift presentation\n\n**Hausa Traditional Wedding:**\n• *Nikkah* — Islamic marriage ceremony\n• *Sa Lalle* (henna night) — pre-wedding celebration\n• *Kamun Amarya* — formal bride arrival\n• *Budan Kai* — unveiling of the bride\n\n**Cross-Cultural / Modern Blends:**\n• Many couples now combine elements from multiple traditions\n• Having both a traditional ceremony and white wedding is very common\n• Work with a culturally aware planner to honour both families' customs\n\nAsk me about any specific cultural tradition in detail!`,

  /* ── default fallback ── */
  default: `I'd love to help with your wedding planning! Here are all the topics I can assist with:\n\n💰 **Budget** — allocation tips, saving strategies, negotiation advice\n🏛️ **Venue** — selection criteria, questions to ask, capacity planning\n📸 **Photography** — booking tips, shot lists, pre-wedding shoots\n🍽️ **Catering** — menu planning, tasting tips, Nigerian favourites\n⏰ **Timeline** — day-of scheduling, ceremony order of events\n👥 **Guest List** — management, RSVPs, seating, aso ebi\n🎵 **Music** — entertainment planning, DJs, live bands, MC\n🌸 **Décor** — styling trends, colour palettes, DIY ideas\n👗 **Attire** — bridal, groom, bridal party, beauty prep\n📋 **Planning** — getting started, checklist, monthly milestones\n🎭 **Cultural** — Yoruba, Igbo, Hausa traditions and customs\n\nJust ask me anything about your wedding planning journey!`,
}

/* ═══════════════════════════════════════════════════════════════
   INTENT DETECTION — greetings, gratitude, farewells
   ═══════════════════════════════════════════════════════════════ */

interface IntentPattern {
  patterns: RegExp[]
  response: string
}

const INTENTS: Record<string, IntentPattern> = {
  greeting: {
    patterns: [
      /^(hi|hey|hello|howdy|good\s*(morning|afternoon|evening|day)|sup|yo|what'?s\s*up)/i,
      /^(greetings|hiya|hola|ola)/i,
    ],
    response: `Hello! 👋 I'm **AskWed**, your AI wedding planning assistant.\n\nHow can I help with your wedding today? You can ask me about budgeting, venues, photography, catering, timelines, guests, music, décor, attire, cultural traditions, or general planning tips!\n\nTry one of the suggested topics to get started.`,
  },
  gratitude: {
    patterns: [
      /^(thanks?|thank\s*you|thx|ty|cheers|appreciate|grateful|much\s*appreciated)/i,
      /(thanks?|thank\s*you)\s*(so\s*much|a\s*lot|very\s*much)?[.!]?\s*$/i,
    ],
    response: `You're welcome! 😊 I'm always here to help with your wedding planning.\n\nIs there anything else you'd like to know? Feel free to ask about any wedding topic!`,
  },
  farewell: {
    patterns: [
      /^(bye|goodbye|see\s*you|later|take\s*care|ttyl|gotta\s*go|leaving)/i,
      /(bye|goodbye|see\s*ya|later)/i,
    ],
    response: `Goodbye! 💍 Best wishes with your wedding planning.\n\nCome back anytime you have questions — I'm here 24/7 to help make your special day perfect!`,
  },
  help: {
    patterns: [
      /^(help|what can you do|how does this work|what are you|who are you)/i,
      /^(menu|options|commands|features)/i,
    ],
    response: `I'm **AskWed**, your AI wedding planning assistant! Here's what I can help with:\n\n💰 **"How should I allocate my budget?"** — Budget planning\n🏛️ **"What should I look for in a venue?"** — Venue selection\n📸 **"Tips for choosing a photographer?"** — Photography\n🍽️ **"What catering options work best?"** — Food & drinks\n⏰ **"What does a wedding timeline look like?"** — Day-of schedule\n👥 **"How do I manage my guest list?"** — Guest management\n🎵 **"How do I plan wedding music?"** — Entertainment\n🌸 **"What are current décor trends?"** — Styling & décor\n👗 **"What about wedding attire?"** — Dress, suit & beauty\n📋 **"Where do I start planning?"** — Step-by-step guide\n🎭 **"Tell me about Nigerian traditions"** — Cultural customs\n\nJust type your question naturally!`,
  },
}

/* ═══════════════════════════════════════════════════════════════
   FOLLOW-UP / CONTEXT PATTERNS
   ═══════════════════════════════════════════════════════════════ */

const FOLLOW_UP_PATTERNS = [
  /^(tell me more|more info|elaborate|explain|go on|continue|and\??|what else)/i,
  /^(can you|could you)\s*(tell|give|explain|say|share)\s*more/i,
  /^(more about|details on|specifics|deep.?dive)/i,
  /^(yes|yeah|yep|sure|ok|okay|please|go ahead)/i,
]

/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Levenshtein distance for fuzzy matching
 */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

/**
 * Normalise user input — lowercase, strip excess whitespace, remove noise punctuation
 */
export function normaliseInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validate input — reject empty, too short, or garbage input
 */
export function validateInput(input: string): { valid: boolean; reason?: string } {
  const trimmed = input.trim()
  if (!trimmed) return { valid: false, reason: 'empty' }
  if (trimmed.length < 2) return { valid: false, reason: 'too_short' }
  if (trimmed.length > 2000) return { valid: false, reason: 'too_long' }
  // Check for pure gibberish (no vowels in any word longer than 3 chars)
  const words = trimmed.split(/\s+/)
  const longWords = words.filter(w => w.length > 3)
  if (longWords.length > 0 && longWords.every(w => !/[aeiou]/i.test(w))) {
    return { valid: false, reason: 'gibberish' }
  }
  return { valid: true }
}

/* ═══════════════════════════════════════════════════════════════
   SCORING ENGINE
   ═══════════════════════════════════════════════════════════════ */

/**
 * Score a normalised input against all topics.
 * Returns sorted array of {topic, score, matchedKeywords}.
 */
export function scoreTopics(input: string): TopicScore[] {
  const normInput = normaliseInput(input)
  const inputWords = normInput.split(/\s+/)
  const scores: TopicScore[] = []

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let totalScore = 0
    const matched: string[] = []

    for (const kw of keywords) {
      const allForms = [kw.word, ...(kw.aliases ?? [])]

      for (const form of allForms) {
        // Exact substring match (highest confidence)
        if (normInput.includes(form.toLowerCase())) {
          totalScore += kw.weight * 2
          if (!matched.includes(kw.word)) matched.push(kw.word)
          break // don't double-count aliases
        }

        // Word-level exact match
        const formWords = form.toLowerCase().split(/\s+/)
        if (formWords.length === 1) {
          if (inputWords.includes(formWords[0])) {
            totalScore += kw.weight * 1.5
            if (!matched.includes(kw.word)) matched.push(kw.word)
            break
          }
        }

        // Fuzzy match (for single-word keywords > 3 chars)
        if (formWords.length === 1 && formWords[0].length > 3) {
          for (const inputWord of inputWords) {
            if (inputWord.length > 3) {
              const dist = levenshtein(inputWord, formWords[0])
              const maxLen = Math.max(inputWord.length, formWords[0].length)
              // Threshold: allow ~25% character difference
              if (dist <= Math.ceil(maxLen * 0.25) && dist > 0) {
                totalScore += kw.weight * 0.6 // discounted for fuzzy
                if (!matched.includes(kw.word)) matched.push(`~${kw.word}`)
                break
              }
            }
          }
        }
      }
    }

    if (totalScore > 0) {
      scores.push({ topic, score: totalScore, matchedKeywords: matched })
    }
  }

  // Sort descending by score
  scores.sort((a, b) => b.score - a.score)
  return scores
}

/* ═══════════════════════════════════════════════════════════════
   CONFIDENCE CLASSIFICATION
   ═══════════════════════════════════════════════════════════════ */

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none'

export function classifyConfidence(topScore: number, secondScore: number): { level: ConfidenceLevel; value: number } {
  // Normalise score to 0-1 range (max realistic score ≈ 100)
  const normScore = Math.min(topScore / 40, 1)
  const gap = topScore > 0 ? (topScore - secondScore) / topScore : 0

  if (normScore >= 0.5 && gap >= 0.3) return { level: 'high', value: Math.min(0.7 + normScore * 0.3, 1) }
  if (normScore >= 0.25) return { level: 'medium', value: 0.4 + normScore * 0.3 }
  if (normScore > 0) return { level: 'low', value: 0.1 + normScore * 0.3 }
  return { level: 'none', value: 0 }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ENGINE CLASS
   ═══════════════════════════════════════════════════════════════ */

export class AskWedEngine {
  private conversationHistory: EngineMessage[] = []
  private lastTopic: string | null = null

  constructor() {
    this.reset()
  }

  /** Clear conversation state */
  reset() {
    this.conversationHistory = []
    this.lastTopic = null
  }

  /** Get conversation history */
  getHistory(): EngineMessage[] {
    return [...this.conversationHistory]
  }

  /** Add a message to history (for external tracking) */
  addToHistory(msg: EngineMessage) {
    this.conversationHistory.push(msg)
    if (msg.meta?.topic && msg.role === 'assistant') {
      this.lastTopic = msg.meta.topic
    }
  }

  /**
   * Process a user query and return the best response.
   */
  processQuery(rawInput: string): EngineResponse {
    const startTime = performance.now()
    const normInput = normaliseInput(rawInput)

    // ─── Step 1: Input validation ───
    const validation = validateInput(normInput)
    if (!validation.valid) {
      return {
        text: this.getValidationErrorMessage(validation.reason ?? 'unknown'),
        topic: 'error',
        confidence: 0,
        matchedKeywords: [],
        multiTopic: false,
        processingTimeMs: performance.now() - startTime,
      }
    }

    // ─── Step 2: Intent detection (greetings, thanks, etc.) ───
    for (const [intentName, intent] of Object.entries(INTENTS)) {
      for (const pattern of intent.patterns) {
        if (pattern.test(normInput)) {
          return {
            text: intent.response,
            topic: intentName,
            confidence: 0.95,
            matchedKeywords: [intentName],
            multiTopic: false,
            processingTimeMs: performance.now() - startTime,
          }
        }
      }
    }

    // ─── Step 3: Follow-up detection ───
    const isFollowUp = FOLLOW_UP_PATTERNS.some(p => p.test(normInput))
    if (isFollowUp && this.lastTopic && this.lastTopic !== 'default') {
      const followUpText = this.generateFollowUp(this.lastTopic, normInput)
      return {
        text: followUpText,
        topic: this.lastTopic,
        confidence: 0.8,
        matchedKeywords: ['follow-up'],
        multiTopic: false,
        processingTimeMs: performance.now() - startTime,
      }
    }

    // ─── Step 4: Topic scoring ───
    const scores = scoreTopics(normInput)
    const topScore = scores[0] ?? { topic: 'default', score: 0, matchedKeywords: [] }
    const secondScore = scores[1] ?? { topic: 'default', score: 0, matchedKeywords: [] }

    const confidence = classifyConfidence(topScore.score, secondScore.score)

    // ─── Step 5: Determine response strategy ───
    let responseText: string
    let isMultiTopic = false

    if (confidence.level === 'none') {
      // No match — use default
      responseText = KNOWLEDGE_BASE.default
    } else if (confidence.level === 'low' && scores.length >= 2 && secondScore.score > 0) {
      // Low confidence and multiple topics matched — suggest clarification
      responseText = this.generateClarificationResponse(scores.slice(0, 3))
    } else if (
      scores.length >= 2 &&
      secondScore.score >= topScore.score * 0.6
    ) {
      // Multi-topic: second topic is close in score
      responseText = this.blendResponses(topScore.topic, secondScore.topic)
      isMultiTopic = true
    } else {
      // Single topic — high or medium confidence
      responseText = KNOWLEDGE_BASE[topScore.topic] ?? KNOWLEDGE_BASE.default
    }

    this.lastTopic = topScore.topic

    return {
      text: responseText,
      topic: topScore.topic,
      confidence: confidence.value,
      matchedKeywords: topScore.matchedKeywords,
      multiTopic: isMultiTopic,
      processingTimeMs: performance.now() - startTime,
    }
  }

  /* ── PRIVATE HELPERS ── */

  private getValidationErrorMessage(reason: string): string {
    switch (reason) {
      case 'empty':
        return 'It looks like you sent an empty message. Please type a question about wedding planning!'
      case 'too_short':
        return 'Could you elaborate a bit more? Type a question like "How should I plan my budget?" and I\'ll be happy to help!'
      case 'too_long':
        return 'That\'s quite a long message! Could you break your question into smaller parts? I\'ll be happy to help with each one.'
      case 'gibberish':
        return 'I wasn\'t able to understand that. Could you rephrase your question? For example, try asking about wedding budgets, venues, photography, or any topic listed in the sidebar!'
      default:
        return 'I didn\'t quite catch that. Try asking me about a specific wedding topic like budget, venue, photography, or décor!'
    }
  }

  private generateFollowUp(topic: string, _input: string): string {
    const followUps: Record<string, string> = {
      budget: `Here's more on budgeting:\n\n**Negotiation Tips:**\n• Always get quotes from **at least 3 vendors** in each category\n• Ask if there are **off-peak discounts** (weekdays, January-March)\n• Request **package deals** when booking multiple services\n• Don't be afraid to ask for a **payment plan**\n• Read the contract — look out for hidden fees (overtime, setup, cleanup)\n\n**Common Budget Mistakes:**\n• Forgetting tipping / gratuity (5-10% for major vendors)\n• Not accounting for outfit changes and accessories\n• Underestimating transportation costs (bridal party, family)\n• Ignoring stationery costs (save-the-dates, invites, programs)\n\nWant me to create a detailed budget breakdown for a specific amount?`,

      venue: `More venue insights:\n\n**Questions to Ask Every Venue:**\n1. What's the rental fee, and what does it include?\n2. Do you have an exclusive caterer, or can we bring our own?\n3. What's the backup plan for rain (if outdoor)?\n4. Are there noise restrictions or end times?\n5. What's the parking capacity?\n6. Is there a bridal suite for getting ready?\n7. Do you provide power backup (generator)?\n8. What are the overtime charges?\n9. Can we do a site visit at the time our event will be?\n10. Are there any upcoming renovations?\n\nWould you like tips on a specific venue type (garden, beach, hall)?`,

      photography: `More photography insights:\n\n**Pre-Wedding Shoot Ideas:**\n• Location shoots — beach, garden, urban backdrop\n• Styled shoots — incorporate your culture or hobbies\n• Day-in-the-life / casual couples session\n\n**Day-of Photography Checklist:**\n✅ Getting-ready moments (both sides)\n✅ Venue details & décor before guests arrive\n✅ Ceremony — processional, vows, rings, kiss\n✅ Family formals (both families)\n✅ Bridal party shots\n✅ Couple sunset/golden-hour portraits\n✅ Reception highlights — entrance, first dance, cake, speeches\n✅ Guest candids and reactions\n\nShall I suggest how to structure your photography timeline?`,

      catering: `More catering details:\n\n**How to Plan Your Menu:**\n1. Consider your crowd — mix of young & older guests, dietary needs\n2. Offer at least 2 protein options and 2 starch options\n3. Have a separate **children's menu** if kids are invited\n4. Plan the **cocktail hour** — 3-4 small chop options + 2-3 drinks\n5. Consider a **dessert table** in addition to the wedding cake\n\n**Vendor Red Flags:**\n🚩 Won't allow a tasting before booking\n🚩 No health/safety certification\n🚩 Can't accommodate dietary restrictions\n🚩 No clear breakdown of per-head cost\n🚩 Unclear about staffing numbers\n\nWould you like specific menu suggestions for your guest count?`,

      timeline: `More timeline planning details:\n\n**Buffer Time Tips:**\n• Build in **30-minute buffers** between major segments\n• Nigerian events typically start 30-60 mins late — plan for it!\n• Allow **extra time** for outfit changes\n\n**Key Timing Decisions:**\n• Morning vs afternoon ceremony? (affects everything else)\n• How long for couple portraits? (30-45 mins minimum)\n• Sunset time on your date? (for golden hour photos)\n• When does the band/DJ start vs end?\n\n**Day-Before Timeline:**\n• Venue walkthrough and setup\n• Rehearsal (ceremony order)\n• Rehearsal dinner\n• Final confirmations with all vendors\n• Pack emergency kit!\n\nWant me to create a custom timeline for your specific event times?`,

      guest: `More guest management advice:\n\n**Aso Ebi Management:**\n• Set a **firm deadline** for ordering (at least 2 months before)\n• Use a spreadsheet to track: Name, Size, Colour, Payment Status\n• Order **10% extra** for last-minute additions\n• Assign one person as the aso ebi coordinator\n\n**Seating Strategy:**\n• Seat similar groups near each other (college friends together)\n• Keep feuding family members **far apart**\n• Give VIPs and elderly guests the best tables (close, good view)\n• The bridal party table should face the room\n• Number tables, don't use names (easier for guests to find)\n\n**Managing Plus-Ones:**\n• Married + engaged couples always get a plus-one\n• Single guests: your call — set a consistent policy\n• Name every invited guest specifically on the invitation\n\nNeed help with seating arrangements?`,

      music: `More entertainment insights:\n\n**MC/Compere Hiring Tips:**\n• Watch **videos of their past events** — is their energy right for your crowd?\n• Meet them in person — chemistry matters\n• Share your itinerary and cultural requirements ahead of time\n• Great MCs keep energy high between band sets and manage transitions\n\n**Sound & Logistics:**\n• Outdoor venues need more powerful sound systems\n• Consider **noise ordinances** in your area\n• Have a **backup playlist** in case of technical issues\n• Test the sound system **during setup**, not 5 minutes before\n\n**Special Moments:**\n• First dance song — rehearse it!\n• Father-daughter / mother-son dance\n• Money-spraying music — your band should know the classics\n• Bouquet/garter toss song\n\nWant suggestions for specific music genres or moments?`,

      decor: `More décor deep-dive:\n\n**Colour Palette Ideas for 2026:**\n• **Classic Elegance:** ivory + gold + blush\n• **Modern Luxe:** black + white + emerald green\n• **Afro-Chic:** burgundy + terracotta + gold\n• **Garden Party:** sage green + lavender + cream\n• **Royal:** navy + gold + deep red\n\n**DIY Décor Ideas:**\n• Eucalyptus or olive branch table runners\n• Custom neon sign ("Better Together," your hashtag)\n• Photo wall with polaroids of the couple\n• Donation-in-lieu-of-favours cards\n• Origami paper cranes as hanging décor\n\n**Questions to Ask Your Decorator:**\n1. Do you handle setup AND tear-down?\n2. What's included in the package vs. what costs extra?\n3. Can we see a 3D mock-up before the event?\n4. Do you provide linens, charger plates, candelabras?\n5. What's your cancellation/weather policy?\n\nWant help building a mood board?`,

      attire: `More attire details:\n\n**Dress Shopping Timeline:**\n• 9-12 months: Start browsing and trying on styles\n• 6-9 months: Order your dress (custom or off-the-rack)\n• 3-4 months: First fitting\n• 1-2 months: Second fitting / final alterations\n• 1 week: Final fitting and steam\n\n**Traditional Attire Guide:**\n• **Yoruba:** Aso oke (hand-woven fabric), gele (headtie), ipele\n• **Igbo:** George wrapper, coral beads, ichafu (headtie)\n• **Hausa:** Heavy lace or shadda, henna designs\n• Order traditional fabrics **3-4 months** ahead\n\n**Emergency Kit Musts:**\n• Fashion tape, safety pins, stain remover pen\n• Sewing kit (needle, thread matching your dress)\n• Comfortable flats for dancing\n• Touch-up makeup and blotting sheets\n\nWant recommendations for bridal designers or stylists?`,

      planning: `More planning details:\n\n**Choosing a Wedding Planner:**\n• **Full-service:** handles everything from start to finish (₦500K-₦2M+)\n• **Partial planning:** you handle some, they handle the rest\n• **Day-of coordinator:** focuses on the actual wedding day logistics (₦150K-₦500K)\n\n**Questions to Ask Planners:**\n1. How many weddings do you do per weekend?\n2. Can I see a full portfolio of recent weddings?\n3. What happens if you're sick on my wedding day?\n4. How do you handle vendor relationships and issues?\n5. What's your communication style and response time?\n\n**Stress-Reduction Tips:**\n• Delegate — you don't have to do everything yourself\n• Set boundaries with family opinions\n• Keep a shared Google Doc/Sheet with your partner\n• Take breaks from planning — it's meant to be fun!\n• Remember: **done is better than perfect**\n\nWant a personalised planning timeline for your wedding date?`,

      cultural: `More cultural details:\n\n**Cross-Cultural Wedding Tips:**\n• Meet with both families early to discuss expectations\n• Identify which traditions are **must-haves** vs. **nice-to-haves**\n• Consider a multi-day celebration to honour both cultures\n• Hire a planner experienced in your specific cultural needs\n• Create a **program guide** explaining traditions for all guests\n\n**Legal Requirements in Nigeria:**\n• Marriage under the Marriage Act (court/registry) OR\n• Marriage under Customary Law OR\n• Marriage under Islamic Law\n• Statutory marriage requires: sworn affidavit, birth certificate, passport photos, marriage licence\n• Apply at least **21 days** before the wedding date\n\n**Modern Twists on Traditions:**\n• Incorporate traditional elements into the white wedding\n• Fusion food (Nigerian + international cuisine)\n• Bilingual vows or ceremony program\n• Cultural fashion with modern silhouettes\n\nWant info about a specific ethnic or religious tradition?`,
    }

    return followUps[topic] ?? KNOWLEDGE_BASE[topic] ?? KNOWLEDGE_BASE.default
  }

  private generateClarificationResponse(topScores: TopicScore[]): string {
    const topicLabels: Record<string, string> = {
      budget: '💰 Budget & Costs',
      venue: '🏛️ Venue Selection',
      photography: '📸 Photography & Video',
      catering: '🍽️ Catering & Food',
      timeline: '⏰ Timeline & Schedule',
      guest: '👥 Guest Management',
      music: '🎵 Music & Entertainment',
      decor: '🌸 Décor & Styling',
      attire: '👗 Attire & Beauty',
      planning: '📋 Wedding Planning',
      cultural: '🎭 Cultural Traditions',
    }

    const options = topScores
      .map(s => topicLabels[s.topic] ?? s.topic)
      .filter(Boolean)
      .join('\n• ')

    return `I think you might be asking about one of these topics:\n\n• ${options}\n\nCould you be more specific? For example:\n• *"How should I allocate my wedding budget?"*\n• *"What should I look for in a venue?"*\n• *"Tips for wedding photography?"*\n\nThe more detail you give, the better I can help!`
  }

  private blendResponses(topic1: string, topic2: string): string {
    const r1 = KNOWLEDGE_BASE[topic1]
    const r2 = KNOWLEDGE_BASE[topic2]

    if (!r1 || !r2) return KNOWLEDGE_BASE[topic1] ?? KNOWLEDGE_BASE.default

    // Take the first ~60% of each response
    const lines1 = r1.split('\n')
    const lines2 = r2.split('\n')
    const cut1 = Math.ceil(lines1.length * 0.6)
    const cut2 = Math.ceil(lines2.length * 0.6)

    const topicLabels: Record<string, string> = {
      budget: 'Budget', venue: 'Venue', photography: 'Photography',
      catering: 'Catering', timeline: 'Timeline', guest: 'Guest Management',
      music: 'Music', decor: 'Décor', attire: 'Attire',
      planning: 'Planning', cultural: 'Cultural Traditions',
    }

    return `Great question! It touches on both **${topicLabels[topic1]}** and **${topicLabels[topic2]}**. Let me cover both:\n\n` +
      `**— ${topicLabels[topic1]} —**\n${lines1.slice(0, cut1).join('\n')}\n\n` +
      `**— ${topicLabels[topic2]} —**\n${lines2.slice(0, cut2).join('\n')}\n\n` +
      `Want me to go deeper on either topic? Just ask!`
  }
}

/* ═══════════════════════════════════════════════════════════════
   SINGLETON EXPORT
   ═══════════════════════════════════════════════════════════════ */

export const askWedEngine = new AskWedEngine()
export default askWedEngine
