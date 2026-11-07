import React, { useState } from 'react';
import { Star, Video, Play, MessageSquarePlus, CheckCircle, ThumbsUp, Sparkles, Filter, MessageSquare, Award } from 'lucide-react';

export const ReviewsSection = ({ reviews, onOpenReviewModal, onPlayVideo }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'video' | '5' | '4'
  const [likedReviews, setLikedReviews] = useState({});

  // Filter logic
  const filteredReviews = reviews.filter((r) => {
    if (filter === 'video') return !!r.videoUrl;
    if (filter === '5') return r.rating === 5;
    if (filter === '4') return r.rating === 4;
    return true;
  });

  // Calculate statistics
  const totalCount = reviews.length;
  const averageRating = totalCount > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : "5.0";
  const videoCount = reviews.filter(r => !!r.videoUrl).length;

  const toggleLike = (id) => {
    setLikedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] bg-amber-100/25 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Stats & Add Review CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/90 text-sky-800 text-xs font-mono font-bold mb-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Verified Customer Feedback & Video Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Customer Reviews & Ratings
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
              Real reviews and unboxing videos submitted directly by our customers. See how Tap Card elevates every interaction.
            </p>
          </div>

          {/* Quick Rating Summary & Write Review Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
            {totalCount > 0 ? (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center gap-3.5">
                <div className="text-2xl font-black font-heading text-slate-900">{averageRating}</div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{totalCount} Customer Reviews ({videoCount} Videos)</p>
                </div>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-700 font-semibold shadow-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>100% Verified Customer Feedback</span>
              </div>
            )}

            <button
              onClick={onOpenReviewModal}
              className="glass-button-primary w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-md"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write Review / Add Video</span>
            </button>
          </div>
        </div>

        {/* When Reviews Exist: Filters & Cards */}
        {totalCount > 0 ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setFilter('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filter === 'video'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Testimonials ({videoCount})</span>
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-slate-200/90 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Header: Customer Name & Verified Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{rev.customerName}</h4>
                        <p className="text-[11px] text-slate-500">{rev.company || rev.role || "Verified Customer"}</p>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                        {rev.title}
                      </h5>
                    )}

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{rev.content || rev.reviewText || rev.comment || ""}"
                    </p>

                    {/* Image Attachment if exists */}
                    {rev.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={rev.imageUrl} 
                          alt="Review attachment" 
                          className="w-full max-h-48 object-cover rounded-2xl border border-slate-200/80 shadow-sm" 
                        />
                      </div>
                    )}

                    {/* Video Attachment if exists */}
                    {rev.videoUrl && (
                      <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                          <span>Video Testimonial</span>
                        </div>
                        <button
                          onClick={() => onPlayVideo(rev)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                          Play
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rev.date || "Recent"}</span>
                    <button
                      onClick={() => toggleLike(rev.id)}
                      className={`flex items-center gap-1.5 transition-colors font-medium ${
                        likedReviews[rev.id] ? 'text-sky-600 font-bold' : 'hover:text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{likedReviews[rev.id] ? 'Helpful (1)' : 'Helpful'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="glass-panel p-12 sm:p-14 rounded-3xl border border-slate-200/90 text-center max-w-2xl mx-auto space-y-5 shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
                Authentic Customer Reviews
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                We maintain complete transparency with 100% genuine reviews. As custom smart cards are received, verified ratings and unboxing video testimonials appear here.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenReviewModal}
                className="glass-button-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white inline-flex items-center gap-2 shadow-md"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Be the First to Leave a Review & Video</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
