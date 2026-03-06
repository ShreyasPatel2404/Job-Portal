import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Mail, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from './ui/badge';

const ApplicationDetailsModal = ({ application, isOpen, onClose, onStatusChange, isUpdating }) => {
  if (!isOpen || !application) return null;

  const statusUpper = application.status?.toUpperCase();

  const getResumeUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/api/applications/download/')) return url;

    // Legacy full URL path or just raw file name? 
    // Always split by '/' and take the filename
    return `/api/applications/download/${url.split('/').pop()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white font-bold text-xl">
              {(application.applicantName || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {application.applicantName || 'Candidate Details'}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {application.applicantEmail || 'Email not available'}
                </span>
                <Badge
                  variant={
                    statusUpper === 'ACCEPTED'
                      ? 'success'
                      : statusUpper === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {application.status}
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Cover Letter Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Cover Letter
            </h3>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 leading-relaxed text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap">
              {application.coverLetter || 'No cover letter provided by the candidate.'}
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Attachments
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-primary/30 transition-colors bg-white dark:bg-zinc-900 group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.resumeFileName || 'Resume.pdf'}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">PDF Document</p>
                </div>
              </div>
              <a
                href={getResumeUrl(application.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-600 transition-all shadow-md group-hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resume
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-3">
          {/* Reject Button */}
          {statusUpper !== 'REJECTED' && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(application.id, 'REJECTED')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-5 h-5" />
              Reject Applicant
            </button>
          )}
          {/* Accept Button — navigates to interviews page via parent */}
          {statusUpper !== 'ACCEPTED' && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(application.id, 'ACCEPTED')}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              Accept &amp; Schedule Interview
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationDetailsModal;
