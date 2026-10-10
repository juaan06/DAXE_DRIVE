CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.user_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('particular', 'moto', 'taxi', 'camioneta', 'bus', 'otro')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  plate TEXT NOT NULL,
  color TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plate)
);

ALTER TABLE public.user_vehicles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_vehicles_user_id
  ON public.user_vehicles(user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_vehicles_updated_at
BEFORE UPDATE ON public.user_vehicles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE POLICY "Usuarios pueden ver sus vehículos"
  ON public.user_vehicles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus vehículos"
  ON public.user_vehicles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus vehículos"
  ON public.user_vehicles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus vehículos"
  ON public.user_vehicles
  FOR DELETE
  USING (auth.uid() = user_id);
