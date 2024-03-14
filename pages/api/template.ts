import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';

// Assuming the structure of the product data
interface ProductData {
  product_title: string;
  product_description: string;
  // Add other product properties as needed
}

// Fetch product data from WooCommerce (mock function)
// Replace this with actual WooCommerce API call
async function fetchProductData(): Promise<ProductData> {
  return {
    product_title: "Example Product Title",
    product_description: "This is a product description"
    // Populate with actual data fetched from WooCommerce
  };
}

const Template = async (req: NextApiRequest, res: NextApiResponse) => {
  const { templateName = 'rs_ads' } = req.query; // Template name from query parameter

  try {
    const productData = await fetchProductData(); // Fetch product data

    // genrate the 3D canvas models 


    // Resolve paths to the template
    const templateDir = resolve(process.cwd(), `./templates/${templateName}/`);
    const templatePath = join(templateDir, `${templateName}.hbs`);

    // Read and compile the Handlebars template
    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Define the path for the public HTML file
    const publicDir = resolve(process.cwd(), `./public/${templateName}`);
    // Ensure the public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // set the source image path 
    const imgDir = templateDir + '/images/';
    // copy the images directory over
    await fs.cp(imgDir, publicDir + '/images/', {recursive: true});

    // Render the template with the product data and save it to the public folder
    const finalHTML = template(productData);
    const publicPath = join(publicDir, `${templateName}.html`);

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
