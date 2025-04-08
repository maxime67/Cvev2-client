import { makeApiRequest } from "./ApiService";

export const findProductByName = async (product) => {
    try {
        return await makeApiRequest('/product/name/' + product); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
};

export const findProductById = async (productId) => {
    try {
        return await makeApiRequest('/product/' + productId); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
};


export const findAllProductByVendor = async (vendor) => {
    try {
        return await makeApiRequest('/product/vendor/' + vendor); // Correction de l'URL
    } catch(error){
        console.error('Error fetching products by vendor:', error);
        throw error;
    }
};