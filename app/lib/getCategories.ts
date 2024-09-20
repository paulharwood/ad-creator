"use server";

import api from './wcApi';

/**
 * Fetches product categories from the WooCommerce API.
 * @returns A promise that resolves to an array of categories or an empty array in case of an error.
 */
export const getCategories = async (perPage = 100, page = 1) => {
  // Debugging statements to ensure environment variables are loaded correctly
  try {
    // Make an API call to fetch product categories
    const response = await api.get('products/categories', {
      per_page: perPage, // Specify the number of categories to retrieve per page
      page: page, // Specify the page number to retrieve
    });
    // Return the fetched categories data
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return an empty array in case of an error
    return [];
  }
};

