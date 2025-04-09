import axios from "axios";
import { AuthService } from "./AuthService";

// Configurer l'URL de base
axios.defaults.baseURL = import.meta.env.VITE_APIURL;

// Configurer l'intercepteur pour ajouter automatiquement le token si disponible
axios.interceptors.request.use(
    config => {
        const token = AuthService.getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export const makeApiGetRequest = async (endpoint, options = {}) => {
    try {
        const response = await axios.get(endpoint, options);
        return response.data;
    } catch (error) {
        // Gérer les erreurs spécifiques à l'authentification
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Authentication error:', error.response.data.message);
        }
        console.error(`Error fetching ${endpoint}:`, error);
        throw error; // Propager l'erreur pour une meilleure gestion
    }
};

export const makeApiPostRequest = async (endpoint, data, options = {}) => {
    try {
        const response = await axios.post(endpoint, data, options);
        return response.data;
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
    }
};

export const makeApiPutRequest = async (endpoint, data, options = {}) => {
    try {
        const response = await axios.put(endpoint, data, options);
        return response.data;
    } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        throw error;
    }
};

export const makeApiDeleteRequest = async (endpoint, options = {}) => {
    try {
        const response = await axios.delete(endpoint, options);
        return response.data;
    } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
    }
};