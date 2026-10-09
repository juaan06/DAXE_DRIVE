import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import fondoHorizontal from '../src/components/fondo_login.mp4';
import fondoVertical from '../src/components/fondo_login_vertical.mp4';
import { VISTAS } from '../controllers/vistas.js';

const camposPorVista = {
  login: [
    { name: 'correo', label: 'Correo electrónico', type: 'email', autocomplete: 'email', step: 0.3 },
    { name: 'contrasena', label: 'Contraseña', type: 'password', autocomplete: 'current-password', step: 0.68 },
  ],
  'crear-cuenta': [
    { name: 'nombre', label: 'Nombre completo', type: 'text', autocomplete: 'name', step: 0.18 },
    { name: 'correo', label: 'Correo electrónico', type: 'email', autocomplete: 'email', step: 0.38 },
    { name: 'contrasena', label: 'Contraseña', type: 'password', autocomplete: 'new-password', step: 0.6 },
    { name: 'confirmar-contrasena', label: 'Confirmar contraseña', type: 'password', autocomplete: 'new-password', step: 0.82 },
  ],
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const actualizarCoincidencia = (event) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', actualizarCoincidencia);
    return () => mediaQuery.removeEventListener('change', actualizarCoincidencia);
  }, [query]);

  return matches;
}

function CampoAcceso({ campo, contrasenaVisible, onAlternarContrasena, inputRef, onChange }) {
  const id = `acceso-${campo.name}`;
  const esContrasena = campo.type === 'password';
  const tipo = esContrasena && contrasenaVisible ? 'text' : campo.type;

  return (
    <div className="grid gap-2">
      <label className="text-[13px] font-semibold text-[#edeaf5]" htmlFor={id}>
        {campo.label}
      </label>
      <div className="flex min-h-12 items-center rounded-[10px] border border-violet-300/40 bg-[#11121b]/90 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 motion-reduce:transition-none">
        <input
          ref={inputRef}
          id={id}
          name={campo.name}
          type={tipo}
          autoComplete={campo.autocomplete}
          data-video-step={campo.step}
          minLength={esContrasena ? 8 : undefined}
          required
          onChange={onChange}
          className="w-full min-w-0 bg-transparent px-3.5 py-3 text-[15px] text-gray-50 outline-none"
        />
        {esContrasena && (
          <button
            type="button"
            aria-label={`${contrasenaVisible ? 'Ocultar' : 'Mostrar'} ${campo.label.toLowerCase()}`}
            aria-pressed={contrasenaVisible}
            onClick={onAlternarContrasena}
            className="shrink-0 px-3 py-2 text-xs font-semibold text-violet-300 hover:text-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            {contrasenaVisible ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginView({ modo = 'login' }) {
  const esRegistro = modo === 'crear-cuenta';
  const campos = camposPorVista[modo];
  const esMovil = useMediaQuery('(max-width: 700px)');
  const movimientoReducido = useMediaQuery('(prefers-reduced-motion: reduce)');
  const videoRef = useRef(null);
  const progresoCompletado = useRef(0);
  const objetivoProgreso = useRef(0);
  const contrasenaRef = useRef(null);
  const confirmarContrasenaRef = useRef(null);
  const [contrasenaVisible, setContrasenaVisible] = useState(false);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [estado, setEstado] = useState('');
  const origenVideo = esMovil ? fondoVertical : fondoHorizontal;

  const reproducirHastaObjetivo = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    const tiempoObjetivo = video.duration * objetivoProgreso.current;
    if (video.currentTime >= tiempoObjetivo) {
      progresoCompletado.current = objetivoProgreso.current;
      video.pause();
      return;
    }

    if (movimientoReducido) {
      video.currentTime = tiempoObjetivo;
      progresoCompletado.current = objetivoProgreso.current;
      return;
    }

    video.play().catch((error) => {
      console.warn('No se pudo reproducir el video de fondo.', error);
    });
  };

  const avanzarVideo = (siguienteProgreso) => {
    objetivoProgreso.current = Math.max(
      objetivoProgreso.current,
      Math.min(siguienteProgreso, 1),
    );
    reproducirHastaObjetivo();
  };

  const manejarCargaVideo = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    video.currentTime = video.duration * progresoCompletado.current;
    if (objetivoProgreso.current > progresoCompletado.current) {
      reproducirHastaObjetivo();
    }
  };

  const manejarProgresoVideo = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    const tiempoObjetivo = video.duration * objetivoProgreso.current;
    if (video.currentTime >= tiempoObjetivo) {
      progresoCompletado.current = objetivoProgreso.current;
      video.currentTime = tiempoObjetivo;
      video.pause();
    }
  };

  const validarConfirmacion = () => {
    const confirmacion = confirmarContrasenaRef.current;
    const contrasena = contrasenaRef.current;
    if (confirmacion && contrasena) {
      confirmacion.setCustomValidity(
        confirmacion.value && confirmacion.value !== contrasena.value
          ? 'Las contraseñas no coinciden.'
          : '',
      );
    }
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    if (esRegistro) {
      validarConfirmacion();
      if (!event.currentTarget.reportValidity()) {
        return;
      }
    }

    avanzarVideo(1);
    setEstado(esRegistro
      ? 'El formulario está listo. La conexión para crear tu cuenta se añadirá en la siguiente etapa.'
      : 'El formulario está listo. La conexión para iniciar sesión se añadirá en la siguiente etapa.');
  };

  const manejarFoco = (event) => {
    const campo = event.target.closest('[data-video-step]');
    if (campo) {
      avanzarVideo(Number(campo.dataset.videoStep));
    }
  };

  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-[#090a0f] px-6 py-[88px] text-gray-50 max-sm:px-[18px] max-sm:py-[78px]">
      <video
        key={origenVideo}
        ref={videoRef}
        src={origenVideo}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex="-1"
        onLoadedMetadata={manejarCargaVideo}
        onTimeUpdate={manejarProgresoVideo}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05060c]/75 via-[#05060c]/35 to-[#05060c]/70 max-sm:bg-gradient-to-b max-sm:from-[#05060c]/50 max-sm:via-[#05060c]/70 max-sm:to-[#05060c]/85"
      />

      <Link
        to={VISTAS.LOGIN}
        aria-label="DAXE, ir al inicio"
        className="absolute left-[clamp(24px,5vw,72px)] top-[30px] z-10 text-[26px] font-extrabold tracking-[0.11em] text-white"
      >
        DAXE<span className="text-violet-400">.</span>
      </Link>

      <section
        aria-labelledby="titulo-acceso"
        className="relative z-10 w-full max-w-[430px] rounded-[22px] border border-violet-500/70 bg-[#090a0f]/80 p-[clamp(28px,5vw,42px)] shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_32px_rgba(109,40,217,0.12)] backdrop-blur-lg max-sm:rounded-[18px] max-sm:bg-[#090a0f]/85 max-sm:px-[23px] max-sm:py-7"
      >
        <header className="mb-[30px]">
          <p className="mb-[11px] text-[11px] font-bold tracking-[0.18em] text-violet-300">
            MOVILIDAD A TU RITMO
          </p>
          <h1 id="titulo-acceso" className="text-[clamp(27px,6vw,34px)] font-semibold leading-[1.15] tracking-[-0.04em]">
            {esRegistro ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </h1>
          <p className="mt-[11px] text-[15px] text-[#c4c1ce]">
            {esRegistro
              ? 'Empieza a moverte con una ruta más clara.'
              : 'Inicia sesión para continuar tu camino.'}
          </p>
        </header>

        <form className="grid gap-[19px]" onFocusCapture={manejarFoco} onSubmit={manejarEnvio}>
          {campos.map((campo) => {
            const esConfirmacion = campo.name === 'confirmar-contrasena';
            const esContrasena = campo.name === 'contrasena';

            return (
              <CampoAcceso
                key={campo.name}
                campo={campo}
                contrasenaVisible={esConfirmacion ? confirmacionVisible : contrasenaVisible}
                onAlternarContrasena={() => {
                  if (esConfirmacion) {
                    setConfirmacionVisible((visible) => !visible);
                  } else {
                    setContrasenaVisible((visible) => !visible);
                  }
                }}
                inputRef={esConfirmacion ? confirmarContrasenaRef : esContrasena ? contrasenaRef : undefined}
                onChange={esContrasena || esConfirmacion ? validarConfirmacion : undefined}
              />
            );
          })}
          <button
            type="submit"
            className="mt-0.5 flex min-h-[50px] items-center justify-between rounded-[10px] border border-violet-500 bg-gradient-to-r from-violet-800 via-violet-600 to-blue-600 px-[17px] text-[15px] font-bold text-white transition hover:brightness-110 hover:-translate-y-px motion-reduce:transition-none"
          >
            {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
            <span aria-hidden="true" className="text-[21px] font-normal">→</span>
          </button>
          {estado && (
            <p aria-live="polite" className="text-[13px] leading-relaxed text-blue-200">
              {estado}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-[13px] text-[#d1ced9]">
          {esRegistro ? '¿Ya tienes una cuenta?' : '¿Todavía no tienes cuenta?'}
          {' '}
          <Link
            to={esRegistro ? VISTAS.LOGIN : VISTAS.CREAR_CUENTA}
            className="font-semibold text-blue-300 hover:text-blue-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            {esRegistro ? 'Inicia sesión' : 'Crear cuenta'}
          </Link>
        </p>
        <p className="mt-[21px] text-center text-[11px] leading-relaxed text-[#a5a1af]">
          Al continuar, aceptas nuestros términos y política de privacidad.
        </p>
      </section>

      <p className="absolute bottom-6 left-[clamp(24px,5vw,72px)] z-10 text-sm text-white/70">
        Tu ciudad, más cerca.
      </p>
    </main>
  );
}
