import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VideoAcceso from './VideoAcceso.jsx';
import { loginUser, registerUser } from '../services/authService.js';
import { VISTAS } from '../../controllers/vistas.js';

function obtenerTiempoObjetivo(campos, valores, enviado, tiempoEnvio) {
  if (enviado) {
    return tiempoEnvio;
  }

  for (const campo of campos) {
    const estaCompleto = campo.completado
      ? campo.completado(valores)
      : Boolean(valores[campo.name]);

    if (!estaCompleto) {
      return campo.tiempo;
    }
  }

  return tiempoEnvio;
}

function CampoAcceso({ campo, visible, onAlternar, onChange, inputRef }) {
  const id = `acceso-${campo.name}`;
  const esContrasena = campo.type === 'password';

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
          type={esContrasena && visible ? 'text' : campo.type}
          autoComplete={campo.autocomplete}
          minLength={esContrasena ? 8 : undefined}
          required
          value={campo.value}
          onChange={onChange}
          className="w-full min-w-0 bg-transparent px-3.5 py-3 text-[15px] text-gray-50 outline-none"
        />
        {esContrasena && (
          <button
            type="button"
            aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${campo.label.toLowerCase()}`}
            aria-pressed={visible}
            onClick={onAlternar}
            className="shrink-0 px-3 py-2 text-xs font-semibold text-violet-300 hover:text-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            {visible ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function FormularioAcceso({ config }) {
  const navigate = useNavigate();
  const [valores, setValores] = useState(() => Object.fromEntries(
    config.campos.map((campo) => [campo.name, '']),
  ));
  const [contrasenaVisible, setContrasenaVisible] = useState(false);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [estado, setEstado] = useState('');
  const contrasenaRef = useRef(null);
  const confirmarContrasenaRef = useRef(null);
  const tiempoObjetivo = obtenerTiempoObjetivo(
    config.campos,
    valores,
    enviado,
    config.tiempoEnvio,
  );

  const manejarCambio = (event, nombreCampo) => {
    const { value } = event.currentTarget;
    setValores((anteriores) => ({ ...anteriores, [nombreCampo]: value }));
    setEnviado(false);
    setEstado('');

    if (nombreCampo === 'contrasena' || nombreCampo === 'confirmar-contrasena') {
      const contrasena = nombreCampo === 'contrasena'
        ? value
        : contrasenaRef.current?.value ?? '';
      const confirmacion = nombreCampo === 'confirmar-contrasena'
        ? value
        : confirmarContrasenaRef.current?.value ?? '';
      confirmarContrasenaRef.current?.setCustomValidity(
        confirmacion && confirmacion !== contrasena
          ? 'Las contraseñas no coinciden.'
          : '',
      );
    }
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const payload = Object.fromEntries(
      config.campos
        .filter((campo) => campo.name !== 'confirmar-contrasena')
        .map((campo) => [campo.name, valores[campo.name]]),
    );

    setEnviado(true);
    setEstado(config.mensajeEnvio);

    try {
      const respuesta = config.tipo === 'register'
        ? await registerUser({
          name: payload.nombre || '',
          email: payload.correo,
          password: payload.contrasena,
        })
        : await loginUser({
          email: payload.correo,
          password: payload.contrasena,
        });

      const token = respuesta?.data?.token;
      if (token) {
        localStorage.setItem('daxe_token', token);
      }

      if (respuesta?.data?.user) {
        localStorage.setItem('daxe_user', JSON.stringify(respuesta.data.user));
      }

      setEstado(respuesta?.message || 'Operación completada.');

      if (config.tipo === 'register') {
        navigate('/login', { replace: true });
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setEnviado(false);
      setEstado(error?.message || 'No se pudo completar la operación.');
    }
  };

  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-[#090a0f] px-6 py-[88px] text-gray-50 max-sm:px-[18px] max-sm:py-[78px]">
      <VideoAcceso tiempoObjetivo={tiempoObjetivo} />

      <Link
        to={config.rutaAlterna}
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
            {config.titulo}
          </h1>
          <p className="mt-[11px] text-[15px] text-[#c4c1ce]">{config.descripcion}</p>
        </header>

        <form className="grid gap-[19px]" onSubmit={manejarEnvio}>
          {config.campos.map((campo) => {
            const nombreCampo = campo.name;
            const esConfirmacion = nombreCampo === 'confirmar-contrasena';
            const esContrasena = nombreCampo === 'contrasena';

            return (
              <CampoAcceso
                key={nombreCampo}
                campo={{ ...campo, value: valores[nombreCampo] }}
                visible={esConfirmacion ? confirmacionVisible : contrasenaVisible}
                onAlternar={() => {
                  if (esConfirmacion) {
                    setConfirmacionVisible((visible) => !visible);
                  } else {
                    setContrasenaVisible((visible) => !visible);
                  }
                }}
                inputRef={esConfirmacion
                  ? confirmarContrasenaRef
                  : esContrasena
                    ? contrasenaRef
                    : undefined}
                onChange={(event) => manejarCambio(event, nombreCampo)}
              />
            );
          })}
          <button
            type="submit"
            className="mt-0.5 flex min-h-[50px] items-center justify-between rounded-[10px] border border-violet-500 bg-gradient-to-r from-violet-800 via-violet-600 to-blue-600 px-[17px] text-[15px] font-bold text-white transition hover:-translate-y-px hover:brightness-110 motion-reduce:transition-none"
          >
            {config.etiquetaEnvio}
            <span aria-hidden="true" className="text-[21px] font-normal">→</span>
          </button>
          {estado && (
            <p aria-live="polite" className="text-[13px] leading-relaxed text-blue-200">
              {estado}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-[13px] text-[#d1ced9]">
          {config.textoAlterno}
          {' '}
          <Link
            to={config.rutaAlterna}
            className="font-semibold text-blue-300 hover:text-blue-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            {config.enlaceAlterno}
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link to={VISTAS.MAPA} className="font-semibold text-blue-300 hover:text-blue-200 hover:underline">
            Probar el mapa como invitado
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
