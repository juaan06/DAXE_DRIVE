CREATE TABLE IF NOT EXISTS public.user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pico', 'clima', 'bloqueo', 'general')),
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'info')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_alerts_user_id
  ON public.user_alerts(user_id);

CREATE POLICY "Usuarios pueden ver sus alertas"
  ON public.user_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus alertas"
  ON public.user_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus alertas"
  ON public.user_alerts
  FOR DELETE
  USING (auth.uid() = user_id);
