
export const errorConfig = {
  "not-found": { //not-found = situación de recurso o ruta inexistente
    code: "404",
    title: "Recurso no encontrado",
    description: "La página que estás buscando no existe o ha sido movida.",
    primaryAction: "Volver al inicio",
    showPrimaryButton: (path: string) => {
      return path !== '/';
    },
    alertTitle: "Error 404",
    alertMessage:
      "La página solicitada no pudo ser encontrada.",
  },
  "network": {
    code: "NETWORK",
    title: "Sin conexión",
    description: "No fue posible establecer conexión con el servidor. Verificá tu conexión a internet e intentá nuevamente.",
    primaryAction: "Reintentar",
    showPrimaryButton: () => true,
    alertTitle: "Error de red",
    alertMessage:
      "No se pudo completar la solicitud, revise su conexión a internet",
  },
  "server-error": {
    code: 500,
    title: "Error del servidor",
    description: "Ocurrió un problema al procesar tu solicitud. Intentá nuevamente más tarde.",
    primaryAction: "Reintentar",
    showPrimaryButton: () => true,
    alertTitle: "Error 500",
    alertMessage:
      "El servidor encontró un error inesperado y no pudo completar la solicitud.",
  },
  
  "unknown": {
    code: 'Error',
    title: "Algo salió mal",
    description: "Se produjo un error inesperado. Si el problema persiste, intentá recargar la página.",
    primaryAction: "Recargar",
    showPrimaryButton: () => true,
    alertTitle: "Error inesperado",
    alertMessage:
      "Ocurrió un problema que la aplicación no pudo manejar correctamente.",
  }
}