import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';
import { getSkuData, SkuData } from "@/app/actions";


// Assuming the structure of the product data
interface ProductData {
    label_title: string,
    keyword_title: string,
    keyword_title_size: string,
    suggested_use: string,
    use_by_date: string,
    is_vegetarian: string,
    is_vegan: string,
    feature_image_code: string,
    brand_colour: string,
    units_in_pack: string,
    current_batch_number: string,
    ingredients: string,
    ingredients_fr: string,
    ingredients_de: string,
    ingredients_es: string,
    ingredients_it: string,
    barcode_ean: string,
    nrv: string,
    AD_BULLETS: string,
    KEY_FEATURE_TITLE: string,
    KEY_FEATURE_COPY: string,
    BULLETS_ES: string,
    TITLE_ES: string,
    COPY_ES: string,
    BULLETS_DE: string,
    TITLE_DE: string,
    COPY_DE: string,
    BULLETS_IT: string,
    TITLE_IT: string,
    COPY_IT: string,
    BULLETS_FR: string,
    TITLE_FR: string,
    COPY_FR: string,
  // Add other product properties as needed
}


// Define an async function to fetch SKU data
async function fetchSkuData(state: SkuData): Promise<SkuData> {

  type ProductData = {
  [key: string]: any;
};

  try {
    const skuData: SkuData = await getSkuData(state); // Call the getSkuData function with the SKU parameter
    console.log(skuData.message); // Log the message returned by the function

    // convert the wordpress format to k/v object
    const transformedData: ProductData = {};
    for (const { key, value } of skuData.product.meta_data) {
      transformedData[key] = value;
    }
    skuData.product.meta_data = transformedData;

    if (skuData.template) {
      console.log("Template:", skuData.template); // Log the template if available
    }

    return skuData; // Return the skuData object
  } catch (error) {
    console.error("Error fetching SKU data:", error); // Log any errors that occur during fetching SKU data
    return { message: "Error fetching SKU data", product: undefined, template: undefined }; // Return an error state
  }
}


const Template = async (req: NextApiRequest, res: NextApiResponse, state: SkuData) => {
  // const { tpl = 'demo',  sku = 'S_RASP-KET-CP_1000MG_120_80G_M'  } = req.query; // Template name from query parameter

  const { tpl, sku } = req.query;

  if (!sku || typeof sku !== 'string') {
      return res.status(400).json({ message: 'Invalid SKU parameter.' });
  }
  if (!tpl || typeof tpl !== 'string') {
      return res.status(400).json({ message: 'Invalid Template.' });
  }

  // set the sku to the state
  state.sku = sku;

  try {
    const wcData = await fetchSkuData(state); // Fetch product data

    console.log(wcData);

    if (wcData.product.meta_data) {
      const metaData = wcData.product.meta_data;
      metaData.sku = wcData.product.sku;

      const units = metaData.units_in_pack.split(" ");

      // separate units_count and units_type
      metaData.units_count= units[0];
      metaData.units_type= units[1];
    

      // // Resolve paths to the template
      const templateDir = resolve(process.cwd(), `./public/templates/${tpl}/`);
      const templatePath = join(templateDir, `${tpl}_template.html`);

      // // Read and compile the Handlebars template
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      // // Define the path for the public HTML file
      const publicDir = resolve(process.cwd(), `./public/${sku}`);
      // // Ensure the public directory exists
      await fs.mkdir(publicDir, { recursive: true });

      // // set the source image path 
      const imgDir = templateDir + '/images/';
      // // copy the images directory over
      await fs.cp(imgDir, publicDir + '/images/', {recursive: true});

          // // set the source image path 
      const cssDir = templateDir + '/css/';
      // // copy the images directory over
      await fs.cp(cssDir, publicDir + '/css/', {recursive: true});  
      
      // // Render the template with the product data and save it to the public folder
      const finalHTML = template(metaData);
      const publicPath = join(publicDir, `${sku}.html`);

      // // Write the rendered HTML to a file
      await fs.writeFile(publicPath, finalHTML, 'utf8');

      // Respond to the request indicating success
      res.status(200).json({ message: 'Template rendered and saved to disk', templateSource });
    } else {
      res.status(500).json({ message: 'Product meta_data not present' });

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rendering template' });
  }
};

export default Template;
