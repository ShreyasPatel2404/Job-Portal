import React, { useState, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

// Reuse ONLY the resume-builder UI from the `project` folder
// (no signup/login header, no separate routing).
import ResumeBuilder from '../../../../project/src/components/resume/ResumeBuilder.jsx';
import ResumePreview from '../../../../project/src/components/ResumePreview.jsx';
import { defaultResumeData } from '../../../../project/src/types/resume.js';

/**
 * ResumeBuilderEmbed
 *
 * This embeds the core resume builder page from the standalone project:
 * - Uses the same forms and preview (so the look & feel matches /resume)
 * - Does NOT include that project's auth / signup / routing shell
 * - Adds its own simple "Download PDF" button that works without login
 */
export default function ResumeBuilderEmbed() {
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef(null);

  const exportSettings = resumeData.exportSettings || {
    pageFormat: 'letter',
    orientation: 'portrait',
    margin: 0.5,
    quality: 0.98,
    scale: 2
  };

  const generatePDF = async () => {
    if (!previewRef.current || isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      const ensureHtml2PdfLoaded = () =>
        new Promise((resolve, reject) => {
          if (window.html2pdf) {
            return resolve();
          }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
          document.head.appendChild(script);
        });

      await ensureHtml2PdfLoaded();
      const html2pdf = window.html2pdf;
      const element = previewRef.current;

      const opt = {
        margin: exportSettings.margin,
        filename: `${resumeData.personalInfo?.fullName || 'resume'}_resume.pdf`,
        image: { type: 'jpeg', quality: exportSettings.quality },
        html2canvas: {
          scale: exportSettings.scale,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: {
          unit: 'in',
          format: exportSettings.pageFormat,
          orientation: exportSettings.orientation
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setResumeData(defaultResumeData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/20">
        <div className="container-page py-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Resume Builder
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Build and preview your resume in real-time. This view uses only the resume editor UI
            from the builder project—without signup, login, or extra pages.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="container-page py-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ResumeBuilder data={resumeData} onChange={setResumeData} />
        </div>

        <div className="glass-panel rounded-xl p-4 lg:sticky lg:top-24 overflow-auto bg-white">
          <div
            ref={previewRef}
            className="transform origin-top-left"
            style={{ width: '133.33%', transform: 'scale(0.75)' }}
          >
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

