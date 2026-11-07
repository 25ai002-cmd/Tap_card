import React from 'react';
import { X, Star } from 'lucide-react';

export const VideoPlayerModal = ({ review, onClose }) => {
  if (!review || !review.videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player */}
        <div className="w-full bg-black aspect-video relative flex items-center justify-center">
          <video
            src={review.videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Review Context Information */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{review.customerName}</h4>
              <p className="text-xs text-slate-500">{review.role || "Customer"}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(review.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-600 italic">
            "{review.title} — {review.content ? review.content.slice(0, 160) : ''}..."
          </p>
        </div>

      </div>
    </div>
  );
};
