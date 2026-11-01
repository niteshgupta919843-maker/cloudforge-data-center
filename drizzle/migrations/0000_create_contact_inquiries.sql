CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  company text CHECK (company IS NULL OR char_length(company) BETWEEN 1 AND 160),
  email text NOT NULL CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text CHECK (phone IS NULL OR char_length(phone) BETWEEN 5 AND 30),
  service_required text NOT NULL CHECK (char_length(service_required) BETWEEN 1 AND 80),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_inquiries TO anon;
GRANT ALL ON public.contact_inquiries TO service_role;

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);