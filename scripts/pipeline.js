/*  Pipeline Script

Step 1 - gen_tpl()

inputs

sku - the Product SKU on woocommerce
tpl - the template we are using e.g. rs-powder or rs-captab
content - the type of content we are generating - e.g. front of pouch, back of pouch or adverts
numLang - the number of languages we are supporting for this template (based on the ingredients size for the packet)

hit the API URL with the above
/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}

Step 2 - gen_img_labels() // (first pass - labels)

inputs

sku - the Product SKU on woocommerce, it will use this to find the template in /public/sku/
content - the type of content we are rendering - front, back or adverts
langs - the array opf languages we are going to output, this is affected by the number of languages above, later languages will be ignored

/api/generate?sku=${sku}&content=${content}&langs=en,de,es,it,fr`);

Step 3 - render()

inputs

sku - the product sku on woocommerce
rs_colour - performance, maintenance, recovery
pack_contents - powder, capsules, pill_creatine etc.. - the collection to make visible
content_colour - the colour of the contents 


/api/render?sku=${sku}&rs_colour=${rs_colour}&pack_contents=${pack_contents}&pack_contents_colour=${pack_contents_colour}

Step 4 - gen_img_ads() // (second pass - adverts)

inputs

sku - the product sku on woocommerce


Step 5 - post_process()

inputs

sku - the product sku on woocommerce

Step 6 - sync()

inputs

public_path - the public path onthe server
local_path - th epublic path on the local machine

*/


const axios = require('axios');
 const fs = require('fs').promises;
 const path = require('path');

 // Set the API host
 const API_HOST = 'http://localhost:3000';

 // Step 1: Generate Template
 async function gen_tpl(sku, tpl, content, numLang) {
     const url = `${API_HOST}/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`;
     try {
         const response = await axios.get(url);
         console.log('Step 1 - gen_tpl:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in gen_tpl:', error);
         return null;
     }
 }

 // Step 2: Generate Image Labels
 async function gen_img_labels(sku, content, langs) {
     const langsString = langs.join(',');
     const url = `${API_HOST}/api/generate?sku=${sku}&content=${content}&langs=${langsString}`;
     try {
         const response = await axios.get(url);
         console.log('Step 2 - gen_img_labels:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in gen_img_labels:', error);
         return null;
     }
 }

 // Step 3: Render
 async function render(sku, rs_colour, pack_contents, pack_contents_colour) {
     const url = `${API_HOST}/api/render?sku=${sku}&rs_colour=${rs_colour}&pack_contents=${pack_contents}&pack_contents_colour=${pack_contents_colour}`;
     try {
         const response = await axios.get(url);
         console.log('Step 3 - render:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in render:', error);
         return null;
     }
 }

 // Step 4: Generate Image Ads
 async function gen_img_ads(sku) {
     const url = `${API_HOST}/api/generate/ads?sku=${sku}`;
     try {
         const response = await axios.get(url);
         console.log('Step 4 - gen_img_ads:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in gen_img_ads:', error);
         return null;
     }
 }

 // Step 5: Post Process
 async function post_process(sku) {
     const url = `${API_HOST}/api/post_process?sku=${sku}`;
     try {
         const response = await axios.get(url);
         console.log('Step 5 - post_process:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in post_process:', error);
         return null;
     }
 }

 // Step 6: Sync
 async function sync(public_path, local_path) {
     const url = `${API_HOST}/api/sync?public_path=${public_path}&local_path=${local_path}`;
     try {
         const response = await axios.get(url);
         console.log('Step 6 - sync:', response.data);
         return response.data;
     } catch (error) {
         console.error('Error in sync:', error);
         return null;
     }
 }

 // Read pipeline inputs from JSON file
 async function readPipelineInputs(filePath) {
     try {
         const data = await fs.readFile(path.resolve(filePath), 'utf8');
         return JSON.parse(data);
     } catch (error) {
         console.error('Error reading pipeline inputs:', error);
         return null;
     }
 }

 // Execute Pipeline
 async function executePipeline(inputs) {
     const { sku, tpl, content, numLang, rs_colour, pack_contents, pack_contents_colour, langs, public_path, local_path } = inputs;

     let result;

     result = await gen_tpl(sku, tpl, content, numLang);
     if (!result) return;

     result = await gen_img_labels(sku, content, langs);
     if (!result) return;

     result = await render(sku, rs_colour, pack_contents, pack_contents_colour);
     if (!result) return;

     result = await gen_img_ads(sku);
     if (!result) return;

     result = await post_process(sku);
     if (!result) return;

     result = await sync(public_path, local_path);
     if (!result) return;

     console.log('Pipeline execution finished.');
 }

 // Main function to run the script
 async function main() {
     const inputFilePath = process.argv[2] || 'pipelineInputs.json'; // Default to 'pipelineInputs.json' if no argument is provided
     const inputs = await readPipelineInputs(inputFilePath);
     if (!inputs) {
         console.error('Failed to load pipeline inputs.');
         return;
     }
     await executePipeline(inputs);
 }

 main();