import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ─── */
type HashtagStyle = 'classic' | 'playful' | 'elegant' | 'punny' | 'cultural';

interface GeneratedHashtag {
  tag: string;
  style: HashtagStyle;
  copied: boolean;
}

/* ─── Style metadata ─── */
const STYLE_META: Record<HashtagStyle, { label: string; icon: string; color: string; bg: string }> = {
  classic:  { label: 'Classic',  icon: '💍', color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200' },
  playful:  { label: 'Playful',  icon: '🎉', color: 'text-pink-600',   bg: 'bg-pink-50   border-pink-200' },
  elegant:  { label: 'Elegant',  icon: '✨', color: 'text-violet-700', bg: 'bg-violet-50  border-violet-200' },
  punny:    { label: 'Punny',    icon: '😄', color: 'text-teal-700',   bg: 'bg-teal-50   border-teal-200' },
  cultural: { label: 'Cultural', icon: '🌍', color: 'text-orange-700', bg: 'bg-orange-50  border-orange-200' },
};

/* ─── Hashtag engine ─── */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const camel = (a: string, b: string) => capitalize(a) + capitalize(b);

function blendNames(a: string, b: string): string[] {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  const blends: string[] = [];
  // Try overlapping syllable merge (e.g. Brad + Angelina → Brangelina)
  for (let i = 1; i < al.length; i++) {
    for (let j = 0; j < bl.length - 1; j++) {
      if (al.slice(i).charAt(0) === bl.charAt(j) || (i >= al.length - 2 && j <= 2)) {
        const blend = capitalize(al.slice(0, i) + bl.slice(j));
        if (blend.length >= 4 && blend.length <= 14 && blend !== capitalize(al) && blend !== capitalize(bl)) {
          blends.push(blend);
        }
      }
    }
  }
  // Simple half-merge fallback
  const half1 = al.slice(0, Math.ceil(al.length / 2));
  const half2 = bl.slice(Math.floor(bl.length / 2));
  blends.push(capitalize(half1 + half2));
  const half1b = bl.slice(0, Math.ceil(bl.length / 2));
  const half2b = al.slice(Math.floor(al.length / 2));
  blends.push(capitalize(half1b + half2b));
  // Deduplicate
  return [...new Set(blends)].slice(0, 3);
}

function rhymeVariants(name: string): string[] {
  const suffixes = ['ingly', 'icious', 'tastic', 'mania', 'palooza', 'fest', 'licious'];
  const base = name.toLowerCase().slice(0, Math.min(name.length, 5));
  return suffixes.map(s => capitalize(base + s)).slice(0, 2);
}

function generateEngine(name1: string, name2: string): GeneratedHashtag[] {
  const a = capitalize(name1.trim());
  const b = capitalize(name2.trim());
  const hasTwo = !!name2.trim();
  const year = new Date().getFullYear();

  const tags: GeneratedHashtag[] = [];
  const add = (tag: string, style: HashtagStyle) => {
    const clean = '#' + tag.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length > 2 && !tags.some(t => t.tag.toLowerCase() === clean.toLowerCase())) {
      tags.push({ tag: clean, style, copied: false });
    }
  };

  if (hasTwo) {
    // ─── Classic ───
    add(`${a}And${b}Forever`, 'classic');
    add(`The${b}sWedding`, 'classic');
    add(`${a}Meets${b}`, 'classic');
    add(`${camel(a, b)}${year}`, 'classic');
    add(`HappilyEver${b}`, 'classic');
    add(`${a}Says${b}IDo`, 'classic');

    // ─── Playful ───
    add(`${a}Got${b}d`, 'playful');
    add(`Officially${camel(a, b)}`, 'playful');
    add(`${a}Plus${b}`, 'playful');
    add(`MarriedAF${a}${b}`, 'playful');
    add(`NoMore${a}SingleLife`, 'playful');
    rhymeVariants(a).forEach(r => add(`${r}With${b}`, 'playful'));

    // ─── Elegant ───
    add(`AMomentOf${camel(a, b)}`, 'elegant');
    add(`Forever${a}And${b}`, 'elegant');
    add(`${a}${b}Aisle`, 'elegant');
    add(`TwoBecomeOne${a}${b}`, 'elegant');
    add(`${a}And${b}SealedWithAKiss`, 'elegant');
    add(`EternallyYours${camel(a, b)}`, 'elegant');

    // ─── Punny ───
    const blends = blendNames(name1, name2);
    blends.forEach(bl => {
      add(`${bl}IsHappening`, 'punny');
      add(`${bl}Forever`, 'punny');
    });
    add(`${a}llyInLoveWith${b}`, 'punny');
    add(`${b}terHalf${a}`, 'punny');
    add(`Mint2${b}e${a}`, 'punny');
    add(`Aisle${b}There${a}`, 'punny');

    // ─── Cultural ───
    add(`${a}And${b}Jollof`, 'cultural');
    add(`Owanbe${camel(a, b)}`, 'cultural');
    add(`${a}${b}SayWeeDo`, 'cultural');
    add(`LoveNwantiti${a}${b}`, 'cultural');
    add(`${a}And${b}TieTheGele`, 'cultural');
    add(`${camel(a, b)}Asoebi`, 'cultural');
  } else {
    // Single name mode
    add(`${a}SaysIDo`, 'classic');
    add(`The${a}Wedding`, 'classic');
    add(`${a}IsGettingMarried`, 'classic');
    add(`HappilyEver${a}`, 'classic');
    add(`${a}TiedTheKnot`, 'classic');
    add(`ForeverMrs${a}`, 'classic');

    add(`${a}GoesOffTheMarket`, 'playful');
    add(`Party${a}Style`, 'playful');
    add(`${a}Palooza${year}`, 'playful');
    rhymeVariants(a).forEach(r => add(r, 'playful'));

    add(`AMomentOf${a}`, 'elegant');
    add(`Eternally${a}`, 'elegant');
    add(`${a}SealedWithAKiss`, 'elegant');
    add(`${a}EverAfter`, 'elegant');

    add(`${a}llyCommitted`, 'punny');
    add(`Love${a}dIt`, 'punny');
    add(`${a}ingItDown`, 'punny');

    add(`Owanbe${a}`, 'cultural');
    add(`${a}Jollof`, 'cultural');
    add(`${a}Asoebi`, 'cultural');
  }

  return tags;
}

/* ─── Component ─── */
const WeddingHashtags: React.FC = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [hashtags, setHashtags] = useState<GeneratedHashtag[]>([]);
  const [activeStyle, setActiveStyle] = useState<HashtagStyle | 'all'>('all');
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(() => {
    if (!name1.trim()) return;
    const results = generateEngine(name1, name2);
    setHashtags(results);
    setActiveStyle('all');
    setHasGenerated(true);
  }, [name1, name2]);

  const copyTag = useCallback((index: number) => {
    const tag = hashtags[index];
    navigator.clipboard.writeText(tag.tag).then(() => {
      setHashtags(prev => prev.map((h, i) => i === index ? { ...h, copied: true } : h));
      setTimeout(() => {
        setHashtags(prev => prev.map((h, i) => i === index ? { ...h, copied: false } : h));
      }, 2000);
    });
  }, [hashtags]);

  const copyAll = useCallback(() => {
    const filtered = filteredTags.map(t => t.tag).join('\n');
    navigator.clipboard.writeText(filtered);
  }, [hashtags, activeStyle]);

  const filteredTags = activeStyle === 'all' ? hashtags : hashtags.filter(h => h.style === activeStyle);

  const styleCounts = hashtags.reduce((acc, h) => {
    acc[h.style] = (acc[h.style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <footer className="bg-gradient-to-b from-rose-50/50 via-white to-blush-50/30 py-16 px-4 sm:px-6">
      {/* ─── Love Story Timeline ─── */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="text-center font-primary2 text-2xl sm:text-3xl font-light tracking-wide text-gray-800 mb-12">
          Your Love Story Continues...
        </h3>
        <div className="relative h-28 sm:h-32">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blush-200 via-rose-300 to-blush-200 transform -translate-y-1/2" />
          {[
            { icon: '💑', label: 'Met' },
            { icon: '💍', label: 'Engaged' },
            { icon: '🏛️', label: 'Venue' },
            { icon: '👰', label: 'Wedding' },
            { icon: '🌴', label: 'Honeymoon' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
              viewport={{ once: true }}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${10 + i * 20}%` }}
            >
              <div className="relative group -translate-x-1/2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white border-2 border-blush-300 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-default">
                  {item.icon}
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Hashtag Generator ─── */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.2em] text-blush-400 font-semibold mb-2"
          >
            Hashtag Studio
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            viewport={{ once: true }}
            className="font-primary2 text-2xl sm:text-3xl font-semibold text-gray-900"
          >
            Create Your Wedding Hashtag
          </motion.h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Enter one or both names to generate unique, creative hashtags across 5 different styles.
          </p>
        </div>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Partner 1 *</label>
              <input
                type="text"
                placeholder="e.g.  Tunde"
                value={name1}
                onChange={e => setName1(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Partner 2 <span className="text-gray-300 font-normal">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g.  Aisha"
                value={name2}
                onChange={e => setName2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-300"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={!name1.trim()}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm tracking-wide hover:bg-[#006d75] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {hasGenerated ? '✨ Regenerate Hashtags' : '✨ Generate Hashtags'}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasGenerated && hashtags.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Style filter pills */}
              <div className="flex flex-wrap items-center gap-2 justify-center">
                <button
                  onClick={() => setActiveStyle('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeStyle === 'all'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({hashtags.length})
                </button>
                {(Object.keys(STYLE_META) as HashtagStyle[]).map(style => (
                  styleCounts[style] ? (
                    <button
                      key={style}
                      onClick={() => setActiveStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        activeStyle === style
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{STYLE_META[style].icon}</span>
                      {STYLE_META[style].label} ({styleCounts[style]})
                    </button>
                  ) : null
                ))}
              </div>

              {/* Copy all button */}
              <div className="flex justify-end">
                <button
                  onClick={copyAll}
                  className="text-xs text-primary font-medium hover:underline cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy all {activeStyle !== 'all' ? STYLE_META[activeStyle as HashtagStyle].label : ''} ({filteredTags.length})
                </button>
              </div>

              {/* Hashtag grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence>
                  {filteredTags.map((h, i) => {
                    const meta = STYLE_META[h.style];
                    return (
                      <motion.button
                        key={h.tag}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => copyTag(hashtags.indexOf(h))}
                        className={`group relative flex items-center gap-3 p-4 rounded-xl border ${meta.bg} hover:shadow-md active:scale-[0.97] transition-all cursor-pointer text-left`}
                      >
                        <span className="text-lg flex-shrink-0">{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${meta.color}`}>{h.tag}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{meta.label}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-all ${
                          h.copied
                            ? 'bg-green-100 text-green-600'
                            : 'bg-white/60 text-gray-400 opacity-0 group-hover:opacity-100'
                        }`}>
                          {h.copied ? '✓ Copied' : 'Copy'}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Tip */}
              <p className="text-center text-xs text-gray-400 pt-2">
                Click any hashtag to copy. Try different name combinations for more unique results!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default state — before generating */}
        {!hasGenerated && (
          <div className="text-center py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-6 opacity-50">
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-amber-50 border-amber-200">
                <span className="text-lg">💍</span>
                <p className="font-semibold text-sm text-amber-700">#JaneAndJohnForever</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-pink-50 border-pink-200">
                <span className="text-lg">🎉</span>
                <p className="font-semibold text-sm text-pink-600">#OfficiallyJohn</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Enter your names above to unlock <span className="font-semibold text-primary">20+ unique hashtags</span> across 5 creative styles.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default WeddingHashtags;