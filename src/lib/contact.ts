import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Cloud Servers",
  "Tally on Cloud",
  "Managed Hosting",
  "Secure Storage",
  "Backup & Disaster Recovery",
  "IT Infrastructure & Support",
  "Other",
] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
  company: z.string().trim().max(160, "Company name is too long.").optional().or(z.literal("")),
  email: z.string().trim().min(3, "Please enter your email.").email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  service_required: z.string().trim().min(1, "Please choose a service.").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(4000, "Message is too long."),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; errors?: Record<string, string> };

/**
 * Public server function: anyone can submit a contact inquiry, so the handler
 * validates the payload itself and never trusts client data. The admin client
 * is imported inside the handler so it never enters the client bundle.
 */
export const submitInquiry = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: unknown }): Promise<SubmitResult> => {
    const parsed = inquirySchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return { ok: false, message: "Please check the highlighted fields.", errors };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_inquiries").insert({
        name: parsed.data.name,
        company: parsed.data.company || null,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service_required: parsed.data.service_required,
        message: parsed.data.message,
      });
      if (error) {
        console.error("[submitInquiry] insert failed:", error.message);
        return {
          ok: false,
          message: "We couldn't save your message right now. Please try again, or email hello@htwocloud.com.",
        };
      }
      return { ok: true };
    } catch (err) {
      console.error("[submitInquiry] unexpected error:", err);
      return {
        ok: false,
        message: "We couldn't save your message right now. Please try again, or email hello@htwocloud.com.",
      };
    }
  },
);
