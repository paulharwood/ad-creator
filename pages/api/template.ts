import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';
import { getSkuData, SkuData } from "@/app/actions";
// Omit this line if loading from a CDN
import translate from "translate";
import { metadata } from '@/app/layout';

translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
// translate.key = process.env.DEEPL_KEY;
translate.key = "6d6577df-6c4e-4e2a-924e-3d5b29c67d74:fx";

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
async function fetchSkuData(wcData: SkuData): Promise<SkuData> {

  type ProductData = {
  [key: string]: any;
};

  try {
    const skuData: SkuData = await getSkuData(wcData); // Call the getSkuData function with the SKU parameter
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


// utility function to convert TRUE statements to display:block for CSS rules
function convertTrue(obj: { [key: string]: string }): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === 'TRUE') {
        result[key] = 'block';
      } else {
        result[key] = obj[key];
      }
    }
  }

  return result;
}

const Template = async (req: NextApiRequest, res: NextApiResponse, wcData: SkuData) => {
  // const { tpl = 'demo',  sku = 'S_RASP-KET-CP_1000MG_120_80G_M'  } = req.query; // Template name from query parameter

  // #TODO refactor the actions to handle this better 
  const { tpl, sku, multiLang} = req.query;

    // Make sure wcData is an object before attempting to set its property
    if (!wcData) {
        // Initialize wcData if it's not already
        wcData = {} as SkuData; 
    }

  wcData.sku = Array.isArray(sku) ? sku[0] : sku;

  if (!sku || typeof sku !== 'string') {
      return res.status(400).json({ message: 'Invalid SKU parameter.' });
  }
  if (!tpl || typeof tpl !== 'string') {
      return res.status(400).json({ message: 'Invalid Template.' });
  }

  try {
    const wcRet = await fetchSkuData(wcData); // Fetch product data

    if (wcRet.product.meta_data) {

      // convert TRUE to block for display:block
      const metaData = convertTrue(wcRet.product.meta_data);
      
      // pull in some wc specifics
      metaData.sku = wcRet.product.sku;
      metaData.product_id = wcRet.product.id;


      // create a metadata set for each language and translate the values.
      // The languages we are going to translate
      const languages = ['en','de','it','es','fr'];
      
        // Define the type for translations object
        type Translations = {
          [key: string]: {
            [key: string]: string;
          };
        };

        const translations: Translations = {};

      if (multiLang) {  // multiple language templates

      // Define the type for langData object
      type LangData = {
        suggested_use: string;
        ingredients: string;
        label_title: string;
        keyword_title: string;
        AD_BULLETS: string;
        KEY_FEATURE_TITLE: string;
        KEY_FEATURE_COPY: string;
        ALLERGENS_EN: string;
        keyword_subtitle: string;
      };

      //console.log(metaData);
      // extract the metadata we need, translatable
      const langData = {
        suggested_use: metaData.suggested_use,
        ingredients: metaData.ingredients,
        label_title: metaData.label_title,
        keyword_title: metaData.keyword_title,
        AD_BULLETS: metaData.AD_BULLETS,
        KEY_FEATURE_TITLE: metaData.KEY_FEATURE_TITLE,
        KEY_FEATURE_COPY: metaData.KEY_FEATURE_COPY,
        ALLERGENS_EN: metaData.ALLERGENS_EN || 'None',
        keyword_subtitle:  metaData.keyword_subtitle
      }

        // Loop through each language in the languages array
        for (const language of languages) {
          translations[language] = {};
          // Loop through each key in langData object
          for (const key in langData) {
            // Translate the value of each key to the current language
            const translatedValue = await translate(langData[key as keyof LangData], { from: 'en', to: language });
            translations[language][key] = translatedValue;
          }
        }

      console.log(translations);
      // console.log(langData);

    }

      const units = metaData.units_in_pack.split(" ");

      // separate units_count and units_type
      metaData.units_count= units[0];
      metaData.units_type= units[1];

      // translate the ingredients
      // metaData.ingredients = await translate(metaData.ingredients, "es");

      // // Resolve paths to the template
      const templateDir = resolve(process.cwd(), `./public/templates/${tpl}/`);
      const templatePath = join(templateDir, `${tpl}_template.html`);

      // // Read and compile the Handlebars template
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      // // Define the path for the public HTML file
      const publicDir = resolve(process.cwd(), `./public/sku/${sku}`);
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
      

      if (multiLang) {

        //collect the languages into one 
        languages.forEach( async (language) => {
         if (language !== 'en') { // dont need english

            
          // Join the ingredients and suggested_use together      
            metaData.ingredients =  metaData.ingredients + "<br /><b>" + language.toUpperCase() + "</b> " + "(" + translations[language].keyword_title + ") " + translations[language].ingredients + " ";
            metaData.suggested_use =  metaData.suggested_use + "<br /><b>" + language.toUpperCase() + "</b> " + translations[language].suggested_use + " ";
            
            if (metaData.ALLERGENS_EN == '') {metaData.ALLERGENS_EN = 'None';}
            metaData.ALLERGENS_EN = metaData.ALLERGENS_EN + "<br /><b>" + language.toUpperCase() + "</b> " + translations[language].ALLERGENS_EN + " ";

            console.log(metaData.ingredients);
          }
          console.log('LANGUAGE:', language);
          // merge the language objects with the metadata
          // const outputData = { ...metaData, ...translations[language] };
        });

      languages.forEach( async (language) => {
         
          metaData.AD_BULLETS = translations[language].AD_BULLETS;
          metaData.KEY_FEATURE_TITLE = translations[language].KEY_FEATURE_TITLE;
          metaData.KEY_FEATURE_COPY = translations[language].KEY_FEATURE_COPY;

          // console.log(metaData);

          // Render the template with the product data and save it to the public folder
          const finalHTML = template(metaData);
          const publicPath = join(publicDir, `${sku}.${language}.html`);

          // Write the rendered HTML to a file
          await fs.writeFile(publicPath, finalHTML, 'utf8');

        });


      } else {

      // just english

        // Render the english template with the product data and save it to the public folder
        const finalHTML = template(metaData);
        const publicPath = join(publicDir, `${sku}.en.html`);

        // Write the rendered HTML to a file
        await fs.writeFile(publicPath, finalHTML, 'utf8');

      }
     
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
