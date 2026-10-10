CREATE TABLE IF NOT EXISTS public.favorite_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km NUMERIC(8,2) NOT NULL DEFAULT 0,
  duration_min INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.favorite_routes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_favorite_routes_user_id
  ON public.favorite_routes(user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_favorite_routes_updated_at
BEFORE UPDATE ON public.favorite_routes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE POLICY "Usuarios pueden ver sus rutas favoritas"
  ON public.favorite_routes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus rutas favoritas"
  ON public.favorite_routes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus rutas favoritas"
  ON public.favorite_routes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus rutas favoritas"
  ON public.favorite_routes
  FOR DELETE
  USING (auth.uid() = user_id);
