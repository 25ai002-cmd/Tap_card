import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Video, Image, Upload, CheckCircle, Trash2, Lock } from 'lucide-react';
import { storage } from '../services/storage';

export const ReviewModal = ({ isOpen, onClose, currentUser, onRequireLogin }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [role, setRole] = useState(currentUser?.company || "");
  const [cardType, setCardType] = useState("Google 5-Star Review Tap Card");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Media states
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || "");
      if (!customerEmail) setCustomerEmail(currentUser.email || "");
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle Video File Upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Video file is large (>15MB). For fastest browser loading, please use a shorter clip (<15MB) or enter a video URL below.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setVideoFile(file);
    }
  };

  // Handle Image File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImagePreview("");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setVideoPreview("");
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // STRICT CHECK: User must be authenticated to submit reviews!
    if (!currentUser) {
      onRequireLogin('review');
      return;
    }

    if (!customerEmail || !customerName) {
      alert("Please enter your name and email to submit a review.");
      return;
    }
    if (!title || !content) {
      alert("Please provide a review title and your feedback.");
      return;
    }

    setSubmitting(true);
    const finalVideoUrl = videoPreview || videoUrlInput.trim();

    try {
      await storage.addReview({
        customerName: currentUser.name || customerName,
        customerEmail: currentUser.email || customerEmail,
        role: role || "Verified Customer",
        company: role || "Verified Customer",
        rating,
        title,
        content,
        reviewText: content,
        cardType,
        videoUrl: finalVideoUrl,
        videoType: videoPreview ? 'file' : (videoUrlInput ? 'url' : ''),
        imageUrl: imagePreview,
      });

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Could not submit review: ' + (err.message || 'Storage error'));
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto glass-panel rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-slate-200/90 shadow-2xl bg-white"
      >
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-slate-900">Review Submitted!</h3>
            <p className="text-sm text-slate-600">
              Thank you for sharing your experience and rating our cards. Your review is now live!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <h3 className="text-2xl font-bold font-heading text-slate-900">
                Rate & Review Tap Card
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your experience, rate our hardware, and upload an unboxing or demo video.
              </p>
            </div>

            {/* Authentication Required Warning */}
            {!currentUser && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>You must be signed in with your email to submit a review.</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRequireLogin('review')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px]"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-xs font-semibold text-slate-700 mb-2">Overall Rating *</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-700 mt-1.5 font-medium">
                {rating === 5 && "⭐ Excellent - Exceeded expectations!"}
                {rating === 4 && "⭐ Great - Very satisfied!"}
                {rating === 3 && "⭐ Good - Met expectations"}
                {rating === 2 && "Fair - Needs improvement"}
                {rating === 1 && "Poor - Unsatisfied"}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer Email (Verified) *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  required
                  disabled={!!currentUser?.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Business / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Founder, Salon Luxe"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Card Solution Purchased</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-white"
                >
                  <option value="Google 5-Star Review Tap Card">Google 5-Star Review Tap Card</option>
                  <option value="Digital Portfolio & Creative Showcase Card">Digital Portfolio & Creative Showcase Card</option>
                  <option value="Social Hub & Smart Business Card">Social Hub & Smart Business Card</option>
                  <option value="Custom Enterprise Smart Card Solutions">Custom Enterprise Smart Card Solutions</option>
                </select>
              </div>
            </div>

            {/* Review Title & Content */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Review Headline *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Boosted our Google ratings in week one!"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Review *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us how the card helped your business or workflow..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none h-24"
                required
              />
            </div>

            {/* Media Upload Section: Video & Photo */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-sky-600" />
                  <span>Attach Video Testimonial (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">MP4, WebM, MOV</span>
              </div>

              {/* Video File Picker or Direct URL */}
              {videoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-black aspect-video max-h-48 flex items-center justify-center">
                  <video src={videoPreview} controls className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Video</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      videoInputRef.current?.click();
                    }}
                    className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 hover:border-sky-500 rounded-xl cursor-pointer bg-white transition-colors"
                  >
                    <Upload className="w-5 h-5 text-sky-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Click to upload customer video file</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Short customer video or unboxing demo</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">or paste video url</span>
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://... (direct video mp4 or cloud link)"
                      className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-700 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-sky-600" />
                  <span>Attach Photo with your Card</span>
                </span>
                
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-slate-300" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      photoInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs text-slate-700 cursor-pointer shadow-sm transition-colors"
                  >
                    Upload Photo
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {currentUser ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full glass-button-primary py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md"
                >
                  {submitting ? 'Submitting Review...' : 'Publish Customer Review'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequireLogin('review')}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In with Google or Email to Post Review</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
