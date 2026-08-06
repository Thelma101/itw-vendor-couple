import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import clsx from 'clsx';
import { Star, Reply, ThumbUp, Verified, FormatQuote, Share, Lock, Shield } from '@mui/icons-material';

interface Review {
  id: string;
  reviewerName: string;
  isVerified: boolean;
  rating: number;
  date: string;
  content: string;
  status: 'Published' | 'Pending Review' | 'Disputed';
  hasReplied: boolean;
  replyContent?: string;
  isMasked: boolean; // Privacy control
}

const initialReviews: Review[] = [
  { id: '1', reviewerName: 'Samuel & Jane', isVerified: true, rating: 5, date: 'Oct 15, 2026', content: 'Absolutely phenomenal service! The photos came out looking like a magazine. Highly recommend Sito Graphix!', status: 'Published', hasReplied: true, replyContent: 'Thank you so much! It was a joy working with you both.', isMasked: false },
  { id: '2', reviewerName: 'Anonymous Client', isVerified: true, rating: 4, date: 'Sep 28, 2026', content: 'Great service overall, but they arrived slightly late due to traffic. The final output made up for it though!', status: 'Published', hasReplied: false, isMasked: true },
  { id: '3', reviewerName: 'Customer #3324', isVerified: false, rating: 2, date: 'Sep 10, 2026', content: 'Communication was poor leading up to the event.', status: 'Pending Review', hasReplied: false, isMasked: true },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState('All');
  const [replyIndex, setReplyIndex] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const submitReply = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, hasReplied: true, replyContent: replyText } : r));
    setReplyIndex(null);
    setReplyText('');
  };

  const filteredReviews = activeTab === 'All' ? reviews : reviews.filter(r => r.status === activeTab);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Client Reviews</h1>
          <div className="flex items-center text-slate-500 mt-1 space-x-2 text-sm md:text-base">
            <Shield fontSize="small" className="text-teal-600" />
            <p>Customer data is protected per our privacy policy.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <VendorCard className="flex flex-col justify-center items-center p-6 text-center">
          <div className="text-4xl font-extrabold text-slate-800">4.8</div>
          <div className="flex text-amber-400 my-2">
            {[1,2,3,4,5].map(i => <Star key={i} fontSize="small" />)}
          </div>
          <div className="text-slate-500 text-sm font-medium">Average Rating</div>
        </VendorCard>
        <VendorCard className="flex flex-col justify-center items-center p-6 text-center">
          <div className="text-4xl font-extrabold text-teal-600">124</div>
          <div className="text-slate-500 text-sm font-medium mt-2">Total Reviews</div>
        </VendorCard>
        <VendorCard className="flex flex-col justify-center items-center p-6 text-center">
          <div className="text-4xl font-extrabold text-blue-600">92%</div>
          <div className="text-slate-500 text-sm font-medium mt-2">Rebooking Rate</div>
        </VendorCard>
      </div>

      <VendorCard noPadding className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex overflow-x-auto custom-scrollbar bg-slate-50/50 space-x-2">
          {['All', 'Published', 'Pending Review', 'Disputed'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                activeTab === tab ? "bg-teal-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {filteredReviews.map(review => (
            <div key={review.id} className="p-5 md:p-6 lg:p-8 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <FormatQuote className="text-slate-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={clsx("font-bold text-lg", review.isMasked ? "text-slate-500 italic" : "text-slate-800")}>
                        {review.reviewerName}
                      </h3>
                      {review.isMasked && (
                        <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-500">
                          <Lock fontSize="inherit" />
                          <span>Protected</span>
                        </span>
                      )}
                      {review.isVerified && (
                        <span className="flex items-center space-x-1 text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md text-xs font-bold">
                          <Verified fontSize="small" className="w-3.5 h-3.5" />
                          <span>Verified Booking</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-500 mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fontSize="small" className={i < review.rating ? "text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{review.date}</span>
                      <span>•</span>
                      <span className={clsx(
                        review.status === 'Published' ? "text-emerald-600" : "text-amber-600"
                      )}>{review.status}</span>
                    </div>
                    <p className="text-slate-600 font-sans leading-relaxed text-sm md:text-base">{review.content}</p>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end space-x-3 md:space-x-0 md:space-y-2 shrink-0">
                  <button className="flex items-center space-x-1 text-slate-400 hover:text-teal-600 text-sm font-semibold transition-colors">
                    <ThumbUp fontSize="small" className="w-4 h-4" />
                    <span>Helpful</span>
                  </button>
                  <button className="flex items-center space-x-1 text-slate-400 hover:text-teal-600 text-sm font-semibold transition-colors">
                    <Share fontSize="small" className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {review.hasReplied && review.replyContent ? (
                <div className="mt-5 ml-0 md:ml-16 bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-slate-50 border-l border-t border-slate-100 rotate-[-45deg]" />
                  <div className="flex items-center space-x-2 text-sm font-bold text-slate-800 mb-1">
                    <Reply fontSize="small" className="text-teal-600 scale-x-[-1]" />
                    <span>Your Reply</span>
                  </div>
                  <p className="text-slate-600 text-sm pl-6">{review.replyContent}</p>
                </div>
              ) : (
                <div className="mt-5 ml-0 md:ml-16">
                  {replyIndex === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        autoFocus
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write your professional response..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 text-sm font-sans resize-none"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button onClick={() => submitReply(review.id)} className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700">Submit Reply</button>
                        <button onClick={() => setReplyIndex(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReplyIndex(review.id)}
                      className="text-teal-600 text-sm font-bold hover:underline flex items-center space-x-1"
                    >
                      <Reply fontSize="small" className="scale-x-[-1]" />
                      <span>Reply to this review</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </VendorCard>
    </div>
  );
}
