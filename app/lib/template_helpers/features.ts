import { JSDOM } from 'jsdom';

type FeaturesProps = {
  description: string;
};

export default function Features({ description }: FeaturesProps): string[] | null {
  const dom = new JSDOM(description);
  const document = dom.window.document;
  const ulElements = document.getElementsByTagName('ul');

  if (ulElements.length < 2) {
    return null;
  }

  const secondUl = ulElements[1];
  const liElements = secondUl.getElementsByTagName('li');
  const liContents: string[] = [];

  for (let i = 0; i < liElements.length; i++) {
    liContents.push(liElements[i].outerHTML);
  }

  return liContents;
}
