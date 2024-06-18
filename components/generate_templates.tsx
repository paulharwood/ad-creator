import React, { useState } from 'react';

interface GenerateTemplatesProps {
  sku: string;
  tpl: string;
  numLang: number;
  content: string;
}

const GenerateTemplates: React.FC<GenerateTemplatesProps> = ({ sku, tpl, numLang, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const templateGenerate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`);
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
      <button onClick={templateGenerate} disabled={isLoading}>
        Generate Template
      </button>
      {isLoading && <div>Loading...</div>}
      {response && <div>{JSON.stringify(response)}</div>}
    </div>
  );
};

export default GenerateTemplates;
