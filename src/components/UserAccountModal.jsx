import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, LogOut, Package, Clock, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { storage } from '../services/storage';

export const UserAccountModal = ({ isOpen, onClose, user, onLogout }) => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (isOpen && user?.email) {
      setInquiries(storage.getUserInquiries(user.email));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-slate-200 shadow-2xl text-left max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 truncate">{user.name || 'Member'}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Account Security: {user.provider === 'google' ? 'Google OAuth 2.0 Protected' : 'Private Email & 256-bit Password Protected'}
            </p>
          </div>
        </div>

        {/* Private Inquiries / Quotes Section */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-sky-600" />
              <span>My Private Card Quotes & Orders ({inquiries.length})</span>
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Private to your login
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No quotes requested yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                When you design a card or submit a quote request, your digital proofs and private pricing will appear here safely.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => {
                const dateStr = inq.date ? new Date(inq.date).toLocaleDateString() : 'Recent';
                const statusColors = {
                  new: 'bg-amber-50 text-amber-700 border-amber-200',
                  contacted: 'bg-sky-50 text-sky-700 border-sky-200',
                  in_production: 'bg-purple-50 text-purple-700 border-purple-200',
                  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                };
                const statusLabels = {
                  new: 'Proof Pending',
                  contacted: 'Quote Prepared',
                  in_production: 'In Production',
                  completed: 'Delivered'
                };

                return (
                  <div
                    key={inq.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{inq.cardType}</h5>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {inq.quantity} Cards · Finish: <span className="font-medium text-slate-700">{inq.material || 'Standard'}</span>
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[inq.status] || statusColors.new}`}>
                        {statusLabels[inq.status] || 'Submitted'}
                      </span>
                    </div>

                    {inq.targetUrl && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl truncate">
                        <span className="font-semibold text-slate-700">Destination:</span> {inq.targetUrl}
                      </p>
                    )}

                    {inq.customNotes && (
                      <p className="mt-1.5 text-[11px] text-slate-500 italic">
                        "{inq.customNotes}"
                      </p>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Submitted on {dateStr}</span>
                      <span className="font-mono text-slate-500">Ref: {inq.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Only you can see this data.</span>
          </p>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
