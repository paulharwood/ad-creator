"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

type ProductData = [string, string, number, string, string][];

const IndexPage: React.FC = () => {
  const [data, setData] = useState<ProductData>([]);
  const [response, setResponse] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/sku/data/rs_all_skus.csv');
        const csvData = await res.text();
        const rows: ProductData = csvData.trim().split('\n').map(row => row.split(',').map(cell => cell.trim()) as [string, string, number, string, string]);
        setData(rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const templateGenerate = async (sku: string, tpl: string, numLang: number, content: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`);
      const data = await res.json();
      setResponse(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };


  const imageGenerate = async (sku: string, content: string, lang: string) => {
      console.log('generating adverts');

    try {
      setIsLoading(true);
      const res = await fetch(`/api/generate?sku=${sku}&content=${content}&langs=en,de,es,it,fr`);
      const data = await res.json();
      setResponse(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='"relative text-xs m-6'>
		{isLoading &&   
			<div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
				<div className="flex items-center">
					<span className="text-3xl mr-4">Loading</span>
					<svg className="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none"
						viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
						</path>
					</svg>
				</div>
			</div>
		}
      <table className=' min-w-full text-left text-xs font-light text-surface dark:text-white'>
        <thead className='bg-gray-100 dark:bg-gray-700'>
          <tr>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>IMG</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>SKU</th>
						<th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>View</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Template</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Colour</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>rs_type</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Lang</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Gen TMPL</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Gen IMG</th>
            <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className='border-b border-neutral-200 dark:border-white/10  hover:bg-gray-800'>
              <td>
                <div className={`inline-block h-20 w-20 bg-contain bg-center bg-no-repeat rotate-180`} style={{backgroundImage:`url('/sku/${item[0]}/${item[0]}_label_front.png')`}}></div>
                <div className={` inline-block h-20 w-20 bg-contain bg-center bg-no-repeat`} style={{backgroundImage:`url('/ads/${item[0]}/p/en/${item[0]}_advert_0.en.png')`}}></div>
              </td>
              <td> <Link href={`http://localhost:57538/sku/${item[0]}`} rel="noopener noreferrer" target="_blank">{item[0]}</Link> </td>

							<td className='whitespace-nowrap px-6 py-4'>(<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.front.en`} rel="noopener noreferrer" target="_blank">F</Link>) 
							(<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.back.en`} rel="noopener noreferrer" target="_blank">B</Link>)
							(<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.adverts.en`} rel="noopener noreferrer" target="_blank">ADS</Link>)
							</td>
              <td className='whitespace-nowrap px-6 py-4'>{item[1]}</td>
              <td className='whitespace-nowrap px-6 py-4'>{item[3]}</td>
              <td className='whitespace-nowrap px-6 py-4'>{item[4]}</td>
              <td className='whitespace-nowrap px-6 py-4'>{item[2]}</td>
              <td className='whitespace-nowrap px-6 py-4'>
                <button onClick={() => templateGenerate(item[0], item[1], item[2], 'front')}>Front</button> |  
                <button onClick={() => templateGenerate(item[0], item[1], item[2], 'back')}>Back</button> | 
                <button onClick={() => templateGenerate(item[0], item[1], item[2], 'adverts')}>Adverts</button>
              </td>
              <td className='whitespace-nowrap px-6 py-4'>
                <button onClick={() => imageGenerate(item[0], 'front', 'multi')}>Front</button> |  
                <button onClick={() => imageGenerate(item[0], 'back', 'multi')}>Back</button> | 
                <button onClick={() => imageGenerate(item[0], 'adverts', 'multi')}>Adverts</button>
              </td>
              <td><Link href={`https://inventory.fitnesshealth.co/?product=${item[0]}`} rel="noopener noreferrer" target="_blank">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default IndexPage;
