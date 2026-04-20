/**
 * AskWed AI Engine — Automated Test Suite
 * ────────────────────────────────────────
 * Comprehensive tests for the AskWed NLP engine covering:
 *  - Input validation
 *  - Topic classification accuracy
 *  - Confidence scoring
 *  - Fuzzy matching
 *  - Multi-topic detection
 *  - Follow-up context tracking
 *  - Intent detection (greetings, gratitude, etc.)
 *  - Edge cases and regression tests
 *
 * Run:  npx tsx src/lib/__tests__/askwed-engine.test.ts
 * Or:   npx vitest run src/lib/__tests__/askwed-engine.test.ts
 */

import {
  AskWedEngine,
  normaliseInput,
  validateInput,
  scoreTopics,
  classifyConfidence,
} from '../askwed-engine'

/* ═════════════════════════════════════════════════════════════
   LIGHTWEIGHT TEST RUNNER (zero-dep, works without vitest too)
   ═════════════════════════════════════════════════════════════ */

interface TestResult {
  name: string
  passed: boolean
  error?: string
}

const results: TestResult[] = []
let currentSuite = ''

function describe(name: string, fn: () => void) {
  currentSuite = name
  fn()
}

function it(name: string, fn: () => void) {
  const fullName = `${currentSuite} > ${name}`
  try {
    fn()
    results.push({ name: fullName, passed: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e)
    results.push({ name: fullName, passed: false, error })
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    },
    toBeGreaterThan(n: number) {
      if (typeof actual !== 'number' || actual <= n) throw new Error(`Expected ${actual} > ${n}`)
    },
    toBeGreaterThanOrEqual(n: number) {
      if (typeof actual !== 'number' || actual < n) throw new Error(`Expected ${actual} >= ${n}`)
    },
    toBeLessThan(n: number) {
      if (typeof actual !== 'number' || actual >= n) throw new Error(`Expected ${actual} < ${n}`)
    },
    toContain(substr: string) {
      if (typeof actual !== 'string' || !actual.includes(substr)) throw new Error(`Expected string to contain "${substr}"`)
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`)
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`)
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    },
  }
}

/* ═════════════════════════════════════════════════════════════
   TEST SUITES
   ═════════════════════════════════════════════════════════════ */

// ────────── Input Validation ──────────
describe('Input Validation', () => {
  it('rejects empty input', () => {
    expect(validateInput('').valid).toBe(false)
    expect(validateInput('   ').valid).toBe(false)
  })

  it('rejects too-short input', () => {
    expect(validateInput('a').valid).toBe(false)
  })

  it('rejects too-long input', () => {
    expect(validateInput('x'.repeat(2001)).valid).toBe(false)
  })

  it('accepts valid input', () => {
    expect(validateInput('How much does a wedding cost?').valid).toBe(true)
    expect(validateInput('Hi').valid).toBe(true)
  })

  it('rejects pure gibberish (no vowels)', () => {
    expect(validateInput('xnfth krplm bzdvw').valid).toBe(false)
  })
})

// ────────── Input Normalisation ──────────
describe('Input Normalisation', () => {
  it('lowercases input', () => {
    expect(normaliseInput('BUDGET TIPS')).toBe('budget tips')
  })

  it('trims whitespace', () => {
    expect(normaliseInput('  hello  ')).toBe('hello')
  })

  it('collapses multiple spaces', () => {
    expect(normaliseInput('wedding   venue   tips')).toBe('wedding venue tips')
  })

  it('normalises smart quotes', () => {
    const result = normaliseInput('\u201CHello\u201D')
    // Smart quotes (U+201C, U+201D) should be replaced with straight quotes
    expect(result).toBe('"hello"')
  })
})

// ────────── Topic Scoring ──────────
describe('Topic Scoring', () => {
  it('scores "budget" query correctly', () => {
    const scores = scoreTopics('How should I allocate my wedding budget?')
    expect(scores[0].topic).toBe('budget')
    expect(scores[0].score).toBeGreaterThan(0)
  })

  it('scores "venue" query correctly', () => {
    const scores = scoreTopics('What should I look for when choosing a venue?')
    expect(scores[0].topic).toBe('venue')
  })

  it('scores "photography" query correctly', () => {
    const scores = scoreTopics('Tips for choosing a wedding photographer?')
    expect(scores[0].topic).toBe('photography')
  })

  it('scores "catering" query correctly', () => {
    const scores = scoreTopics('What should I consider for wedding catering and food?')
    expect(scores[0].topic).toBe('catering')
  })

  it('scores "timeline" query correctly', () => {
    const scores = scoreTopics('What does a typical wedding day timeline look like?')
    expect(scores[0].topic).toBe('timeline')
  })

  it('scores "guest" query correctly', () => {
    const scores = scoreTopics('How do I manage my wedding guest list and RSVPs?')
    expect(scores[0].topic).toBe('guest')
  })

  it('scores "music" query correctly', () => {
    const scores = scoreTopics('How do I plan wedding music and entertainment?')
    expect(scores[0].topic).toBe('music')
  })

  it('scores "decor" query correctly', () => {
    const scores = scoreTopics('What are current wedding décor trends and styling ideas?')
    expect(scores[0].topic).toBe('decor')
  })

  it('scores "attire" query correctly (new topic)', () => {
    const scores = scoreTopics('What kind of wedding dress should I choose?')
    expect(scores[0].topic).toBe('attire')
  })

  it('scores "planning" query correctly (new topic)', () => {
    const scores = scoreTopics('Where do I start with wedding planning?')
    expect(scores[0].topic).toBe('planning')
  })

  it('scores "cultural" query correctly (new topic)', () => {
    const scores = scoreTopics('Tell me about Yoruba traditional wedding customs')
    expect(scores[0].topic).toBe('cultural')
  })

  it('handles multi-keyword queries', () => {
    const scores = scoreTopics('I need help with budget and venue')
    // Both should appear
    const topics = scores.map(s => s.topic)
    expect(topics.includes('budget')).toBe(true)
    expect(topics.includes('venue')).toBe(true)
  })
})

// ────────── Fuzzy Matching ──────────
describe('Fuzzy Matching', () => {
  it('matches "buget" as budget (1 char typo)', () => {
    const scores = scoreTopics('How do I set my buget?')
    expect(scores[0].topic).toBe('budget')
  })

  it('matches "photografer" as photography', () => {
    const scores = scoreTopics('I need a photografer')
    expect(scores[0].topic).toBe('photography')
  })

  it('matches "decorations" as decor (alias)', () => {
    const scores = scoreTopics('I want beautiful decorations')
    expect(scores[0].topic).toBe('decor')
  })

  it('matches "caterer" as catering (alias)', () => {
    const scores = scoreTopics('How do I find a good caterer?')
    expect(scores[0].topic).toBe('catering')
  })
})

// ────────── Confidence Classification ──────────
describe('Confidence Classification', () => {
  it('returns high confidence for strong matches', () => {
    const result = classifyConfidence(50, 10)
    expect(result.level).toBe('high')
    expect(result.value).toBeGreaterThan(0.7)
  })

  it('returns medium confidence for moderate matches', () => {
    const result = classifyConfidence(15, 10)
    expect(result.level).toBe('medium')
  })

  it('returns none for zero scores', () => {
    const result = classifyConfidence(0, 0)
    expect(result.level).toBe('none')
    expect(result.value).toBe(0)
  })
})

// ────────── Engine: Full Query Processing ──────────
describe('Engine Query Processing', () => {
  const engine = new AskWedEngine()

  it('responds to budget query with relevant content', () => {
    const res = engine.processQuery('How much does a Nigerian wedding cost?')
    expect(res.topic).toBe('budget')
    expect(res.confidence).toBeGreaterThan(0.3)
    expect(res.text).toContain('Budget')
  })

  it('responds to venue query', () => {
    const res = engine.processQuery('I need to find a good wedding hall')
    expect(res.topic).toBe('venue')
    expect(res.text).toContain('venue')
  })

  it('falls back to default for unrelated queries', () => {
    engine.reset()
    const res = engine.processQuery('What is quantum computing?')
    // Should fall to default or clarification
    expect(res.confidence).toBeLessThan(0.5)
  })

  it('provides processing time metrics', () => {
    const res = engine.processQuery('venue tips')
    expect(res.processingTimeMs).toBeGreaterThanOrEqual(0)
  })
})

// ────────── Intent Detection ──────────
describe('Intent Detection', () => {
  const engine = new AskWedEngine()

  it('detects greetings', () => {
    const res = engine.processQuery('Hello!')
    expect(res.topic).toBe('greeting')
    expect(res.confidence).toBeGreaterThan(0.9)
  })

  it('detects gratitude', () => {
    const res = engine.processQuery('Thank you so much!')
    expect(res.topic).toBe('gratitude')
  })

  it('detects farewell', () => {
    const res = engine.processQuery('Bye, see you later!')
    expect(res.topic).toBe('farewell')
  })

  it('detects help requests', () => {
    const res = engine.processQuery('What can you do?')
    expect(res.topic).toBe('help')
  })
})

// ────────── Follow-Up Context ──────────
describe('Follow-Up Context Tracking', () => {
  it('tracks last topic for follow-ups', () => {
    const engine = new AskWedEngine()
    // First query sets lastTopic internally via processQuery
    const first = engine.processQuery('Tell me about wedding budgets')
    expect(first.topic).toBe('budget')

    // Follow-up should use last topic context
    const followUp = engine.processQuery('Tell me more')
    expect(followUp.topic).toBe('budget')
    // Should contain follow-up marker
    const hasFollowUp = followUp.matchedKeywords.some(k => k === 'follow-up')
    expect(hasFollowUp).toBe(true)
  })

  it('resets context on engine.reset()', () => {
    const engine = new AskWedEngine()
    engine.processQuery('Tell me about venues')

    engine.reset()
    const res = engine.processQuery('Tell me more')
    // Without context after reset, "tell me more" should NOT map to venue
    // It should hit default/greeting/help since there's no lastTopic
    expect(res.topic !== 'venue').toBe(true)
  })
})

// ────────── Multi-Topic Detection ──────────
describe('Multi-Topic Detection', () => {
  it('detects multiple topics in a query', () => {
    // Should detect both catering and decor in scoring
    const scores = scoreTopics('I need help with food catering and flowers decor for my wedding')
    const topics = scores.slice(0, 3).map(s => s.topic)
    expect(topics.includes('catering')).toBe(true)
    expect(topics.includes('decor')).toBe(true)
  })
})

// ────────── Edge Cases ──────────
describe('Edge Cases', () => {
  const engine = new AskWedEngine()

  it('handles empty input gracefully', () => {
    const res = engine.processQuery('')
    expect(res.topic).toBe('error')
    expect(res.confidence).toBe(0)
  })

  it('handles very long input', () => {
    const res = engine.processQuery('budget '.repeat(300))
    expect(res.topic).toBe('error') // too_long
  })

  it('handles special characters', () => {
    const res = engine.processQuery('How much ₦ for venue???!!!')
    expect(res.topic).toBe('budget') // ₦ is a budget keyword
  })

  it('handles unicode and emojis', () => {
    const res = engine.processQuery('I want beautiful flowers 🌸🌺')
    expect(res.topic).toBe('decor')
  })

  it('handles questions with only stopwords', () => {
    const res = engine.processQuery('the and or but if')
    // Should fall to default/clarification, not crash
    expect(res.text).toBeTruthy()
  })
})

// ────────── Nigerian-specific queries ──────────
describe('Nigerian Wedding Context', () => {
  const engine = new AskWedEngine()

  it('understands jollof rice as catering', () => {
    const res = engine.processQuery('We want jollof rice at our wedding')
    expect(res.topic).toBe('catering')
  })

  it('understands aso ebi as guest management', () => {
    const res = engine.processQuery('How do I coordinate aso ebi for all guests?')
    expect(res.topic).toBe('guest')
  })

  it('understands igba nkwu as cultural', () => {
    const res = engine.processQuery('Tell me about igba nkwu ceremony')
    expect(res.topic).toBe('cultural')
  })

  it('understands afrobeats as music', () => {
    const res = engine.processQuery('I want afrobeats and highlife music at my reception')
    expect(res.topic).toBe('music')
  })

  it('understands aso oke as attire or cultural', () => {
    const scores = scoreTopics('Where can I buy aso oke for my wedding?')
    const topics = scores.slice(0, 2).map(s => s.topic)
    const valid = topics.includes('attire') || topics.includes('cultural')
    expect(valid).toBe(true)
  })
})

// ────────── Baseline Response Accuracy ──────────
describe('Baseline Response Accuracy', () => {
  const engine = new AskWedEngine()

  const testCases = [
    { input: 'How should I allocate my wedding budget?', expectedTopic: 'budget' },
    { input: 'What does a typical wedding day timeline look like?', expectedTopic: 'timeline' },
    { input: 'What should I consider for wedding catering?', expectedTopic: 'catering' },
    { input: 'Tips for choosing a wedding photographer?', expectedTopic: 'photography' },
    { input: 'How do I plan wedding music and entertainment?', expectedTopic: 'music' },
    { input: 'What are current wedding décor trends?', expectedTopic: 'decor' },
    { input: 'How do I manage my wedding guest list?', expectedTopic: 'guest' },
    { input: 'What should I look for when choosing a venue?', expectedTopic: 'venue' },
    { input: 'What kind of dress should I wear?', expectedTopic: 'attire' },
    { input: 'How do I start planning my wedding?', expectedTopic: 'planning' },
    { input: 'Tell me about Nigerian traditional wedding customs', expectedTopic: 'cultural' },
    { input: 'I need a DJ for my reception', expectedTopic: 'music' },
    { input: 'Is a buffet or plated dinner better?', expectedTopic: 'catering' },
    { input: 'How many people can this hall fit?', expectedTopic: 'venue' },
    { input: 'What are bridesmaid dress options?', expectedTopic: 'attire' },
  ]

  for (const tc of testCases) {
    it(`classifies "${tc.input}" as ${tc.expectedTopic}`, () => {
      const res = engine.processQuery(tc.input)
      expect(res.topic).toBe(tc.expectedTopic)
    })
  }
})

/* ═════════════════════════════════════════════════════════════
   RUN & REPORT
   ═════════════════════════════════════════════════════════════ */

const passed = results.filter(r => r.passed).length
const failed = results.filter(r => !r.passed).length
const total = results.length
const accuracy = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'

console.log('\n═══════════════════════════════════════════')
console.log('  AskWed AI Engine — Test Report')
console.log('═══════════════════════════════════════════\n')

for (const r of results) {
  const icon = r.passed ? '✅' : '❌'
  console.log(`${icon} ${r.name}`)
  if (!r.passed) console.log(`   → ${r.error}`)
}

console.log('\n───────────────────────────────────────────')
console.log(`  Total: ${total}  |  Passed: ${passed}  |  Failed: ${failed}  |  Accuracy: ${accuracy}%`)
console.log('───────────────────────────────────────────\n')

if (failed > 0) {
  console.log('⚠️  Some tests failed. Review failures above.\n')
  process.exit(1)
} else {
  console.log('🎉 All tests passed!\n')
}
