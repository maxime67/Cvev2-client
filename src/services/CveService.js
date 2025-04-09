// Utilisation d'un export direct sans balise script

import {makeApiGetRequest} from "./ApiService";

export const findAllCve = async () => {
    try {
        return await makeApiGetRequest('api/cve');
    } catch (error) {
        console.error('Error fetching CVEs:', error);
        throw error;
    }
};

export const findById = async (id) => {
    try {
        return await makeApiGetRequest('api/cve/' + id);
    } catch (error) {
        console.error('Error fetching CVEs:', error);
        throw error;
    }
};

export const findAllCveByProduct = async (vendor) => {
    try {
        return await makeApiGetRequest('api/cve/product/' + vendor);
    } catch (error) {
        console.error('Error fetching CVEs by product:', error);
        throw error;
    }
};

export const findByBaseScoreLimit = async (score) => {
    try {
        return await makeApiGetRequest('api/cve/basescore/' + score);
    } catch (error) {
        console.error('Error fetching CVEs by score:', error);
        throw error;
    }
};



export const findLastCreatedCve = async (limit) => {
    try {
        return await makeApiGetRequest('api/cve/last/' + limit);
    } catch (error) {
        console.error('Error fetching last CVEs:', error);
        throw error;
    }
};