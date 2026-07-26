"use client";

import { useState } from "react";
import { apiRequest } from "./utils/api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auditUrl = async () => {
    setLoading(true);
    setError("");
    setReport(null);

    let formattedUrl = url.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      const data = await apiRequest("/audit", {
        method: "POST",
        body: JSON.stringify({
          url: formattedUrl,
        }),
      });

      setReport(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 py-12">
      <div className="w-full max-w-3xl px-6 pb-20">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center tracking-tight text-slate-900 sm:text-5xl">
          URL Auditor
        </h1>

        <p className="text-center text-slate-500 mt-2.5 text-base">
          Analyze the SEO structure of any webpage.
        </p>

        {/* URL Input */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center bg-white rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all overflow-hidden">
            <span className="pl-4 text-slate-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-transparent pl-3 pr-4 py-4 outline-none text-slate-800 placeholder-slate-400 text-sm"
            />
          </div>

          <button
            onClick={auditUrl}
            disabled={loading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] px-6 py-4 font-semibold text-white transition-all disabled:opacity-50 text-sm shadow-sm flex items-center justify-center gap-2 min-w-[130px]"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? "Auditing..." : "Audit URL"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700 flex items-start gap-3 shadow-sm text-sm">
            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold">Audit Failed</p>
              <p className="mt-0.5 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Report */}
        {report && (
          <div className="mt-8 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-100/50 overflow-hidden">
            {/* Card Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Audit Report
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Success
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Top Metrics Grid */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">

                {/* HTTP Status */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Status
                  </p>
                  <div className="flex items-center">
                    {report.http_status === 200 ? (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {report.http_status} OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                        {report.http_status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Response Time */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Speed
                  </p>
                  <div>
                    <p className={`text-lg font-bold ${report.response_time_ms < 500
                        ? "text-emerald-600"
                        : report.response_time_ms < 1000
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}>
                      {report.response_time_ms} ms
                    </p>
                  </div>
                </div>

                {/* H1 Count */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    H1 Count
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg font-bold ${report.h1_count === 1 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                      {report.h1_count}
                    </span>
                    {report.h1_count === 1 ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium">Optimal</span>
                    ) : report.h1_count === 0 ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-100 rounded-full font-medium">Missing</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium">Multiple</span>
                    )}
                  </div>
                </div>

                {/* Missing Alt Alts */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Missing Alts
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg font-bold ${report.images_missing_alt === 0 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                      {report.images_missing_alt}
                    </span>
                    {report.images_missing_alt === 0 ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium">Perfect</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-100 rounded-full font-medium">Fix Needed</span>
                    )}
                  </div>
                </div>

                {/* Word Count */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Words
                  </p>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {report.word_count}
                    </p>
                  </div>
                </div>

              </div>

              {/* Metadata Text Details */}
              <div className="space-y-4 pt-2">

                {/* Page Title */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Page Title
                  </p>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800 leading-snug">
                    {report.title || (
                      <span className="text-slate-400 font-normal italic">No title found</span>
                    )}
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Meta Description
                  </p>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                    {report.meta_description || (
                      <span className="text-slate-400 italic">No description found</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-slate-400 py-4 bg-slate-50/95 backdrop-blur-sm border-t border-slate-200/50 z-50">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-600 hover:underline transition-colors"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </main>
  );
}