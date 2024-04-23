import type { NextApiRequest, NextApiResponse } from 'next';
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';

const Screenshot = async (req: NextApiRequest, res: NextApiResponse) => {
    const { sku } = req.query;

    if (!sku || typeof sku !== 'string') {
        return res.status(400).json({ message: 'Invalid SKU parameter.' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2});
    await page.goto(`http://localhost:57538/sku/${sku}/${sku}`);

    const labels = await page.$$('.label');

    if (labels.length > 0) {
        const front = labels[0];
        await front.screenshot({  path:`public/sku/${sku}/${sku}_label_front.png` , omitBackground: true });
        const back = labels[1];
        await back.screenshot({  path:`public/sku/${sku}/${sku}_label_back.png` , omitBackground: true });
    } else {
        await browser.close();
        return res.status(500).json({ message: 'No elements with the class .label were found.' });
    }


      // // Define the path for the public HTML file
      const adsDir = resolve(process.cwd(), `./public/ads/${sku}`);
      // // Ensure the public directory exists
      await fs.mkdir(adsDir, { recursive: true });

    const advert = await page.$$('.advert');

    if (advert.length > 0) {
        for (let i = 0; i < advert.length; i++) {
            const ad = advert[i];
            await ad.screenshot({ path: `public/ads/${sku}/${sku}_advert_${i}.png` });
        }
    } else {
        await browser.close();
        return res.status(500).json({ message: 'No elements with the class .advert were found.' });
    }

    const aplus = await page.$$('.aplus');

    if (aplus.length > 0) {
        for (let i = 0; i < aplus.length; i++) {
            const ap = aplus[i];
            await ap.screenshot({ path: `public/ads/${sku}/${sku}_aplus_${i}.png` });
        }
    } else {
        await browser.close();
        return res.status(500).json({ message: 'No elements with the class .aplus were found.' });
    }

    await browser.close();
    return res.status(200).json({ message: `Screenshot taken of elements in http://localhost:57538/sku/${sku}/${sku}` });




}

export default Screenshot;