// components/CategorySelectorTable.tsx
import React from 'react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  // Add more fields as needed
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
}) => (
  <div>
    {loading && <div>Loading...</div>}
    {error && <div>Error: {error}</div>}

    {!loading && products.length > 0 && (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.price}</td>
                {/* Add more columns as needed */}
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
      </div>
    )}

    {!loading && products.length === 0 && <div>No products found.</div>}
  </div>
);

export default CategorySelectorTable;
