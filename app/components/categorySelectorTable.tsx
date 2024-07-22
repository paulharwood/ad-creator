import React, { useState } from 'react';
import ActionSelector from './actionSelector';
import Link from 'next/link';
import { library } from '@fortawesome/fontawesome-svg-core';
import { all } from '@awesome.me/kit-f4b7200dd7/icons';
import { useActivityFeed } from '../lib/context/ActivityFeedContext';
import CategorySelectorRow from './categorySelectorRow';
import { downloadCSV } from '../lib/downloadCSV'; // Import the utility function

library.add(...all);

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
  const { addMessage } = useActivityFeed();

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
    addMessage(`Action "${action}" selected for product IDs ${selectedProducts.join(', ')}`);
    console.log(`Action "${action}" selected for product IDs ${selectedProducts.join(', ')}`);
  };

  const getMetaField = (meta_data: { key: string; value: any }[], key: string) => {
    const metaField = meta_data.find((field) => field.key === key);
    return metaField ? metaField.value : '';
  };

  const handleDownloadCSV = () => {
    downloadCSV(products, selectedProducts, getMetaField, addMessage);
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
                <CategorySelectorRow
                  key={product.id}
                  product={product}
                  selectedProducts={selectedProducts}
                  handleProductSelect={handleProductSelect}
                  getMetaField={getMetaField}
                  addMessage={addMessage}
                />
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
          <button onClick={handleDownloadCSV} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Download CSV
          </button>
        </div>
      )}

      {!loading && products.length === 0 && <div>No products found.</div>}
    </div>
  );
};

export default CategorySelectorTable;
