export default function ErrorManager(status) {
  let message = '';
  switch (status) {
    case 500:
      message = 'Error de servidor';
      break;
    case 401:
      message = 'No autorizado';
      break;
    case 404:
      message = 'No encontrado';
      break;
    case -1:
      message = 'Sin conexión a internet';
      break;
    default:
      message = 'Ocurrió un error';
      break;
  }
  return message;
}
