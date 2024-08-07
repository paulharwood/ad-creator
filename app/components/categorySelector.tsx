'use client'

// components/CategorySelector.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { getCategories } from '../lib/getCategories';
import { getProductsByCategory } from '../lib/getProductsByCategory';
import CategorySelectorTable from './categorySelectorTable';

interface Category {
  id: number;
  name: string;
}

const CategorySelector: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        setError('Failed to fetch categories.');
        console.error(error);
      }
    };

    fetchCategoriesData();
  }, []);

  const fetchProducts = useCallback(async () => {
    if (selectedCategory !== null) {
      setLoading(true);
      const perPage = 100;
      try {
        const { products, pagination } = await getProductsByCategory(selectedCategory, currentPage, perPage);
        setProducts(products);
        setTotalPages(pagination.totalPages);
        setError(null);
      } catch (error) {
        setError('Failed to fetch products.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, fetchProducts]);
  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="">
      <div className='navbar bg-transparent border border-stone-400/20 rounded-full py-4 px-4 text-neutral-content mb-4'>
        <select
          id="categorySelect"
          className="py-2 px-6 rounded-full text-black"
          value={selectedCategory || ''}
          onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
        >
          <option value="">Select...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

      {loading && <div className='float-end	'>Loading...</div>}
      {error && <div>Error: {error}</div>}
      </div>
    

      {selectedCategory !== null && !loading && (
        <div>
          <CategorySelectorTable
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                error={error}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
              />
        </div>
      )}
    </div>
  );
};

export default CategorySelector;