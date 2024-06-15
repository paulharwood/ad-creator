// utils/woocommerce.ts
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const Wc_api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: 'wc/v3'
});

export default Wc_api;