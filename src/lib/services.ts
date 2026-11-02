import type { VisualKind } from "@/components/mini3d/VisualScene";

export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  kind: VisualKind;
};

/** Canonical list of HTwoCloud services — shared by the home page and the services page. */
export const SERVICES: Service[] = [
  {
    slug: "cloud-servers",
    title: "Cloud Servers",
    tagline: "Scalable virtual servers for your applications and workloads.",
    description:
      "Virtual servers provisioned and managed for the way your applications actually run. We size each server to the workload, keep it reachable, and adjust capacity as your needs change.",
    benefits: [
      "Servers sized to each workload instead of one-size-fits-all plans",
      "Capacity can grow as your applications grow",
      "Managed access with controlled permissions",
      "Monitoring so problems surface early, not after an outage",
    ],
    kind: "server",
  },
  {
    slug: "tally-on-cloud",
    title: "Tally on Cloud",
    tagline: "Run Tally securely from anywhere, without local hardware.",
    description:
      "Your Tally environment hosted in the cloud, so your team can work from the office, from home, or from different cities — on the same up-to-date company data.",
    benefits: [
      "Access Tally from office, home or on the move",
      "One central data set instead of files scattered across machines",
      "Multi-user access with role-based controls",
      "Accounting data kept on backed-up, managed infrastructure",
    ],
    kind: "cloud",
  },
  {
    slug: "managed-hosting",
    title: "Managed Hosting",
    tagline: "We handle setup, updates and monitoring.",
    description:
      "We look after the routine work of running hosted services — provisioning, configuration, updates and health checks — so your team can stay focused on the business.",
    benefits: [
      "Setup and configuration handled for you",
      "System and application updates maintained",
      "Continuous monitoring with alerts when something needs attention",
      "A team that knows your environment when you need help",
    ],
    kind: "hosting",
  },
  {
    slug: "secure-storage",
    title: "Secure Storage",
    tagline: "Protected storage for files and data, with controlled access.",
    description:
      "Central, organized storage for the files and data your business depends on, with access controls so people see only what they should.",
    benefits: [
      "Access controls so only the right people reach your data",
      "Centralized storage that is easier to back up and audit",
      "Expand capacity without re-architecting your setup",
      "Storage practices aligned with your internal data policy",
    ],
    kind: "storage",
  },
  {
    slug: "backup-disaster-recovery",
    title: "Backup & Disaster Recovery",
    tagline: "Scheduled backups and restore options that hold up when needed.",
    description:
      "Backups are only useful if they restore. We set up scheduled backups and documented recovery steps, and keep them aligned with what your business can tolerate.",
    benefits: [
      "Scheduled, automatic backups of critical data",
      "Documented recovery steps, agreed before an incident",
      "Restore checks so backups stay trustworthy",
      "Copies kept separately from the primary environment",
    ],
    kind: "backup",
  },
  {
    slug: "it-infrastructure-support",
    title: "IT Infrastructure & Support",
    tagline: "Design, setup and ongoing help for your IT environment.",
    description:
      "From choosing the right infrastructure to keeping it running day to day. We work as an extension of your team — reachable when something needs attention.",
    benefits: [
      "Guidance on the right infrastructure for your workload",
      "Setup, configuration and migration assistance",
      "Ongoing maintenance and health checks",
      "Round-the-clock support availability",
    ],
    kind: "support",
  },
];
