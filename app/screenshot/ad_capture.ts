import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { resolve } from 'path';

const Ad_Capture = async (sku: string, content: string, langs: string[]) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('rendering images for ' + sku + ' using languages [' + langs + ']')


    await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2 });

    for (const lang of langs) {
        let url = `http://localhost:57538/sku/${sku}/${sku}.${content}.${lang}`;
        console.log(url);
        
        await page.goto(url);

        console.log(`Generating directory for language: ${lang}`);
        // Define the path for the public HTML file
        const adsDir = resolve(process.cwd(), `./public/ads/${sku}`);
        // Ensure the public directory exists
        await fs.mkdir(adsDir, { recursive: true });

        const advert = await page.$$('.advert');

        if (advert.length > 0) {
            for (let i = 0; i < advert.length; i++) {
                const ad = advert[i];
                await ad.screenshot({ path: `public/ads/${sku}/${sku}_advert_${i}.${lang}.png` });
            }
        }

        const aplus = await page.$$('.aplus');

        if (aplus.length > 0) {
            for (let i = 0; i < aplus.length; i++) {
                const ap = aplus[i];
                console.log('ad image found ' + i);
                await ap.screenshot({ path: `public/ads/${sku}/${sku}_aplus_${i}.${lang}.png` });
            }
        }
    }

    await browser.close();
};

export default Ad_Capture;