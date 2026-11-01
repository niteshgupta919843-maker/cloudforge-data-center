import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const InfraScene = lazy(() => import("./InfraScene"));

export const INFRA_STAGES = [
  { at: 0, label: "01 · Racks", title: "Server racks", body: "Compute arranged in organized rack rows with structured cabling and room to scale." },
  { at: 0.3, label: "02 · Network", title: "Network switching", body: "Switching links every server, moving traffic between workloads and the outside world." },
  { at: 0.55, label: "03 · Storage & cooling", title: "Storage and cooling", body: "Storage keeps data close to compute, while cooling infrastructure protects the hardware." },
  { at: 0.85, label: "04 · Cloud", title: "Cloud connectivity", body: "The environment connects outward, keeping services reachable for your business." },
];

const stageFor = (p: number) => INFRA_STAGES.reduce((acc, s, i) => (p >= s.at - 0.05 ? i : acc), 0);

export function InfraShowcase() {
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
      progress.current = INFRA_STAGES[stage]!.at;
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
      progress.current = INFRA_STAGES[i]!.at;
      return;
    }
    const el = sectionRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * INFRA_STAGES[i]!.at, behavior: "smooth" });
  };

  const s = INFRA_STAGES[stage]!;

  return (
    <section ref={sectionRef} aria-label="Infrastructure showcase" className={reduced ? "relative" : "relative h-[320vh]"}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {webgl ? (
            <ClientOnly fallback={<div className="h-full w-full bg-surface" />}>
              <Suspense fallback={<div className="h-full w-full bg-surface" />}>
                <InfraScene progress={progress} reduced={reduced} />
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
            <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            <div className="pointer-events-auto mt-5 flex gap-2" role="group" aria-label="Jump to infrastructure stage">
              {INFRA_STAGES.map((st, i) => (
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
            {!reduced && <p className="mt-4 font-mono text-[11px] text-muted-foreground">Scroll to explore ↓</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
