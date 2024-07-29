import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import handlebars from 'handlebars';
import { getSkuData, SkuData } from "@/app/lib/actions";
// Omit this line if loading from a CDN
import translate from "translate";

// template helpers
import Bullets from '@/app/lib/template_helpers/bullets';
import Features from '@/app/lib/template_helpers/features';
import ProductDescription from '@/app/lib/template_helpers/productDescription';


handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
// translate.key = process.env.DEEPL_KEY;
translate.key = "6df78c7a-1def-4d2f-a7ed-b0e3a2217524";

// Assuming the structure of the product data
interface ProductData {
    label_title: string,
    keyword_title: string,
    keyword_title_size: string,
    feature_icons: string,
    suggested_use: string,
    use_by_date: string,
    is_vegetarian: string,
    is_vegan: string,
    feature_image_code: string,
    brand_colour: string,
    three_d_type: string,
    three_d_shape: string,
    three_d_template: string,
    three_d_colour: string,
    three_d_size: string,
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
    AD_BULLETS_HTML: string,
    CUSTOM_BULLETS_HTML: string,
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
    // console.log(skuData.message); // Log the message returned by the function

    // convert the wordpress format to k/v object
    const transformedData: ProductData = {};
    for (const { key, value } of skuData.product.meta_data) {
      transformedData[key] = value;
    }
    skuData.product.meta_data = transformedData;

    if (skuData.template) {
      // console.log("Template:", skuData.template); // Log the template if available
    }
    // console.log(skuData);

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

  // #TODO refactor the actions to handle this better 
  const { tpl, sku, content} = req.query;
  let { numLang } = req.query;

  // Ensure numLang is a string
  const rawNumLang: string | undefined = numLang as string;

  // Ensure numLang is a number
  const numLangNumber: number = parseInt(rawNumLang, 10);

  // Define the maximum number of languages dynamically based on the length of the languages array
  let languages = ['en', 'de', 'it', 'es', 'fr'];
  const maxLanguages = languages.length;

  if (isNaN( numLangNumber) ||  numLangNumber < 1 ||  numLangNumber > maxLanguages) {
    // Handle the case where  numLangNumber is not a valid number or exceeds the limit
    return res.status(400).json({ error: 'Invalid or exceeded number of languages' });
  }

  // Slice the languages array based on  numLangNumber
  languages = languages.slice(0,  numLangNumber);

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
  if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Invalid Template content type.' });
  }
  try {
    const wcRet = await fetchSkuData(wcData); // Fetch product data

    if (wcRet.product.meta_data) {

      // convert TRUE to block for display:block
      const metaData = convertTrue(wcRet.product.meta_data);
      
      // console.log(metaData);
      // pull in some wc specifics
      metaData.sku = wcRet.product.sku;
      metaData.product_id = wcRet.product.id;
      metaData.description = wcRet.product.description;

      const minWords = 30;

      metaData.product_description = ProductDescription({ description: metaData.description, minWords }) as string;

      
      const featuresArr = Features({ description: metaData.description }) as string[];

      if (featuresArr.length > 0) {
        metaData.feature_one = featuresArr[0];
        metaData.feature_two = featuresArr[1];
        metaData.feature_three = featuresArr[2];
        metaData.feature_four = featuresArr[3];
      }

      if (metaData.feature_image_code !== undefined && metaData.feature_image_code !== null && metaData.feature_image_code !== '') {
          // Ensure feature_image_code is a string before checking length
          if (metaData.feature_image_code.toString().length === 1) {
              metaData.feature_image_code = '0' + metaData.feature_image_code;
          }
      }

        // Define the type for translations object
        type Translations = {
          [key: string]: {
            [key: string]: string;
          };
        };

        const translations: Translations = {};

      // Define the type for langData object
      type LangData = {
        suggested_use: string;
        description: string[];
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
        description: metaData.description,
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

      const units = metaData.units_in_pack.split(" ");

      // separate units_count and units_type
      metaData.units_count= units[0];
      metaData.units_type= units[1];

      // translate the ingredients
      // metaData.ingredients = await translate(metaData.ingredients, "es");

      // // Resolve paths to the template
      const templateDir = resolve(process.cwd(), `./public/templates/${tpl}/`);
      const templatePath = join(templateDir, `${tpl}_template.${content}.html`);

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
      
        //collect the languages into one 
        languages.forEach( async (language) => {
         if (language !== 'en') { // dont need english

          // Join the ingredients and suggested_use together      
            metaData.ingredients =  metaData.ingredients + "<br /><b>" + language.toUpperCase() + "</b> " + "(" + translations[language].keyword_title + ") " + translations[language].ingredients + " ";
            metaData.suggested_use =  metaData.suggested_use + "<br /><b>" + language.toUpperCase() + "</b> " + translations[language].suggested_use + " ";
            
            if (metaData.ALLERGENS_EN == '') {metaData.ALLERGENS_EN = 'None';}
            metaData.ALLERGENS_EN = metaData.ALLERGENS_EN + "<br /><b>" + language.toUpperCase() + "</b> " + translations[language].ALLERGENS_EN + " ";

            //console.log(metaData.ingredients);
          }
          //console.log('LANGUAGE:', language);
          // merge the language objects with the metadata
          // const outputData = { ...metaData, ...translations[language] };
        });

      languages.forEach( async (language) => {
         
          metaData.AD_BULLETS = translations[language].AD_BULLETS;
          metaData.KEY_FEATURE_TITLE = translations[language].KEY_FEATURE_TITLE;
          metaData.KEY_FEATURE_COPY = translations[language].KEY_FEATURE_COPY;

          // generate ad bullets
          let bullets_text = metaData.AD_BULLETS;

          // TODO remove all this and replace with inputs from metadata
          let iconsText = metaData.feature_icons;
          let icons = iconsText.split(',');
          if (icons.length >= 5 ) {
            icons = icons.slice(0, 5); // ensure we only have 5  
          }
   
          metaData.AD_BULLETS_HTML = Bullets({ bullets_text, icons}) as string;

          bullets_text = "Resealable for Freshness\nResponsibly Sourced\nHighest Grade ISO & Certified";
          iconsText = "fa-check-square, fa-recycle, fa-certificate";
          icons = iconsText.split(',');

          metaData.CUSTOM_BULLETS_HTML = Bullets({ bullets_text, icons}) as string;
          metaData.language = language;


          // console.log('language', metaData.language);
          // Render the template with the product data and save it to the public folder
          const finalHTML = template(metaData);
          const publicPath = join(publicDir, `${sku}.${content}.${language}.html`);

          // Write the rendered HTML to a file
          await fs.writeFile(publicPath, finalHTML, 'utf8');

        });

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


