import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';

// Assuming the structure of the product data
interface ProductData {
  title: string;
  // Add other product properties as needed
}

// Fetch product data from WooCommerce (mock function)
// Replace this with actual WooCommerce API call
async function fetchProductData(): Promise<ProductData> {
  return {
    title: "Example Product Title",
    // Populate with actual data fetched from WooCommerce
  };
}

const Template = async (req: NextApiRequest, res: NextApiResponse) => {
  const { templateName = 'rs_ads' } = req.query; // Template name from query parameter

  try {
    const productData = await fetchProductData(); // Fetch product data

    // Resolve paths to the template
    const templateDir = resolve(process.cwd(), './templates');
    const templatePath = join(templateDir, `${templateName}.hbs`);

    // Read and compile the Handlebars template
    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Render the template with the product data
    const finalHTML = template(productData);

    // Define the path for the output HTML file
    const outputDir = resolve(process.cwd(), './output');
    const outputPath = join(outputDir, `${templateName}.html`);

    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write the rendered HTML to a file
    await fs.writeFile(outputPath, finalHTML, 'utf8');

    // Respond to the request indicating success
    res.status(200).json({ message: 'Template rendered and saved to disk', outputPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rendering template' });
  }
};

export default Template;
