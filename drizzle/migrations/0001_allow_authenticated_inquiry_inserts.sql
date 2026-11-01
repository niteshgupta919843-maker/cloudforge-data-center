DROP POLICY "Visitors can submit inquiries" ON public.contact_inquiries;
CREATE POLICY "Visitors can submit inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);