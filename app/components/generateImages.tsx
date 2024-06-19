import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons'; 
import { useActivityFeed } from '../lib/context/ActivityFeedContext'; // Add this import

interface GenerateImagesProps {
  sku: string;
  content: string;
  langs: string[];
}

const GenerateImages: React.FC<GenerateImagesProps> = ({ sku, content, langs }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { addMessage } = useActivityFeed(); // Use the activity feed context

  const imageGenerate = async () => {
    const url = `/api/generate?sku=${sku}&content=${content}&langs=${langs}`;
    console.log('Generating adverts for ' + url);

    try {
      setIsLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
      addMessage(`Generated images for ${sku}: ${JSON.stringify(data)}`); // Add message to activity feed
    } catch (error: any) {
      console.error('Error fetching data:', error);
      addMessage(`Error generating images for ${sku}: ${error.message}`); // Log error to activity feed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={imageGenerate} disabled={isLoading}>
        <FontAwesomeIcon icon={faFileImport} /> {content}
      </button>
      {isLoading && <div>Loading...</div>}
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
};

export default GenerateImages;
