"use server";

import api from './wcApi';

/**
 * Fetches product categories from the WooCommerce API.
 * @returns A promise that resolves to an array of categories or an empty array in case of an error.
 */
export const getCategories = async () => {
  // Debugging statements to ensure environment variables are loaded correctly
  try {
    // Make an API call to fetch product categories
    const response = await api.get('products/categories');
    // Return the fetched categories data
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return an empty array in case of an error
    return [];
  }
};

