import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons'; 

interface GenerateImagesProps {
  sku: string;
  content: string;
  langs: string[]; //
}

const GenerateImages: React.FC <GenerateImagesProps> = ({ sku, content, langs }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);


  // 

  const imageGenerate = async () => {
    const url = `/api/generate?sku=${sku}&content=${content}&langs=${langs}`;
    console.log('Generating adverts for ' + url);

    try {
      setIsLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={imageGenerate} disabled={isLoading}>
        <FontAwesomeIcon icon={faFileImport} />
      </button>
      {isLoading && <div>Loading...</div>}
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
};

export default GenerateImages;