import React, { useState } from 'react';
import ActionSelector from './actionSelector';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon, faEbay } from '@fortawesome/free-brands-svg-icons';
import { faFileImport } from '@fortawesome/free-solid-svg-icons'; 
import EcommerceLink from './ecommerceLink'; 
import GenerateImages from './generateImages';
import GenerateTemplates from './generateTemplates';
import { useActivityFeed } from '../lib/context/ActivityFeedContext'; // Add this import
import { useApiWithActivityFeed } from '../lib/hooks/useApiWithActivityFeed'; // Add this import
import Papa from 'papaparse';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  meta_data: { key: string; value: any }[];
}

interface Props {
  products: Product[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const CategorySelectorTable: React.FC<Props> = ({
  products,
  currentPage,
  totalPages,
  loading,
  error,
  handlePrevPage,
  handleNextPage,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedProductDescription, setExpandedProductDescription] = useState<number | null>(null);
  const [expandedProductMeta, setExpandedProductMeta] = useState<number | null>(null);
  const { addMessage } = useActivityFeed(); // Use the activity feed context

  const handleProductSelect = (productId: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  const handleActionChange = (action: string) => {
    addMessage(`Action "${action}" selected for product IDs ${selectedProducts.join(', ')}`); // Add message to activity feed
    console.log(`Action "${action}" selected for product IDs ${selectedProducts.join(', ')}`);
  };

  const toggleDescription = (productId: number) => {
    setExpandedProductDescription(expandedProductDescription === productId ? null : productId);
  };

  const toggleMeta = (productId: number) => {
    setExpandedProductMeta(expandedProductMeta === productId ? null : productId);
  };

  const getMetaField = (meta_data: { key: string; value: any }[], key: string) => {
    const metaField = meta_data.find((field) => field.key === key);
    return metaField ? metaField.value : '';
  };

  const downloadCSV = () => {
    //sku,three_d_template,three_d_type,three_d_shape,three_d_size,three_d_colour,numLang,rs_colour
    const selectedProductsData = products
      .filter((product) => selectedProducts.includes(product.id))
      .map((product) => ({
        sku: product.sku,
        template: getMetaField(product.meta_data, 'three_d_template') || '',
        type: getMetaField(product.meta_data, 'three_d_type') || '',
        shape: getMetaField(product.meta_data, 'three_d_shape') || '',
        colour: getMetaField(product.meta_data, 'three_d_colour') || '',
        size: getMetaField(product.meta_data, 'three_d_size') || '',
        numLang: '5',
        rs_colour: getMetaField(product.meta_data, 'rs_collection') || '',
      }));

    const csv = Papa.unparse(selectedProductsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addMessage('CSV download initiated for selected products.');
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {!loading && products.length > 0 && (
        <div className='relative overflow-x-auto'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 dark:bg-gray-200 leading-relaxed'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th className='px-6 py-3'>
                  <input
                    type='checkbox'
                    name='selectAll'
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='px-6 py-3'>Preview</th>
                <th className='px-6 py-3'>SKU</th>
                <th className='px-6 py-3'>Name</th>
                <th className='px-6 py-3'>Description</th>
                <th className='px-6 py-3'>Meta Fields</th>
                <th className='px-6 py-3'>Template Actions</th>
                <th className='px-6 py-3'>Image Actions</th>
                <th className='px-6 py-3'>To Publish</th>
                <th className='px-6 py-3'>Last Published</th>
                <th className='px-6 py-3 w-1/6'>Channels</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className='border-b dark:bg-gray-200 dark:border-gray-700' key={product.id}>
                  <td className='align-top px-6 py-3'>
                    <input
                      type='checkbox'
                      name='productSelect'
                      value={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                    />
                  </td>
                  <td>
                    <div className={`inline-block h-20 w-20 bg-contain bg-center bg-no-repeat rotate-180`} style={{ backgroundImage: `url('/sku/${product.sku}/${product.sku}_label_front.png')` }}></div>
                    <div className={`inline-block h-20 w-20 bg-contain bg-center bg-no-repeat`} style={{ backgroundImage: `url('/ads/${product.sku}/p/en/${product.sku}_advert_0.en.png')` }}></div>
                  </td>
                  <td className='align-top px-6 py-3'>
                    <Link href={`https://inventory.fitnesshealth.co/?product=${product.sku}`} target='_blank'>
                      {product.sku}
                    </Link>
                  </td>
                  <td className='align-top px-6 py-3'>{product.name}</td>
                  <td className='align-top px-6 py-3'>
                    <button onClick={() => toggleDescription(product.id)}>
                      {expandedProductDescription === product.id ? '[hide description ▲]' : '[show description ▼]'}
                    </button>
                    {expandedProductDescription === product.id && <div>{product.description}</div>}
                  </td>
                  <td className='align-top px-6 py-3'>
                    <div>template: {getMetaField(product.meta_data, 'three_d_template')}</div>
                    <div>type: {getMetaField(product.meta_data, 'three_d_type')}</div>
                    <div>shape: {getMetaField(product.meta_data, 'three_d_shape')}</div>
                    <div>colour: {getMetaField(product.meta_data, 'three_d_colour')}</div>
                    <div>size: {getMetaField(product.meta_data, 'three_d_size')}</div>
                    <div>image_code: {getMetaField(product.meta_data, 'feature_image_code')}</div>
                    <button onClick={() => toggleMeta(product.id)}>
                      {expandedProductMeta === product.id ? '[hide meta ▲]' : '[show meta ▼]'}
                    </button>
                    {expandedProductMeta === product.id && (
                      <ul>
                        {product.meta_data.map((metaField, index) => (
                          <li key={index}>
                            <strong>{metaField.key}:</strong> {metaField.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className='align-top px-6 py-3'>
                    <GenerateTemplates sku={product.sku} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='front' />
                    <GenerateTemplates sku={product.sku} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='back' />
                    <GenerateTemplates sku={product.sku} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='adverts' />
                  </td>
                  <td className='align-top px-6 py-3'>
                    <GenerateImages sku={product.sku} content='front' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} />
                    <GenerateImages sku={product.sku} content='back' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} />
                    <GenerateImages sku={product.sku} content='adverts' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} />
                  </td>
                  <td className='align-top px-6 py-3'></td>
                  <td className='align-top px-6 py-3'></td>
                  <td className='align-top px-6 py-3'>
                    <EcommerceLink
                      platform='amazon'
                      countryCode='co.uk'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='UK'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='de'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='DE'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='es'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='ES'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='it'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='IT'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='fr'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='FR'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='pl'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='PL'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='nl'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='NL'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='amazon'
                      countryCode='se'
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country='SE'
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform='ebay'
                      countryCode='com'
                      identifiers={getMetaField(product.meta_data, 'ebay_sku')}
                      country='US'
                      icon={faEbay}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous Page
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next Page
            </button>
          </div>
          <ActionSelector selectedProducts={selectedProducts} handleActionChange={handleActionChange} />
          <button onClick={downloadCSV} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Download CSV
          </button>
        </div>
      )}

      {!loading && products.length === 0 && <div>No products found.</div>}
    </div>
  );
};

export default CategorySelectorTable;
