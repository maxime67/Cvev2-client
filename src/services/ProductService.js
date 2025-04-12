import { makeApiGetRequest } from "./ApiService";

export const findProductByName = async (product) => {
    try {
        return await makeApiGetRequest('api/product/name/' + product); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
};

export const findProductById = async (productId) => {
    try {
        return await makeApiGetRequest('api/product/' + productId); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
};

export const findProductByVendorId = async (vendorId) => {
    try {
        return await makeApiGetRequest('api/product/vendor/id/' + vendorId); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
};

export const findAllProductsByName = async (productName) => {
    try {
        return await makeApiGetRequest('api/product/name/' + productName); // Correction de l'URL (ajout du /)
    } catch(error){
        console.error('Error fetching product by name:', error);
        throw error;
    }
}
export const findAllProductByVendor = async (vendor) => {
    try {
        return await makeApiGetRequest('api/product/vendor/' + vendor); // Correction de l'URL
    } catch(error){
        console.error('Error fetching products by vendor:', error);
        throw error;
    }
};