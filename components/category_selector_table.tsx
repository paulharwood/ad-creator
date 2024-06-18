import React, { useState } from 'react';
import ActionSelector from './action_selector';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon, faEbay } from '@fortawesome/free-brands-svg-icons';
import EcommerceLink from './ecommerce_link'; 
import GenerateImages from './generate_images';
import GenerateTemplates from './generate_templates';

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
  const [expandedProductDescription, setExpandedProductDescription] = useState<number | null>(null);
  const [expandedProductMeta, setExpandedProductMeta] = useState<number | null>(null);

  const handleProductSelect = (productId: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };


  const handleActionChange = (action: string) => {
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

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {!loading && products.length > 0 && (
        <div className='relative overflow-x-auto'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 leading-relaxed'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th className='px-6 py-3'>Select</th>
                <th className='px-6 py-3'>SKU</th>
                <th className='px-6 py-3'>Name</th>
                <th className='px-6 py-3'>Description</th>
                <th className='px-6 py-3'>Meta Fields</th>
                <th className='px-6 py-3'>Template Actions</th>
                <th className='px-6 py-3'>Advert Actions</th>
                <th className='px-6 py-3'>To Publish</th>
                <th className='px-6 py-3'>Last Published</th>
                <th className='px-6 py-3 w-1/6'>Channels</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700' key={product.id}>
                  <td  className='align-top px-6 py-3' >
                    <input
                      type="checkbox"
                      name="productSelect"
                      value={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                    />
                  </td>
                  <td className='align-top px-6 py-3'><Link href={`https://inventory.fitneshealth.co/product=`} ></Link>{product.sku}</td>
                  <td className='align-top px-6 py-3'>{product.name}</td>
                  <td className='align-top px-6 py-3'>
                    <button onClick={() => toggleDescription(product.id)}>
                      {expandedProductDescription === product.id ?  '[hide description ▲]' : '[show description ▼]'}
                    </button>
                    {expandedProductDescription === product.id && (
                      <div>
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className='align-top px-6 py-3'>
                    <button onClick={() => toggleMeta(product.id)}>
                      {expandedProductMeta === product.id ?  '[hide meta ▲]' : '[show meta ▼]'}
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
                  <td className='align-top px-6 py-3' >
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.front.en`} rel="noopener noreferrer" target="_blank">F</Link> | 
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.back.en`} rel="noopener noreferrer" target="_blank"> B</Link> | 
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.adverts.en`} rel="noopener noreferrer" target="_blank"> ADS</Link>
                    <GenerateTemplates sku={product.sku} tpl="template1" numLang={3} content="Sample content for template" />
                  </td>
                  <td className='align-top px-6 py-3' >
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.front.en`} rel="noopener noreferrer" target="_blank">F</Link> | 
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.back.en`} rel="noopener noreferrer" target="_blank"> B</Link> | 
                    <Link href={`http://localhost:57538/sku/${product.sku}/${product.sku}.adverts.en`} rel="noopener noreferrer" target="_blank"> ADS</Link>
                    <GenerateImages sku={product.sku} content="Sample content for image" langs={[]} />

                  </td>
                  <td className='align-top px-6 py-3' ></td>
                  <td className='align-top px-6 py-3' ></td>
                  <td className='align-top px-6 py-3'>
                    <EcommerceLink
                      platform="amazon"
                      countryCode="co.uk"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="UK"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="de"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="DE"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="es"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="ES"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="it"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="IT"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="fr"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="FR"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="pl"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="PL"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="nl"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="NL"
                      icon={faAmazon}
                    />
                    <EcommerceLink
                      platform="amazon"
                      countryCode="se"
                      identifiers={getMetaField(product.meta_data, 'amazon_asin')}
                      country="SE"
                      icon={faAmazon}
                    />
                    {/* Example for eBay link */}
                    <EcommerceLink
                      platform="ebay"
                      countryCode="com"
                      identifiers={getMetaField(product.meta_data, 'ebay_sku')}
                      country="US"
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
        </div>
      )}

      {!loading && products.length === 0 && <div>No products found.</div>}
    </div>
  );
};

export default CategorySelectorTable;