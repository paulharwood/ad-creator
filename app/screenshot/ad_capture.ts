
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';

const Ad_Capture = async (content: string, sku: string) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `http://localhost:57538/sku/${sku}/${sku}.${content}.en`;
    console.log(url);


    await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2});
    await page.goto(url);


    // // Define the path for the public HTML file
    const adsDir = resolve(process.cwd(), `./public/ads/${sku}`);
    // // Ensure the public directory exists
    await fs.mkdir(adsDir, { recursive: true });

    // const advert = await page.$$('.advert');

    // if (advert.length > 0) {
    //     for (let i = 0; i < advert.length; i++) {
    //         const ad = advert[i];
    //         await ad.screenshot({ path: `public/ads/${sku}/${sku}_advert_${i}.png` });
    //     }
    // } else {
    //     await browser.close();
    // }

    // const aplus = await page.$$('.aplus');

    // if (aplus.length > 0) {
    //     for (let i = 0; i < aplus.length; i++) {
    //         const ap = aplus[i];
    //         await ap.screenshot({ path: `public/ads/${sku}/${sku}_aplus_${i}.png` });
    //     }
    // } else {
    //     await browser.close();
    //     return res.status(500).json({ message: 'No elements with the class .aplus were found.' });
    // }

    // await browser.close();
    // return res.status(200).json({ message: `Screenshot taken of elements in http://localhost:57538/sku/${sku}/${sku}.en` });

}

export default Ad_Capture;