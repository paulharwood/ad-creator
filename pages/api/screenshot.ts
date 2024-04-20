import type { NextApiRequest, NextApiResponse } from 'next';
import * as puppeteer from 'puppeteer';

const Screenshot = async (req: NextApiRequest, res: NextApiResponse) => {
    const { sku } = req.query;

    if (!sku || typeof sku !== 'string') {
        return res.status(400).json({ message: 'Invalid SKU parameter.' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2});
    await page.goto(`http://localhost:62591/${sku}/${sku}`);

    const labels = await page.$$('.label');

    if (labels.length > 0) {
        const label = labels[0];
        await label.screenshot({  path:`public/${sku}/${sku}_label_front.png` , omitBackground: true });
    } else {
        await browser.close();
        return res.status(500).json({ message: 'No elements with the class .label were found.' });
    }

    const advert = await page.$$('.advert');

    if (advert.length > 0) {
        const label = advert[0];
        await label.screenshot({ path:`public/${sku}/${sku}_advert.png` });
    } else {
        await browser.close();
        return res.status(500).json({ message: 'No elements with the class .advert were found.' });
    }

    await browser.close();
    return res.status(200).json({ message: `Screenshot taken of http://localhost:62591/${sku}/${sku}` });
}

export default Screenshot;