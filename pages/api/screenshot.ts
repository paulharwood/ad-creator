import type { NextApiRequest, NextApiResponse } from 'next';
import * as puppeteer from 'puppeteer';

const Screenshot = async (req: NextApiRequest, res: NextApiResponse) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2});
    await page.goto('http://localhost:62591/S_RASP-KET-CP_1000MG_120_80G_M/S_RASP-KET-CP_1000MG_120_80G_M');

    const labels = await page.$$('.label');

  if (labels.length > 0) {
    const label = labels[0];
    await label.screenshot({ path: 'public/label.png' });
  } else {
    res.status(500).json({ message: 'No elements with the class .label were found.' });
  }

    await browser.close();
    res.status(200).json({ message: 'Screenshot taken' });
}

 

export default Screenshot;