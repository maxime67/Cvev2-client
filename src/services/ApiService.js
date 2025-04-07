// Utilisation d'un export direct sans balise script

import axios from "axios";

export const makeApiRequest = async (endpoint) => {
    try {
        const response = await axios.get(import.meta.env.VITE_APIURL + endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching :', error);
        throw error; // Propager l'erreur pour une meilleure gestion
    }
};