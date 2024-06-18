"use server";

import api from './wc_api';

export const getProductsByCategory = async (categoryId: number, page: number, perPage: number) => {
  try {
    const response = await api.get('products', {
      category: categoryId,
      page,
      per_page: perPage // Adjust as per your API limits
      // orderby: 'sku',
    });

    // Extract pagination headers
    const totalPages = parseInt(response.headers['x-wp-totalpages']);
    const totalProducts = parseInt(response.headers['x-wp-total']);

    return {
      data: response.data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts
      },
    };
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    throw error; // Propagate the error to handle it in the component
  }
};