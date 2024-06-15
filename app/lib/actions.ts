"use server";

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface SkuData {
  message: string;
  product?: any;
  template?: string;
  sku?: string;
}

export async function getSkuData(wcData: SkuData): Promise<SkuData> {
  const sku = wcData.sku;
  const schema = z.object({
    sku: z.string().min(1),
  });
  const parse = schema.safeParse({ sku });

  if (!parse.success) {
    return { message: "Failed to fetch SKU" };
  }

  const data = parse.data;

  const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
    consumerKey: process.env.WC_CONSUMER_KEY!,
    consumerSecret: process.env.WC_CONSUMER_SECRET!,
    version: 'wc/v3'
  });

  console.log("products/?sku=" + data.sku);

  try {
    const response = await api.get("products/?sku=" + data.sku);
    const product = response.data[0];
    // console.log(product);
    const template = product.sku.split("_");

    return { message: `Fetched SKU: ${product.sku}`, product, template: template[0] };
  } catch (e) {
    console.log(e);
    return { message: "Failed to create sku" };
  }
}