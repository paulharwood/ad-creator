// app/page.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return <div>Welcome to the homepage!</div>;
};

export default HomePage;
// // type ProductData = [string, string, string, string, string, string, number, string][];

    //   <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
    //     <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">
    //         <div className="sticky top-0 p-4 w-full h-full">
    //         </div>
    //     </div>
    //     <main role="main" className="w-full flex-grow pt-1 px-3">
    //       <CategorySelector />
    //     </main>
    // </div>
    // <footer className="bg-black mt-auto">
    //     ...
    // </footer>

  // useEffect(() => {
  //   if (selectedCategory) {
  //     const fetchProducts = async () => {
  //       try {
  //         setIsLoading(true);
  //         const res = await api.get('products', {
  //           category: selectedCategory
  //         });
  //         const products = res.data;
  //         const rows: ProductData = products.map((product: any) => [
  //           product.sku,
  //           product.name,
  //           product.type,
  //           product.attributes.find((attr: any) => attr.name === 'Shape')?.options[0] || '',
  //           product.attributes.find((attr: any) => attr.name === 'Size')?.options[0] || '',
  //           product.attributes.find((attr: any) => attr.name === 'Color')?.options[0] || '',
  //           Number(product.attributes.find((attr: any) => attr.name === 'NumLang')?.options[0] || 0),
  //           product.attributes.find((attr: any) => attr.name === 'RsColor')?.options[0] || ''
  //         ]);
  //         setData(rows);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchProducts();
  //   }
  // }, [selectedCategory]);

  // const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedCategory(event.target.value);
  // };

  // const templateGenerate = async (sku: string, tpl: string, numLang: number, content: string) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(`/api/template?sku=${sku}&tpl=${tpl}&multiLang=true&content=${content}&numLang=${numLang}`);
  //     const data = await res.json();
  //     setResponse(data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setIsLoading(false);
  //   }
  // };

  // const imageGenerate = async (sku: string, content: string, lang: string) => {
  //   const url = `/api/generate?sku=${sku}&content=${content}&langs=en,de,es,it,fr`;
  //   console.log('generating adverts for' + url);

  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(url);
  //     const data = await res.json();
  //     setResponse(data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setIsLoading(false);
  //   }
  // };



//  {/*  <div className='"relative text-xs m-6'>
//       {isLoading &&   
//         <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
//           <div className="flex items-center">
//             <span className="text-3xl mr-4">Loading</span>
//             <svg className="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none"
//               viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
//               </path>
//             </svg>
//           </div>
//         </div>
//       }
//       <div className="mb-4">
//         <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
//         <select
//           id="category"
//           value={selectedCategory}
//           onChange={handleCategoryChange}
//           className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//         >
//           <option value="">--Select a Category--</option>
//           {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>
//  <table className='min-w-full text-left text-xs font-light text-surface dark:text-white'>
//         <thead className='bg-gray-100 dark:bg-gray-700'>
//           <tr>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>IMG</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>SKU</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>View</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>three_d_template</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>three_d_type</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>three_d_shape</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>three_d_size</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>three_d_colour</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>numLang</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>rs_colour</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Gen TMPL</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Gen IMG</th>
//             <th className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'>Edit</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index} className='border-b border-neutral-200 dark:border-white/10  hover:bg-gray-800'>
//               <td>
//                 <div className={`inline-block h-20 w-20 bg-contain bg-center bg-no-repeat rotate-180`} style={{backgroundImage:`url('/sku/${item[0]}/${item[0]}_label_front.png')`}}></div>
//                 <div className={` inline-block h-20 w-20 bg-contain bg-center bg-no-repeat`} style={{backgroundImage:`url('/ads/${item[0]}/p/en/${item[0]}_advert_0.en.png')`}}></div>
//               </td>
//               <td> <Link href={`http://localhost:57538/sku/${item[0]}`} rel="noopener noreferrer" target="_blank">{item[0]}</Link> </td>
//               <td className='whitespace-nowrap px-6 py-4'>(<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.front.en`} rel="noopener noreferrer" target="_blank">F</Link>) 
//               (<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.back.en`} rel="noopener noreferrer" target="_blank">B</Link>)
//               (<Link href={`http://localhost:57538/sku/${item[0]}/${item[0]}.adverts.en`} rel="noopener noreferrer" target="_blank">ADS</Link>)
//               </td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[1]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[2]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[3]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[4]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[5]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[6]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>{item[7]}</td>
//               <td className='whitespace-nowrap px-6 py-4'>
//                 <button
//                   className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
//                   onClick={() => templateGenerate(item[0], item[1], item[6], 'content')}
//                 >
//                   Gen TMPL
//                 </button>
//               </td>
//               <td className='whitespace-nowrap px-6 py-4'>
//                 <button
//                   className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
//                   onClick={() => imageGenerate(item[0], 'content', 'en')}
//                 >
//                   Gen IMG
//                 </button>
//               </td>
//               <td className='whitespace-nowrap px-6 py-4'>
//                 <Link href={`http://localhost:57538/edit/${item[0]}`} rel="noopener noreferrer" target="_blank">
//                   <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
//                     Edit
//                   </button>
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div> */}