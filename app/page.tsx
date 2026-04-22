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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            File Upload
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Upload any file and get a shareable URL via EdgeStore
          </p>
        </div>

        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors bg-zinc-50 dark:bg-zinc-800/50">
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
          {file ? (
            <div className="text-center px-4">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {(file.size / 1024).toFixed(1)} KB &middot; click to change
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Click to select a file
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Any file type supported
              </p>
            </div>
          )}
        </label>

        {uploading && (
          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-zinc-900 dark:bg-zinc-100 h-1.5 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
              {progress}%
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-80 cursor-pointer disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>

        {uploadedUrl && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              File URL
            </p>
            <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
              >
                {uploadedUrl}
              </a>
              <button
                onClick={handleCopy}
                className="shrink-0 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
