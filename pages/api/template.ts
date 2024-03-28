import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';

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

// Fetch product data from WooCommerce (mock function)
// Replace this with actual WooCommerce API call
async function fetchProductData(): Promise<ProductData> {
  return {
    label_title: 'label_title',
    keyword_title: 'keyword_title',
    keyword_title_size: 'keyword_title_size',
    suggested_use: 'suggested_use',
    use_by_date: 'use_by_date',
    is_vegetarian: 'is_vegetarian',
    is_vegan: 'is_vegan',
    feature_image_code: 'feature_image_code',
    brand_colour: 'brand_colour',
    units_in_pack: 'units_in_pack',
    current_batch_number: 'current_batch_number',
    ingredients: 'ingredients',
    ingredients_fr: 'ingredients_fr',
    ingredients_de: 'ingredients_de',
    ingredients_es: 'ingredients_es',
    ingredients_it: 'ingredients_it',
    barcode_ean: '9171800032179',
    nrv: 'nrv',
    AD_BULLETS: 'AD_BULLETS',
    KEY_FEATURE_TITLE: 'KEY_FEATURE_TITLE',
    KEY_FEATURE_COPY: 'KEY_FEATURE_COPY',
    BULLETS_ES:'BULLETS_ES',
    TITLE_ES:'TITLE_ES',
    COPY_ES:'COPY_ES',
    BULLETS_DE:'BULLETS_DE',
    TITLE_DE:'TITLE_DE',
    COPY_DE:'COPY_DE',
    BULLETS_IT:'BULLETS_IT',
    TITLE_IT:'TITLE_IT',
    COPY_IT:'COPY_IT',
    BULLETS_FR:'BULLETS_FR',
    TITLE_FR:'TITLE_FR',
    COPY_FR:'COPY_FR',
  };
}

const Template = async (req: NextApiRequest, res: NextApiResponse) => {
  const { templateName = 'demo',  sku = 'S_RASP-KET-CP_1000MG_120_80G_M'  } = req.query; // Template name from query parameter

  try {
    const productData = await fetchProductData(); // Fetch product data


    // Resolve paths to the template
    const templateDir = resolve(process.cwd(), `./templates/${templateName}/`);
    const templatePath = join(templateDir, `${templateName}_template.html`);

    // Read and compile the Handlebars template
    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Define the path for the public HTML file
    const publicDir = resolve(process.cwd(), `./public/${sku}`);
    // Ensure the public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // set the source image path 
    const imgDir = templateDir + '/images/';
    // copy the images directory over
    await fs.cp(imgDir, publicDir + '/images/', {recursive: true});

    // Render the template with the product data and save it to the public folder
    const finalHTML = template(productData);
    const publicPath = join(publicDir, `${sku}.html`);

    // Write the rendered HTML to a file
    await fs.writeFile(publicPath, finalHTML, 'utf8');

    // Respond to the request indicating success
    res.status(200).json({ message: 'Template rendered and saved to disk', templateSource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rendering template' });
  }
};

export default Template;
