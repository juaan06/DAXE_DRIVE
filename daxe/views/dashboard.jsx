import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VISTAS } from '../controllers/vistas.js';
import { getCurrentUser, getProfile, logoutUser, updateProfile } from '../src/services/authService.js';
import { buildAlertSummary, buildPicoPlacaNotification } from '../src/lib/alertHistoryRules.js';
import { validateFavoriteRoute } from '../src/lib/favoriteRoutesRules.js';
import { getAlertHistory, createAlert, deleteAlert } from '../src/services/alertHistoryService.js';
import { checkPicoYPlaca } from '../src/services/picoPlacaService.js';
import RoutePlanner from '../src/components/RoutePlanner.jsx';
import { createFavoriteRoute, deleteFavoriteRoute, getFavoriteRoutes } from '../src/services/favoriteRoutesService.js';
import { createVehicle, deleteVehicle, getMyVehicles } from '../src/services/vehicleService.js';

export default function DashboardView() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('daxe_user') || '{}');
    } catch {
      return {};
    }
  });
  const [perfil, setPerfil] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    type: 'particular',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    notes: '',
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardandoVehiculo, setGuardandoVehiculo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeVehiculo, setMensajeVehiculo] = useState('');
  const [vehicleIdSeleccionado, setVehicleIdSeleccionado] = useState('');
  const [consultaPicoPlaca, setConsultaPicoPlaca] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: '08:15',
  });
  const [resultadoPicoPlaca, setResultadoPicoPlaca] = useState(null);
  const [consultandoPicoPlaca, setConsultandoPicoPlaca] = useState(false);
  const [notificacionesAutomaticas, setNotificacionesAutomaticas] = useState(true);
  const [rutasFavoritas, setRutasFavoritas] = useState([]);
  const [nuevaRuta, setNuevaRuta] = useState({ name: '', origin: '', destination: '', distanceKm: '', durationMin: '' });
  const [guardandoRuta, setGuardandoRuta] = useState(false);
  const [mensajeRuta, setMensajeRuta] = useState('');
  const [alertas, setAlertas] = useState([]);
  const [nuevaAlerta, setNuevaAlerta] = useState({ type: 'pico', message: '', severity: 'high' });
  const [guardandoAlerta, setGuardandoAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarUsuario() {
      try {
        const respuesta = await getCurrentUser();
        const user = respuesta?.data?.user || respuesta?.data || {};

        if (!activo) return;

        if (user?.email) {
          localStorage.setItem('daxe_user', JSON.stringify(user));
          setUsuario(user);
        }

        const perfilRespuesta = await getProfile();
        const perfilData = perfilRespuesta?.data?.profile || perfilRespuesta?.data || {};

        if (!activo) return;

        setPerfil({
          full_name: perfilData?.full_name || user?.user_metadata?.full_name || '',
          avatar_url: perfilData?.avatar_url || user?.user_metadata?.avatar_url || '',
        });

        const vehiculosRespuesta = await getMyVehicles();
        const rutasRespuesta = await getFavoriteRoutes();
        const alertasRespuesta = await getAlertHistory();
        if (!activo) return;
        setVehiculos(vehiculosRespuesta?.data || []);
        setRutasFavoritas(rutasRespuesta?.data || []);
        setAlertas(alertasRespuesta?.data || []);
      } catch {
        const usuarioGuardado = localStorage.getItem('daxe_user');
        if (usuarioGuardado && activo) {
          try {
            const guardado = JSON.parse(usuarioGuardado);
            setUsuario(guardado);
            setPerfil({
              full_name: guardado?.user_metadata?.full_name || guardado?.full_name || '',
              avatar_url: guardado?.user_metadata?.avatar_url || guardado?.avatar_url || '',
            });
          } catch {
            setUsuario({});
          }
        }

        if (activo) {
          setVehiculos([]);
          setRutasFavoritas([]);
          setAlertas([]);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarUsuario();
    return () => {
      activo = false;
    };
  }, []);

  const cerrarSesion = async () => {
    try {
      await logoutUser();
    } catch {
      // ignoramos el error de logout del servidor para limpiar la sesión local
    }

    localStorage.removeItem('daxe_token');
    localStorage.removeItem('daxe_user');
    navigate(VISTAS.LOGIN, { replace: true });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehiculoChange = (event) => {
    const { name, value } = event.target;
    setNuevoVehiculo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje('');

    try {
      const respuesta = await updateProfile(perfil);
      const usuarioActualizado = {
        ...usuario,
        user_metadata: {
          ...(usuario.user_metadata || {}),
          full_name: perfil.full_name,
          avatar_url: perfil.avatar_url,
        },
        full_name: perfil.full_name,
        avatar_url: perfil.avatar_url,
      };

      localStorage.setItem('daxe_user', JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
      setMensaje(respuesta?.message || 'Perfil actualizado correctamente.');
    } catch (error) {
      setMensaje(error?.message || 'No se pudo guardar el perfil.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCrearVehiculo = async (event) => {
    event.preventDefault();
    setGuardandoVehiculo(true);
    setMensajeVehiculo('');

    try {
      await createVehicle({
        ...nuevoVehiculo,
        year: Number(nuevoVehiculo.year || new Date().getFullYear()),
      });

      const respuestaVehiculos = await getMyVehicles();
      setVehiculos(respuestaVehiculos?.data || []);
      setNuevoVehiculo({
        type: 'particular',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate: '',
        color: '',
        notes: '',
      });
      setMensajeVehiculo('Vehículo registrado correctamente.');
    } catch (error) {
      setMensajeVehiculo(error?.message || 'No se pudo guardar el vehículo.');
    } finally {
      setGuardandoVehiculo(false);
    }
  };

  const handleEliminarVehiculo = async (id) => {
    try {
      await deleteVehicle(id);
      const respuestaVehiculos = await getMyVehicles();
      setVehiculos(respuestaVehiculos?.data || []);
      setMensajeVehiculo('Vehículo eliminado correctamente.');
      if (vehicleIdSeleccionado === id) {
        setVehicleIdSeleccionado('');
        setResultadoPicoPlaca(null);
      }
    } catch (error) {
      setMensajeVehiculo(error?.message || 'No se pudo eliminar el vehículo.');
    }
  };

  const handleConsultarPicoPlaca = async (event) => {
    event.preventDefault();
    const vehiculo = vehiculos.find((item) => item.id === vehicleIdSeleccionado);

    if (!vehiculo) {
      setResultadoPicoPlaca({
        is_restricted: false,
        reason: 'Selecciona un vehículo para consultar la restricción.',
        status: 'missing-vehicle',
      });
      return;
    }

    setConsultandoPicoPlaca(true);

    try {
      const respuesta = await checkPicoYPlaca({
        vehicle_id: vehiculo.id,
        date: consultaPicoPlaca.date,
        time: consultaPicoPlaca.time,
      });

      const data = respuesta?.data || null;
      setResultadoPicoPlaca(data);

      if (data?.is_restricted && notificacionesAutomaticas) {
        const alertaAutomatica = buildPicoPlacaNotification(data);
        if (alertaAutomatica) {
          try {
            await createAlert(alertaAutomatica);
            const alertasRespuesta = await getAlertHistory();
            setAlertas(alertasRespuesta?.data || []);
          } catch {
            // La alerta no bloquea la consulta si no puede persistirse.
          }
        }
      }
    } catch (error) {
      setResultadoPicoPlaca({
        is_restricted: false,
        status: 'error',
        reason: error?.message || 'No se pudo consultar la restricción.',
      });
    } finally {
      setConsultandoPicoPlaca(false);
    }
  };

  const handleRutaChange = (event) => {
    const { name, value } = event.target;
    setNuevaRuta((prev) => ({ ...prev, [name]: value }));
  };

  const handleRutaCalculada = (route) => {
    const originLabel = route.origin.split(',')[0];
    const destinationLabel = route.destination.split(',')[0];
    setNuevaRuta((prev) => ({
      ...prev,
      name: `${originLabel} - ${destinationLabel}`,
      origin: route.origin,
      destination: route.destination,
      distanceKm: String(route.distanceKm),
      durationMin: String(route.durationMin),
    }));
    setMensajeRuta('Ruta calculada. Revisa los datos y pulsa «Guardar ruta» para guardarla en tu cuenta.');
  };

  const handleGuardarRuta = async (event) => {
    event.preventDefault();
    const validation = validateFavoriteRoute(nuevaRuta);

    if (!validation.isValid) {
      setMensajeRuta(validation.errors.join(' '));
      return;
    }

    setGuardandoRuta(true);
    setMensajeRuta('');

    try {
      const respuesta = await createFavoriteRoute({
        ...validation.normalized,
        distanceKm: Number(validation.normalized.distanceKm || 0),
        durationMin: Number(validation.normalized.durationMin || 0),
      });

      const rutasRespuesta = await getFavoriteRoutes();
      setRutasFavoritas(rutasRespuesta?.data || []);
      setNuevaRuta({ name: '', origin: '', destination: '', distanceKm: '', durationMin: '' });
      setMensajeRuta(respuesta?.message || 'Ruta guardada correctamente.');
    } catch (error) {
      setMensajeRuta(error?.message || 'No se pudo guardar la ruta.');
    } finally {
      setGuardandoRuta(false);
    }
  };

  const handleEliminarRuta = async (id) => {
    try {
      await deleteFavoriteRoute(id);
      const rutasRespuesta = await getFavoriteRoutes();
      setRutasFavoritas(rutasRespuesta?.data || []);
      setMensajeRuta('Ruta eliminada correctamente.');
    } catch (error) {
      setMensajeRuta(error?.message || 'No se pudo eliminar la ruta.');
    }
  };

  const handleAlertaChange = (event) => {
    const { name, value } = event.target;
    setNuevaAlerta((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarAlerta = async (event) => {
    event.preventDefault();
    if (!nuevaAlerta.message.trim()) {
      setMensajeAlerta('El mensaje de la alerta es obligatorio.');
      return;
    }

    setGuardandoAlerta(true);
    setMensajeAlerta('');

    try {
      const respuesta = await createAlert({
        ...nuevaAlerta,
        message: nuevaAlerta.message.trim(),
      });

      const alertasRespuesta = await getAlertHistory();
      setAlertas(alertasRespuesta?.data || []);
      setNuevaAlerta({ type: 'pico', message: '', severity: 'high' });
      setMensajeAlerta(respuesta?.message || 'Alerta guardada correctamente.');
    } catch (error) {
      setMensajeAlerta(error?.message || 'No se pudo guardar la alerta.');
    } finally {
      setGuardandoAlerta(false);
    }
  };

  const handleEliminarAlerta = async (id) => {
    try {
      await deleteAlert(id);
      const alertasRespuesta = await getAlertHistory();
      setAlertas(alertasRespuesta?.data || []);
      setMensajeAlerta('Alerta eliminada correctamente.');
    } catch (error) {
      setMensajeAlerta(error?.message || 'No se pudo eliminar la alerta.');
    }
  };

  const nombreCompleto = perfil.full_name || usuario?.user_metadata?.full_name || usuario?.full_name || usuario?.email || 'Usuario DAXE';

  return (
    <main className="min-h-svh bg-[#090a0f] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-violet-500/60 bg-[#11121b]/80 p-8 shadow-[0_0_40px_rgba(109,40,217,0.20)]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-violet-300">DAXE</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-xl border border-violet-500 bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-600/30"
          >
            Cerrar sesión
          </button>
        </div>

        {cargando ? (
          <p className="text-sm text-blue-200">Cargando perfil del usuario...</p>
        ) : (
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1.1fr_1.4fr]">
              <div className="rounded-2xl border border-blue-500/40 bg-[#0d111b] p-5">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={perfil.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombreCompleto) + '&background=7c3aed&color=fff'}
                    alt="Avatar del usuario"
                    className="h-16 w-16 rounded-full border border-violet-500 object-cover"
                  />
                  <div>
                    <p className="text-sm text-blue-300">Usuario</p>
                    <h2 className="mt-1 text-2xl font-bold">{nombreCompleto}</h2>
                  </div>
                </div>

                <p className="text-sm text-[#d1d5db]">{usuario?.email || 'Correo no disponible'}</p>
                <div className="mt-5 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4">
                  <p className="text-sm text-violet-300">Estado</p>
                  <h3 className="mt-2 text-xl font-bold text-emerald-400">Sesión activa</h3>
                </div>
              </div>

              <form onSubmit={handleGuardar} className="rounded-2xl border border-violet-500/40 bg-[#0d111b] p-5">
                <h3 className="text-xl font-semibold text-white">Editar perfil</h3>

                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Nombre completo
                    <input
                      type="text"
                      name="full_name"
                      value={perfil.full_name}
                      onChange={handleChange}
                      className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none ring-0 focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    URL de avatar
                    <input
                      type="url"
                      name="avatar_url"
                      value={perfil.avatar_url}
                      onChange={handleChange}
                      placeholder="https://.../avatar.jpg"
                      className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none ring-0 focus:border-violet-400"
                    />
                  </label>
                </div>

                {mensaje && (
                  <p className="mt-4 text-sm text-blue-200">{mensaje}</p>
                )}

                <button
                  type="submit"
                  disabled={guardando}
                  className="mt-6 rounded-xl border border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {guardando ? 'Guardando...' : 'Guardar perfil'}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-violet-500/40 bg-[#0d111b] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-blue-300">Gestión de transporte</p>
                  <h3 className="text-2xl font-bold text-white">Mis vehículos</h3>
                </div>
              </div>

              <form onSubmit={handleCrearVehiculo} className="mb-5 grid gap-3 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Tipo
                  <select
                    name="type"
                    value={nuevoVehiculo.type}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  >
                    <option value="particular">Particular</option>
                    <option value="moto">Moto</option>
                    <option value="taxi">Taxi</option>
                    <option value="camioneta">Camioneta</option>
                    <option value="bus">Bus</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Marca
                  <input
                    type="text"
                    name="brand"
                    value={nuevoVehiculo.brand}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Modelo
                  <input
                    type="text"
                    name="model"
                    value={nuevoVehiculo.model}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Año
                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max="2100"
                    value={nuevoVehiculo.year}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Placa
                  <input
                    type="text"
                    name="plate"
                    value={nuevoVehiculo.plate}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 uppercase text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db]">
                  Color
                  <input
                    type="text"
                    name="color"
                    value={nuevoVehiculo.color}
                    onChange={handleVehiculoChange}
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#d1d5db] md:col-span-2">
                  Observaciones
                  <textarea
                    name="notes"
                    value={nuevoVehiculo.notes}
                    onChange={handleVehiculoChange}
                    rows="2"
                    className="rounded-xl border border-violet-500/40 bg-[#090a0f] px-3 py-2 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={guardandoVehiculo}
                    className="rounded-xl border border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {guardandoVehiculo ? 'Guardando...' : 'Guardar vehículo'}
                  </button>

                  {mensajeVehiculo && (
                    <p className="text-sm text-blue-200">{mensajeVehiculo}</p>
                  )}
                </div>
              </form>

              <div className="space-y-3">
                {vehiculos.length === 0 ? (
                  <p className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 text-sm text-[#d1d5db]">
                    Aún no tienes vehículos registrados.
                  </p>
                ) : (
                  vehiculos.map((vehiculo) => (
                    <div key={vehiculo.id} className="flex flex-col gap-3 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{vehiculo.type}</p>
                        <h4 className="mt-1 text-xl font-bold text-white">{vehiculo.brand} {vehiculo.model}</h4>
                        <p className="text-sm text-[#d1d5db]">{vehiculo.plate} · {vehiculo.color || 'Sin color'} · {vehiculo.year}</p>
                        {vehiculo.notes && (
                          <p className="mt-1 text-sm text-blue-200">{vehiculo.notes}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEliminarVehiculo(vehiculo.id)}
                        className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleConsultarPicoPlaca} className="mt-6 rounded-2xl border border-blue-500/40 bg-[#090a0f] p-4">
                <div className="mb-3">
                  <p className="text-sm text-blue-300">Consulta rápida</p>
                  <h4 className="text-xl font-bold text-white">Pico y Placa</h4>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Vehículo
                    <select
                      value={vehicleIdSeleccionado}
                      onChange={(event) => setVehicleIdSeleccionado(event.target.value)}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.plate} · {vehiculo.type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Fecha
                    <input
                      type="date"
                      value={consultaPicoPlaca.date}
                      onChange={(event) => setConsultaPicoPlaca((prev) => ({ ...prev, date: event.target.value }))}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Hora
                    <input
                      type="time"
                      value={consultaPicoPlaca.time}
                      onChange={(event) => setConsultaPicoPlaca((prev) => ({ ...prev, time: event.target.value }))}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={consultandoPicoPlaca}
                    className="rounded-xl border border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {consultandoPicoPlaca ? 'Consultando...' : 'Consultar'}
                  </button>

                  {resultadoPicoPlaca && (
                    <div className={`rounded-xl border px-3 py-2 text-sm ${resultadoPicoPlaca.is_restricted ? 'border-red-500/60 bg-red-500/10 text-red-200' : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'}`}>
                      <strong>{resultadoPicoPlaca.is_restricted ? 'Restricción activa' : 'Sin restricción'}</strong>
                      <div>{resultadoPicoPlaca.reason}</div>
                    </div>
                  )}

                  <label className="flex items-center gap-3 text-sm text-[#d1d5db]">
                    <input
                      type="checkbox"
                      checked={notificacionesAutomaticas}
                      onChange={() => setNotificacionesAutomaticas((prev) => !prev)}
                      className="h-4 w-4 accent-violet-500"
                    />
                    Activar notificaciones automáticas
                  </label>
                </div>
              </form>

              <RoutePlanner onRouteCalculated={handleRutaCalculada} />

              <form onSubmit={handleGuardarRuta} className="mt-6 rounded-2xl border border-violet-500/40 bg-[#090a0f] p-4">
                <div className="mb-3">
                  <p className="text-sm text-blue-300">Guardado rápido</p>
                  <h4 className="text-xl font-bold text-white">Rutas favoritas</h4>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-[#d1d5db] md:col-span-2">
                    Nombre de la ruta
                    <input
                      type="text"
                      name="name"
                      value={nuevaRuta.name}
                      onChange={handleRutaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Origen
                    <input
                      type="text"
                      name="origin"
                      value={nuevaRuta.origin}
                      onChange={handleRutaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Destino
                    <input
                      type="text"
                      name="destination"
                      value={nuevaRuta.destination}
                      onChange={handleRutaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Distancia (km)
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="distanceKm"
                      value={nuevaRuta.distanceKm}
                      onChange={handleRutaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Duración (min)
                    <input
                      type="number"
                      step="1"
                      min="1"
                      name="durationMin"
                      value={nuevaRuta.durationMin}
                      onChange={handleRutaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={guardandoRuta}
                    className="rounded-xl border border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {guardandoRuta ? 'Guardando...' : 'Guardar ruta'}
                  </button>

                  {mensajeRuta && (
                    <p className="text-sm text-blue-200">{mensajeRuta}</p>
                  )}
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {rutasFavoritas.length === 0 ? (
                  <p className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 text-sm text-[#d1d5db]">
                    Aún no tienes rutas favoritas guardadas.
                  </p>
                ) : (
                  rutasFavoritas.map((ruta) => (
                    <div key={ruta.id} className="flex flex-col gap-3 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{ruta.name}</p>
                        <h5 className="mt-1 text-lg font-bold text-white">{ruta.origin} → {ruta.destination}</h5>
                        <p className="text-sm text-[#d1d5db]">
                          {ruta.distance_km ? `${Number(ruta.distance_km).toFixed(1)} km` : 'Distancia no disponible'}
                          {' · '}
                          {ruta.duration_min ? `${ruta.duration_min} min` : 'Duración no disponible'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEliminarRuta(ruta.id)}
                        className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleGuardarAlerta} className="mt-6 rounded-2xl border border-blue-500/40 bg-[#090a0f] p-4">
                <div className="mb-3">
                  <p className="text-sm text-blue-300">Alertas</p>
                  <h4 className="text-xl font-bold text-white">Historial de movilidad</h4>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Tipo
                    <select
                      name="type"
                      value={nuevaAlerta.type}
                      onChange={handleAlertaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    >
                      <option value="pico">Pico y Placa</option>
                      <option value="clima">Clima vial</option>
                      <option value="bloqueo">Bloqueo</option>
                      <option value="general">General</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db]">
                    Severidad
                    <select
                      name="severity"
                      value={nuevaAlerta.severity}
                      onChange={handleAlertaChange}
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    >
                      <option value="info">Info</option>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-[#d1d5db] md:col-span-2">
                    Mensaje
                    <textarea
                      name="message"
                      value={nuevaAlerta.message}
                      onChange={handleAlertaChange}
                      rows="3"
                      className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
                    />
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={guardandoAlerta}
                    className="rounded-xl border border-violet-500 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {guardandoAlerta ? 'Guardando...' : 'Guardar alerta'}
                  </button>

                  {mensajeAlerta && (
                    <p className="text-sm text-blue-200">{mensajeAlerta}</p>
                  )}
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {alertas.length === 0 ? (
                  <p className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-4 text-sm text-[#d1d5db]">
                    No hay alertas registradas en este historial.
                  </p>
                ) : (
                  alertas.map((alerta) => {
                    const resumen = buildAlertSummary(alerta);
                    const colorClass = alerta.severity === 'high' ? 'border-red-500/60 bg-red-500/10 text-red-200' : alerta.severity === 'medium' ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-200' : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200';

                    return (
                      <div key={alerta.id} className={`rounded-xl border p-4 ${colorClass}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em]">{resumen.title}</p>
                            <h5 className="mt-1 text-lg font-bold text-white">{resumen.severity.toUpperCase()}</h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEliminarAlerta(alerta.id)}
                            className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                          >
                            Eliminar
                          </button>
                        </div>
                        <p className="mt-2 text-sm">{resumen.text}</p>
                        <p className="mt-2 text-xs opacity-80">{resumen.createdAtLabel}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
