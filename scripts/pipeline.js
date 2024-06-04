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



/*

[
  {
    sku: 'RS_WHY-CHC_100G',
    three_d_template: 'rs-powder',
    three_d_type: 'powder',
    three_d_shape: 'coarse',
    three_d_size: '0',
    three_d_colour: '#6b4207',
    numLang: '5',
    rs_colour: 'Recovery'
  }
]
*/

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Set the API host
const API_HOST = 'http://localhost:3000';

// Step 1: Generate Template
async function gen_tpl(sku, three_d_template, numLang) {
    const url = `${API_HOST}/api/template?sku=${sku}&tpl=${three_d_template}&multiLang=true&content=&numLang=${numLang}`;
    try {
        const response = await axios.get(url);
        console.log(`Step 1 - gen_tpl for ${sku}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in gen_tpl for ${sku}:`, error);
        return null;
    }
}

// Step 2: Generate Image Labels
async function gen_img_labels(sku, content) {
    const langsString = langs.join(',');
    const url = `${API_HOST}/api/generate?sku=${sku}&content=${content}&langs=en,de,es,it,fr`;
    try {
        const response = await axios.get(url);
        console.log(`Step 2 - gen_img_labels for ${sku}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in gen_img_labels for ${sku}:`, error);
        return null;
    }
}

// Step 3: Render
async function render(sku, rs_colour, pack_contents, pack_contents_colour) {
    const url = `${API_HOST}/api/render?sku=${sku}&rs_colour=${rs_colour}&pack_contents=${pack_contents}&pack_contents_colour=${pack_contents_colour}`;
    try {
        const response = await axios.get(url);
        console.log(`Step 3 - render for ${sku}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in render for ${sku}:`, error);
        return null;
    }
}

// Step 4: Generate Image Ads
async function gen_img_ads(sku) {
    const url = `${API_HOST}/api/generate/ads?sku=${sku}`;
    try {
        const response = await axios.get(url);
        console.log(`Step 4 - gen_img_ads for ${sku}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in gen_img_ads for ${sku}:`, error);
        return null;
    }
}

// Step 5: Post Process
async function post_process(sku) {
    const url = `${API_HOST}/api/post_process?sku=${sku}`;
    try {
        const response = await axios.get(url);
        console.log(`Step 5 - post_process for ${sku}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in post_process for ${sku}:`, error);
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

// Write pipeline inputs to JSON file
async function writePipelineInputs(filePath, inputArray) {
    try {
        const data = JSON.stringify(inputArray, null, 2);
        await fs.writeFile(path.resolve(filePath), data, 'utf8');
    } catch (error) {
        console.error('Error writing pipeline inputs:', error);
    }
}

// Execute Pipeline for a single job
async function executePipeline(inputs, ref) {
    const { sku, three_d_template, content, numLang, rs_colour, pack_contents, pack_contents_colour, langs, public_path, local_path } = inputs;

    let result;
    try {
        result = await gen_tpl(sku, three_d_template, content, numLang);
        if (!result) throw new Error('gen_tpl failed');

        // result = await gen_img_labels(sku, content, langs);
        // if (!result) throw new Error('gen_img_labels failed');

        // result = await render(sku, rs_colour, pack_contents, pack_contents_colour);
        // if (!result) throw new Error('render failed');

        // result = await gen_img_ads(sku);
        // if (!result) throw new Error('gen_img_ads failed');

        // result = await post_process(sku);
        // if (!result) throw new Error('post_process failed');

        // result = await sync(public_path, local_path);
        // if (!result) throw new Error('sync failed');
        
        console.log(`Pipeline execution for ${sku} completed successfully.`);
        inputs.status = 'completed';
        return { ref, status: 'completed', sku };
    } catch (error) {
        console.error(`Pipeline execution for ${sku} failed:`, error);
        inputs.status = 'failed';
        return { ref, status: 'failed', sku, error: error.message };
    }
}

// Main function to run the script
async function main() {
    const inputFilePath = process.argv[2] || './public/sku/data/rs_all_skus.json'; // Default to './public/sku/data/rs_all_skus.json' if no argument is provided
    let inputArray = await readPipelineInputs(inputFilePath);
    if (!inputArray) {
        console.error('Failed to load pipeline inputs.');
        return;
    }

    // Add a unique reference for each job
    inputArray = inputArray.map((inputs, index) => ({ ...inputs, ref: `job_${index + 1}` }));

    // Execute all pipelines in parallel and collect results
    const results = await Promise.all(inputArray.map(inputs => executePipeline(inputs, inputs.ref)));

    // Write back the updated inputs with status
    await writePipelineInputs(inputFilePath, inputArray);

    console.log('All pipeline jobs finished.');
}

main();