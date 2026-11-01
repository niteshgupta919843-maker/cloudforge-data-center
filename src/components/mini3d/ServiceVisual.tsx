import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { VisualKind } from "./VisualScene";

const VisualScene = lazy(() => import("./VisualScene"));

/**
 * Lightweight 3D illustration. Mounts its canvas the first time it comes near
 * the viewport and pauses the render loop whenever it is off-screen, so pages
 * with many visuals stay cheap.
 */
export function ServiceVisual({ kind, className = "" }: { kind: VisualKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {mounted && (
        <ClientOnly fallback={<div className="h-full w-full" />}>
          <Suspense fallback={<div className="h-full w-full" />}>
            <VisualScene kind={kind} paused={!visible} />
          </Suspense>
        </ClientOnly>
      )}
    </div>
  );
}
