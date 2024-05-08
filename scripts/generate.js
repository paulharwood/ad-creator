#!/usr/bin/env node
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const commandToUrlMap = {
  command1: baseUrl => `http://example1.com/products/${baseUrl.tpl}?sku=${baseUrl.sku}`,
  command2: baseUrl => `https://store.example2.com/${baseUrl.tpl}/items?sku=${baseUrl.sku}`,
  command3: baseUrl => `https://api.example3.com/v1/${baseUrl.tpl}/products/${baseUrl.sku}`,
  command4: baseUrl => `http://shop.example4.com/${baseUrl.tpl}?product_sku=${baseUrl.sku}&details=true`
};

const visitUrlWithSkuAndTpl = async ({ sku, tpl }, command) => {
  const buildUrl = commandToUrlMap[command];
  if (!buildUrl) {
    console.error("Invalid command. Available commands: command1, command2, command3, command4");
    return;
  }

  const url = buildUrl({ sku, tpl });
  console.log(`Visiting URL: ${url}`);
  
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      console.log(`Successfully received 200 OK from: ${url}`);
    } else {
      console.log(`Received status code ${response.status} from: ${url}`);
    }
  } catch (error) {
    console.error(`Error visiting URL: ${url}`, error.message);
  }
};

const processCsv = (csvFilePath, command) => {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await visitUrlWithSkuAndTpl(row, command);
      }
    });
};

if (process.argv.length !== 4) {
  console.error("Usage: node skuUrlVisitor.js <command> <csv_file_path>");
  process.exit(1);
}

const [command, csvFilePath] = process.argv.slice(2);
processCsv(csvFilePath, command);