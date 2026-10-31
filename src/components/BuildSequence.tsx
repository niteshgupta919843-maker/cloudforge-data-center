import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const DataCenterScene = lazy(() => import("./DataCenterScene"));

export const STAGES = [
  { at: 0, label: "01 · Components", title: "Raw hardware", body: "CPU, memory, storage, cooling, power and networking — each part chosen for the workload." },
  { at: 0.3, label: "02 · Server", title: "Assembled into a server", body: "Components come together into a single, managed compute node." },
  { at: 0.55, label: "03 · Rack", title: "Racked and networked", body: "Servers stack into a rack, linked by a top-of-rack switch." },
  { at: 0.95, label: "04 · Data center", title: "Your cloud, in one place", body: "Racks scale into a complete HTwoCloud data-center environment." },
];

const stageFor = (p: number) => STAGES.reduce((acc, s, i) => (p >= s.at - 0.05 ? i : acc), 0);

export function BuildSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) {
      progress.current = STAGES[stage].at;
      return;
    }
    let killed = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (killed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const s = stageFor(self.progress);
          setStage((prev) => (prev === s ? prev : s));
        },
      });
      cleanup = () => st.kill();
    })();
    return () => {
      killed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const goTo = (i: number) => {
    setStage(i);
    if (reduced || !sectionRef.current) {
      progress.current = STAGES[i].at;
      return;
    }
    const el = sectionRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * STAGES[i].at, behavior: "smooth" });
  };

  const s = STAGES[stage];

  return (
    <section
      ref={sectionRef}
      id="build"
      aria-label="Data center build sequence"
      className={reduced ? "relative" : "relative h-[420vh]"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {webgl ? (
            <ClientOnly fallback={<div className="h-full w-full bg-surface" />}>
              <Suspense fallback={<div className="h-full w-full bg-surface" />}>
                <DataCenterScene progress={progress} reduced={reduced} />
              </Suspense>
            </ClientOnly>
          ) : (
            <div className="grid-lines h-full w-full bg-surface" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 md:justify-center md:pb-0">
          <div className="max-w-sm rounded-xl border bg-background/70 p-5 backdrop-blur-md shadow-glow md:p-6" aria-live="polite">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{s.label}</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            <div className="pointer-events-auto mt-5 flex gap-2" role="group" aria-label="Jump to build stage">
              {STAGES.map((st, i) => (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show stage: ${st.title}`}
                  aria-pressed={i === stage}
                  className={`h-2 rounded-full transition-all ${i === stage ? "w-8 bg-primary" : "w-4 bg-muted-foreground/40 hover:bg-muted-foreground"}`}
                />
              ))}
            </div>
            {!reduced && <p className="mt-4 font-mono text-[11px] text-muted-foreground">Scroll to build ↓</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
