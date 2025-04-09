// Utilisation d'un export direct sans balise script

import { makeApiGetRequest } from "./ApiService";

export const findVendorById = async (id) => {
    try {
        const result = await makeApiGetRequest('api/vendor/' + id);
        return result;
    } catch(error){
        console.error('Error fetching vendor by ID:', error);
        throw error;
    }
};

export const findAllVendorByName = async (name) => {
    try {
        return await makeApiGetRequest('api/vendor/name/' + name);
    } catch(error){
        console.error('Error fetching vendors by name:', error);
        throw error;
    }
};

export const findAllLastCreated = async () => {
    try {
        const vendorList = await makeApiGetRequest('api/vendor/last/5');
        const returnedList = [];

        for (const vendor of vendorList) {
            const products = await makeApiGetRequest('api/product/vendor/' + vendor.name);
            returnedList.push({
                vendor,
                products
            });
        }

        return returnedList;
    } catch(error){
        console.error('Error fetching last created vendors:', error);
        throw error;
    }
};