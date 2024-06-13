require('dotenv').config({ 
    path: ['.env.local', '.env'] 
})
const express = require('express');
const fs = require('fs');
const path = require('path');
const SellingPartnerAPI = require('amazon-sp-api');

const app = express();
const port = 8080;

console.log(process.env.REFRESH_TOKEN); // Check if the token is correctly loaded

// Amazon SP API Configuration
const sellingPartner = new SellingPartnerAPI({
    region: 'eu',
    refresh_token: process.env.REFRESH_TOKEN,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
});

const uploadImageToAmazon = async (asin, marketplaceId, imagePath) => {
    const imageData = fs.readFileSync(imagePath);
    const imageBase64 = imageData.toString('base64');

    const uploadImageResponse = await sellingPartner.callAPI({
        operation: 'putCatalogItemImages',
        endpoint: 'catalogItems',
        path: {
            asin: asin,
        },
        query: {
            marketplaceIds: [marketplaceId],
        },
        body: {
            images: [
                {
                    marketplaceId: marketplaceId,
                    imageType: 'MAIN', // Adjust as needed (e.g., 'SWATCH', 'PT01', etc.)
                    imageUrl: `data:image/jpeg;base64,${imageBase64}`, // Ensure the image is properly encoded
                },
            ],
        },
    });

    return uploadImageResponse;
};

app.get('/upload-batch', async (req, res) => {
    try {
        const imagesDir = path.join(__dirname, 'amz-test');
        console.log(imagesDir);
        const folders = fs.readdirSync(imagesDir).filter(folder => {
            return fs.statSync(path.join(imagesDir, folder)).isDirectory();
        });

        const uploadPromises = folders.map(async (folder) => {
            const folderPath = path.join(imagesDir, folder);
            const files = fs.readdirSync(folderPath).filter(file => {
                return fs.statSync(path.join(folderPath, file)).isFile();
            });

            const imageUploadPromises = files.map(async (file) => {
                const filePath = path.join(folderPath, file);
                // Assuming the folder name is the ASIN and the marketplace ID is fixed
                const asin = folder;
                const marketplaceId = 'A1F83G8C2ARO7P'; // Replace with your actual marketplace ID
                const assetUrl = await uploadImageToAmazon(asin, marketplaceId, filePath);
                return { file, assetUrl };
            });

            return Promise.all(imageUploadPromises);
        });

        const uploadResults = await Promise.all(uploadPromises);

        const imageReferences = uploadResults.flat();
        fs.writeFileSync('uploads/imageReferences.json', JSON.stringify(imageReferences, null, 2));

        res.json({ message: 'Batch of images uploaded to Amazon successfully.', imageReferences });
    } catch (e) {
        console.error('Error uploading batch of images to Amazon:', e);
        res.status(500).send('Error uploading batch of images to Amazon.');
    }
});

app.post('/create-a-plus-content', async (req, res) => {
    try {
        const imageReferences = JSON.parse(fs.readFileSync('uploads/imageReferences.json'));

        const contentModules = imageReferences.map(imageRef => ({
            contentModuleType: 'IMAGE_TEXT_OVERLAY',
            contentModuleContent: {
                images: [
                    {
                        url: imageRef.assetUrl,
                        altText: imageRef.file,
                    },
                ],
                headline: `Headline for ${imageRef.file}`,
                bodyText: `Body text for ${imageRef.file}`,
            },
        }));

        const contentResponse = await sellingPartner.callAPI({
            operation: 'createContentDocument',
            endpoint: 'aplus',
            body: {
                content: {
                    contentType: 'A_PLUS',
                    contentSubType: 'STANDARD',
                    contentModuleList: contentModules,
                },
            },
        });

        res.send('A+ content created successfully.');
    } catch (e) {
        console.error('Error creating A+ content:', e);
        res.status(500).send('Error creating A+ content.');
    }
});

app.listen(port, () => {
    console.log(`Upload Server running at http://localhost:${port}/`);
});