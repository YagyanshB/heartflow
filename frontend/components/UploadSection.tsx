"use client";

import { useRef, useState } from "react";
import { Upload, MessageSquare, X, Image, Loader2 } from "lucide-react";

interface UploadSectionProps {
  onAnalyze: (result: unknown) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export default function UploadSection({ onAnalyze, isLoading, setIsLoading }: UploadSectionProps) {
  const [conversation, setConversation] = useState("");
  const [context, setContext] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setScreenshots((prev) => [...prev, ...valid].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeScreenshot = (i: number) => {
    setScreenshots((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!conversation.trim() && screenshots.length === 0) {
      setError("Please paste a conversation or upload screenshots.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (conversation.trim()) formData.append("conversation", conversation);
      if (context.trim()) formData.append("context", context);
      screenshots.forEach((f) => formData.append("screenshots", f));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/analyze`, { method: "POST", body: formData });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      onAnalyze(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-6 space-y-5 fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
          <MessageSquare size={16} />
        </div>
        <h2 className="text-lg font-semibold text-white">Drop the Conversation</h2>
      </div>

      {/* Context */}
      <div>
        <label className="text-xs font-medium text-white/50 mb-1.5 block uppercase tracking-wide">
          Context (Optional)
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Met at a party 2 weeks ago, had coffee once..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
        />
      </div>

      {/* Conversation paste */}
      <div>
        <label className="text-xs font-medium text-white/50 mb-1.5 block uppercase tracking-wide">
          Paste Conversation
        </label>
        <textarea
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder={"You: Hey, are you free this weekend?\nThem: Maybe! What did you have in mind? 😊\n..."}
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/60 transition-colors resize-none font-mono leading-relaxed"
        />
      </div>

      {/* Screenshot upload */}
      <div>
        <label className="text-xs font-medium text-white/50 mb-1.5 block uppercase tracking-wide">
          Or Upload Screenshots (up to 5)
        </label>
        <div
          className={`upload-zone rounded-xl p-6 text-center cursor-pointer ${dragging ? "dragover" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload size={24} className="mx-auto mb-2 text-purple-400" />
          <p className="text-sm text-white/50">
            Drag & drop screenshots here, or <span className="text-purple-400">click to browse</span>
          </p>
          <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP supported</p>
        </div>

        {screenshots.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {screenshots.map((f, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="w-full h-24 object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeScreenshot(i); }}
                    className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 flex items-center gap-1">
                  <Image size={10} className="text-white/50" />
                  <span className="text-xs text-white/50 truncate">{f.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn-primary w-full py-4 rounded-xl text-white font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Wingman is analyzing...
          </>
        ) : (
          <>
            <span>🪄</span>
            Analyze with Wingman
          </>
        )}
      </button>
    </div>
  );
}
