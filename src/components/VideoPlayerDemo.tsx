"use client";
import { useEffect, useState } from "react";
import IntroPreview from "./IntroPreview";

export default function VideoPlayerDemo({ src = "/videos/komc-intro.mp4" }: { src?: string }) {
  const [error, setError] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [localUrl]);
  return (
    <div className="space-y-6">
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="aspect-video">
          <video
            controls
            playsInline
            className="h-full w-full object-cover"
            poster="/images/about-hero-poster.jpg"
            src={localUrl ?? src}
            onError={() => setError(true)}
          />
        </div>
      </div>
      {error ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          <div className="text-sm font-semibold">Video file not found</div>
          <div className="mt-1 text-xs">
            Copy your rendered file to <span className="font-mono">public/videos/komc-intro.mp4</span> and reload. Or upload the file here to preview.
          </div>
          <div className="mt-3">
            <input
              type="file"
              accept="video/mp4,video/*"
              className="block w-full text-xs text-amber-200"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const url = URL.createObjectURL(f);
                  setLocalUrl(url);
                  setError(false);
                }
              }}
            />
            <div className="mt-2 text-[11px]">
              After reviewing, rename the file to <span className="font-mono">komc-intro.mp4</span> and place it in <span className="font-mono">public/videos</span>.
            </div>
          </div>
          <div className="mt-4">
            <IntroPreview />
          </div>
        </div>
      ) : null}
    </div>
  );
}
