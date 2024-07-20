import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faCloud } from '@fortawesome/free-solid-svg-icons'; 
import { useActivityFeed } from '../lib/context/ActivityFeedContext'; // Add this import
import Link from 'next/link';

interface GenerateTemplatesProps {
  sku: string;
  tpl: string;
  numLang: number;
  content: string;
}

const GenerateTemplates: React.FC<GenerateTemplatesProps> = ({ sku, tpl, numLang, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { addMessage } = useActivityFeed(); // Use the activity feed context

  const templateGenerate = async () => {
    try {
      setIsLoading(true);
      addMessage(`Attempting to generate ${content} template for ${sku}`);
      const res = await fetch(`/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`);
      const data = await res.json();
      setResponse(data);
      // addMessage(`Generated templates for ${sku}: ${JSON.stringify(data)}`); // Add message to activity feed
      addMessage(`✓ Generated ${content} template for ${sku}`); // Add message to activity feed
    } catch (error: any) {
      console.error('Error fetching data:', error);
      addMessage(`Error generating templates for ${sku}: ${error.message}`); // Log error to activity feed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={templateGenerate} disabled={isLoading} className='rounded-full border border-stroke/20 px-1 mr-2'>
        <FontAwesomeIcon icon={faFileImport} />  
      </button>
      {isLoading && <div>Loading...</div>}
      <Link href={`https://media.fitnesshealth.co/sku/${sku}/${sku}_label_${content}.pdf`} rel="noopener noreferrer" className=' px-1 mr-2' target="_blank"><FontAwesomeIcon icon={faCloud} /></Link>
      <Link href={`http://localhost:57538/sku/${sku}/${sku}.${content}.en.html`} rel="noopener noreferrer" target="_blank">{content}</Link>

      {/* {response && <div>{JSON.stringify(response)}</div>} */}
    </div>
  );
};

export default GenerateTemplates;
