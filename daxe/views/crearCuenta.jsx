import FormularioAcceso from '../src/components/FormularioAcceso.jsx';
import { VISTAS } from '../controllers/vistas.js';
import { TIEMPOS_VIDEO } from '../src/config/tiemposVideo.js';

const configCrearCuenta = {
  titulo: 'Crea tu cuenta',
  descripcion: 'Empieza a moverte con una ruta más clara.',
  etiquetaEnvio: 'Crear cuenta',
  textoAlterno: '¿Ya tienes una cuenta?',
  enlaceAlterno: 'Inicia sesión',
  rutaAlterna: VISTAS.LOGIN,
  mensajeEnvio: 'El formulario está listo. La conexión para crear tu cuenta se añadirá en la siguiente etapa.',
  tiempoEnvio: TIEMPOS_VIDEO.CREAR_CUENTA.ENVIO,
  campos: [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      autocomplete: 'name',
      tiempo: TIEMPOS_VIDEO.CREAR_CUENTA.NOMBRE,
    },
    {
      name: 'correo',
      label: 'Correo electrónico',
      type: 'email',
      autocomplete: 'email',
      tiempo: TIEMPOS_VIDEO.CREAR_CUENTA.CORREO,
    },
    {
      name: 'contrasena',
      label: 'Contraseña',
      type: 'password',
      autocomplete: 'new-password',
      tiempo: TIEMPOS_VIDEO.CREAR_CUENTA.CONTRASENA,
    },
    {
      name: 'confirmar-contrasena',
      label: 'Confirmar contraseña',
      type: 'password',
      autocomplete: 'new-password',
      tiempo: TIEMPOS_VIDEO.CREAR_CUENTA.CONFIRMACION,
      completado: (valores) => Boolean(
        valores['confirmar-contrasena']
        && valores['confirmar-contrasena'] === valores.contrasena,
      ),
    },
  ],
};

export default function CrearCuentaView() {
  return <FormularioAcceso config={configCrearCuenta} />;
}
