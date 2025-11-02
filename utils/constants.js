// src/utils/constants.js
// ########################################################################
// # Archivo: /src/utils/constants.js
// # Descripción: Constantes globales de la aplicación.
// ########################################################################

// ------------------------------------------------------------------------
// --- ¡ACCIÓN REQUERIDA! ---
// Esta URL se gestiona ahora a través de variables de entorno.
// Ver el archivo .env.local en la raíz del proyecto.
// ------------------------------------------------------------------------
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5173/api/v1';

// Claves para el almacenamiento local
export const AUTH_TOKEN_KEY = 'SRP_AUTH_TOKEN';
export const AUTH_USER_KEY = 'SRP_AUTH_USER';