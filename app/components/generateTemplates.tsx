import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons'; 
import { useActivityFeed } from '../lib/context/ActivityFeedContext'; // Add this import

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
      const res = await fetch(`/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`);
      const data = await res.json();
      setResponse(data);
      addMessage(`Generated templates for ${sku}: ${JSON.stringify(data)}`); // Add message to activity feed
    } catch (error: any) {
      console.error('Error fetching data:', error);
      addMessage(`Error generating templates for ${sku}: ${error.message}`); // Log error to activity feed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={templateGenerate} disabled={isLoading}>
        <FontAwesomeIcon icon={faFileImport} /> {content}
      </button>
      {isLoading && <div>Loading...</div>}
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
};

export default GenerateTemplates;
