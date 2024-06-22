
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';

const Label_Capture = async ( sku: string, content: string) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = `http://localhost:57538/sku/${sku}/${sku}.${content}.en`;

    console.log(url);

    await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2});
    await page.goto(url);
    await page.emulateMediaType('screen');


    // generate a png for the render
    const label = await page.$$('.label');
    await label[0].screenshot({ path:`public/sku/${sku}/${sku}_label_${content}.png` , omitBackground: true });

    // generate a pdf for the printer
    const pdf = await page.pdf({
        path: `public/sku/${sku}/${sku}_label_${content}.pdf`, // Saves pdf to disk.
        height:'225mm',
        width:'130mm',
        printBackground: true,
    });    

    await browser.close();
    return 'success';
}

export default Label_Capture;