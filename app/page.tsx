"use client";

import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore-client";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (p) => setProgress(p),
      });
      setUploadedUrl(res.url);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/5 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          {/* Subtle inner gradient */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/[0.07] via-transparent to-indigo-500/[0.07]" />

          {/* Header */}
          <div className="relative mb-8">
            <div className="mb-5 flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">File Upload</h1>
                <p className="text-[11px] text-white/35">Powered by EdgeStore</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/45">
              Select any file and get an instant shareable link.
            </p>
          </div>

          {/* Drop zone */}
          <label className="group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/[0.04]">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  setUploadedUrl(null);
                }
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/0 to-indigo-500/0 transition-all duration-300 group-hover:from-violet-500/[0.06] group-hover:to-indigo-500/[0.06]" />

            {file ? (
              <div className="relative text-center px-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                  <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="max-w-[220px] truncate text-sm font-semibold text-white/80">{file.name}</p>
                <p className="mt-1 text-xs text-white/35">
                  {(file.size / 1024).toFixed(1)} KB ·{" "}
                  <span className="text-violet-400">click to change</span>
                </p>
              </div>
            ) : (
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
                  <svg className="h-7 w-7 text-white/25 transition-colors duration-300 group-hover:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white/40 transition-colors duration-300 group-hover:text-white/60">
                  Click to select a file
                </p>
                <p className="mt-1 text-xs text-white/20">Any file type supported</p>
              </div>
            )}
          </label>

          {/* Progress bar */}
          {uploading && (
            <div className="relative mt-4 space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/50 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/25">Uploading…</p>
                <p className="text-xs font-semibold text-violet-400">{progress}%</p>
              </div>
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="group relative mt-5 h-12 w-full cursor-pointer overflow-hidden rounded-2xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-200 group-hover:from-violet-500 group-hover:to-indigo-500 group-disabled:from-violet-600 group-disabled:to-indigo-600" />
            <div className="absolute inset-0 opacity-0 shadow-lg shadow-violet-500/40 transition-opacity duration-200 group-hover:opacity-100" />
            <span className="relative text-white drop-shadow-sm">
              {uploading ? "Uploading…" : "Upload File"}
            </span>
          </button>

          {/* Success result */}
          {uploadedUrl && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                  Upload complete
                </p>
              </div>
              <div className="flex items-start gap-3 p-4">
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 break-all text-xs leading-relaxed text-violet-400 transition-colors hover:text-violet-300"
                >
                  {uploadedUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="shrink-0 cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/40 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[11px] text-white/15">
          Files are securely stored via EdgeStore
        </p>
      </div>
    </div>
  );
}
