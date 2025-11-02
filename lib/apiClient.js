const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Una clase para manejar las llamadas a la API de SmartRecipe.
 * Puede ser instanciada con o sin un token de autenticación.
 */
export class ApiClient {
  constructor(token = null) {
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.token) {
      this.headers['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async _request(method, path, body = null) {
    const url = `${API_BASE_URL}${path}`;
    const options = {
      method,
      headers: this.headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido en la API' }));
        throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
      }
      // Si no hay contenido, devolvemos un objeto vacío para evitar errores de parseo
      if (response.status === 204) {
        return {};
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${method} ${path}`, error);
      throw error;
    }
  }

  // Métodos para las recetas
  getRecipes = () => this._request('GET', '/recipes');
  getRecipeById = (id) => this._request('GET', `/recipes/${id}`);
  createRecipe = (recipeData) => this._request('POST', '/recipes', recipeData);
  updateRecipe = (id, recipeData) => this._request('PUT', `/recipes/${id}`, recipeData);
  deleteRecipe = (id) => this._request('DELETE', `/recipes/${id}`);

  // Métodos para autenticación
  login = (credentials) => this._request('POST', '/login', credentials);
  register = (userData) => this._request('POST', '/register', userData);
  logout = () => this._request('POST', '/logout');
}

/**
 * Factory function para crear una instancia de ApiClient en el servidor.
 * No tiene acceso a hooks ni al contexto de autenticación del cliente.
 */
export const createApiClient = () => new ApiClient();