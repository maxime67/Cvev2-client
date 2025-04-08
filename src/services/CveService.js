// Utilisation d'un export direct sans balise script

import {makeApiRequest} from "./ApiService";

export const findAllCve = async () => {
    try {
        return await makeApiRequest('/cve');
    } catch (error) {
        console.error('Error fetching CVEs:', error);
        throw error;
    }
};

export const findAllCveByProduct = async (vendor) => {
    try {
        return await makeApiRequest('/cve/product/' + vendor);
    } catch (error) {
        console.error('Error fetching CVEs by product:', error);
        throw error;
    }
};

export const findByBaseScoreLimit = async (score) => {
    try {
        return await makeApiRequest('/cve/basescore/' + score);
    } catch (error) {
        console.error('Error fetching CVEs by score:', error);
        throw error;
    }
};



export const findLastCreatedCve = async () => {
    try {
        return await makeApiRequest('/cve/last/5');
    } catch (error) {
        console.error('Error fetching last CVEs:', error);
        throw error;
    }
};