"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LOADER_DELAY_MS = 250;

/** Shows a branded overlay only when navigation takes long enough to need feedback. */
export function RouteLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), LOADER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-background/75 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <Image
        src="/images/brand/Avon_Chambers_Logo.webp"
        alt=""
        width={96}
        height={96}
        priority
        className="size-20 animate-[spin_2.5s_linear_infinite] object-contain motion-reduce:animate-none sm:size-24"
      />
    </div>
  );
}
