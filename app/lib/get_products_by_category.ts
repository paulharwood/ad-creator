"use server";

import api from './wc_api';


interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  description: string;
  meta_data: { key: string; value: any }[]; // Define your metadata structure
}


export const getProductsByCategory = async (
  categoryId: number,
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const response = await api.get('products', {
      category: categoryId,
      page,
      per_page: perPage,
      // Add any other parameters like orderby if needed
    });

    const products: Product[] = response.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      description: product.description,
      meta_data: product.meta_data, // Adjust as per your actual API response structure
    }));

    const totalPages = parseInt(response.headers['x-wp-totalpages']);
    const totalProducts = parseInt(response.headers['x-wp-total']);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Propagate the error to handle it in the component
  }
};