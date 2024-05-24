const fs = require('fs');
 const path = require('path');
 const csv = require('csv-parser');

 const csvFilePath = process.argv[2] || './public/sku/data/rs_all_skus.csv'; // Default CSV file if no argument is provided
 const jsonFilePath = process.argv[3] || './public/sku/data/rs_all_skus.json'; // Default JSON output file if no argument is provided

 function csvToJson(csvFilePath, jsonFilePath) {
   const results = [];

   fs.createReadStream(path.resolve(csvFilePath))
     .pipe(csv())
     .on('data', (data) => {
       // Convert numLang to a number
       data.numLang = parseInt(data.numLang, 10);
       // Add a default status
       data.status = 'pending';
       // Add the data to the results array
       console.log(data)
       results.push(data);
     })
     .on('end', () => {
       // Write the results array to a JSON file
       fs.writeFile(path.resolve(jsonFilePath), JSON.stringify(results, null, 2), (err) => {
         if (err) {
           console.error('Error writing JSON file:', err);
         } else {
           console.log(`JSON file has been saved to ${jsonFilePath}`);
         }
       });
     });
 }

 csvToJson(csvFilePath, jsonFilePath);