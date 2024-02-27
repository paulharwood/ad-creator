"use server";

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getSkuData(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    sku: z.string().min(1),
  });
  const parse = schema.safeParse({
    sku: formData.get("sku"),
  });

  if (!parse.success) {
    return { message: "Failed to fetch SKU" };
  }

  const data = parse.data;

  const api = new WooCommerceRestApi({
      url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
      consumerKey: process.env.WC_CONSUMER_KEY,
      consumerSecret: process.env.WC_CONSUMER_SECRET,
      version: 'wc/v3'
    });

  console.log("products/?sku="+data.sku);

  try {
     const response = await api.get("products/?sku="+data.sku);
     const product = response.data[0];
     console.log(product);
    revalidatePath("/");
    return { message: `Fetched SKU: ${product.sku}`, product: product };
  } catch (e) {
    console.log(e);
    return { message: "Failed to create sku" };
  }
}
