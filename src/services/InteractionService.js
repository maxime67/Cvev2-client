import { makeApiGetRequest, makeApiPostRequest, makeApiDeleteRequest } from "./ApiService";

export const getAllUserInteractions = async () => {
    try {
        return await makeApiGetRequest('/api/interaction/');
    } catch (error) {
        console.error('Error fetching user interactions:', error);
        throw error;
    }
};

export const getUserInteraction = async (cveId) => {
    try {
        return await makeApiGetRequest(`/api/interaction/${cveId}`);
    } catch (error) {
        console.error('Error fetching user interaction:', error);
        throw error;
    }
};

export const saveUserInteraction = async (cveId, status, notes) => {
    try {
        return await makeApiPostRequest(`/api/interaction/save/${cveId}`, {
            status,
            notes
        });
    } catch (error) {
        console.error('Error saving user interaction:', error);
        throw error;
    }
};

export const deleteUserInteraction = async (cveId) => {
    try {
        return await makeApiDeleteRequest(`/api/interaction/delete/${cveId}`);
    } catch (error) {
        console.error('Error deleting user interaction:', error);
        throw error;
    }
};