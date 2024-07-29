import { JSDOM } from 'jsdom';

type ProductDescriptionProps = {
  description: string;
  minWords: number;
};

export default function ProductDescription({ description, minWords }: ProductDescriptionProps): string {
  const dom = new JSDOM(description);
  const document = dom.window.document;
  const pElements = document.getElementsByTagName('p');
  let pContents: string[] = [];

  for (let i = 0; i < pElements.length && i < 6; i++) {
    const textContent = pElements[i].textContent || '';
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > minWords) {
      pContents.push(pElements[i].outerHTML);
    }
  }

  return pContents.join('');
}