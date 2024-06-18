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


     // Calculate pagination information
    const totalPages = Math.ceil(response.data.length / perPage);

    return {
      data: response.data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
      },
    };

    return response.data;
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    throw error; // Propagate the error to handle it in the component
  }
};