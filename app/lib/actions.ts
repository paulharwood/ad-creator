"use server";

import { z } from "zod";
import api from './wc_api';

// Interface for SKU data
export interface SkuData {
  message: string; // Message indicating the result of the operation
  product?: any;   // Product data fetched from the API
  template?: string; // Template derived from the SKU
  sku?: string;    // SKU value
}

/**
 * Fetches product data based on the SKU.
 * @param wcData - An object containing SKU information.
 * @returns A promise that resolves to an object containing a message, product data, and template.
 */
export async function getSkuData(wcData: SkuData): Promise<SkuData> {
  const sku = wcData.sku;

  // Define a schema to validate the SKU
  const schema = z.object({
    sku: z.string().min(1),
  });

  // Validate the SKU using the schema
  const parse = schema.safeParse({ sku });

  if (!parse.success) {
    // Return an error message if validation fails
    return { message: "Failed to fetch SKU" };
  }

  const data = parse.data;

  console.log("products/?sku=" + data.sku);

  try {
    // Make an API call to fetch product data by SKU
    const response = await api.get("products/?sku=" + data.sku);
    const product = response.data[0];

    // Split the SKU to derive the template
    const template = product.sku.split("_");

    // Return the fetched product data, template, and a success message
    return { message: `Fetched SKU: ${product.sku}`, product, template: template[0] };
  } catch (e) {
    console.log(e);
    // Return an error message if the API call fails
    return { message: "Failed to create sku" };
  }
}

