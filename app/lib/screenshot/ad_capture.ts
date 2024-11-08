import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { resolve } from 'path';

const Ad_Capture = async (sku: string, content: string, langs: string[]) => {
    let browser: puppeteer.Browser | null = null;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log('Rendering images for ' + sku + ' using languages [' + langs + ']');

        await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2 });

        for (const lang of langs) {
            let url = `http://localhost:57538/sku/${sku}/${sku}.${content}.${lang}`;
            console.log(url);

            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
            } catch (error) {
                console.error(`Error navigating to URL: ${url}`, error);
                continue;
            }

            try {
                console.log(`Generating directory for language: ${lang}`);
                const adsDir = resolve(process.cwd(), `./public/ads/${sku}/${lang}`);
                await fs.mkdir(adsDir, { recursive: true });
            } catch (error) {
                console.error(`Error creating directory for language: ${lang}`, error);
                continue;
            }

            try {
                const advert = await page.$$('.advert');

                if (advert.length > 0) {
                    for (let i = 0; i < advert.length; i++) {
                        console.log("Screenshot of .advert: ", i);
                        const ad = advert[i];
                        await ad.screenshot({ path: `public/ads/${sku}/${lang}/${sku}_advert_${i}.${lang}.png` });
                    }
                }
            } catch (error) {
                console.error(`Error capturing .advert screenshots for language: ${lang}`, error);
            }

            try {
                const aplus = await page.$$('.aplus');
                if (aplus.length > 0) {
                    for (let i = 0; i < aplus.length; i++) {
                        const ap = aplus[i];
                        console.log('Screenshot of .aplus ' + i);
                        await ap.screenshot({ path: `public/ads/${sku}/${lang}/${sku}_aplus_${i}.${lang}.png` });
                    }
                }
            } catch (error) {
                console.error(`Error capturing .aplus screenshots for language: ${lang}`, error);
            }
        }
    } catch (error) {
        console.error('Error in Ad_Capture function', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export default Ad_Capture;
