import FormularioAcceso from '../src/components/FormularioAcceso.jsx';
import { VISTAS } from '../controllers/vistas.js';
import { TIEMPOS_VIDEO } from '../src/config/tiemposVideo.js';

const configLogin = {
  titulo: 'Bienvenido de nuevo',
  descripcion: 'Inicia sesión para continuar tu camino.',
  etiquetaEnvio: 'Iniciar sesión',
  textoAlterno: '¿Todavía no tienes cuenta?',
  enlaceAlterno: 'Crear cuenta',
  rutaAlterna: VISTAS.CREAR_CUENTA,
  mensajeEnvio: 'El formulario está listo. La conexión para iniciar sesión se añadirá en la siguiente etapa.',
  tiempoEnvio: TIEMPOS_VIDEO.LOGIN.ENVIO,
  campos: [
    {
      name: 'correo',
      label: 'Correo electrónico',
      type: 'email',
      autocomplete: 'email',
      tiempo: TIEMPOS_VIDEO.LOGIN.CORREO,
    },
    {
      name: 'contrasena',
      label: 'Contraseña',
      type: 'password',
      autocomplete: 'current-password',
      tiempo: TIEMPOS_VIDEO.LOGIN.CONTRASENA,
    },
  ],
};

export default function LoginView() {
  return <FormularioAcceso config={configLogin} />;
}
