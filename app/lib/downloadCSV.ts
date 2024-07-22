import Papa from 'papaparse';

interface Product {
  id: number;
  sku: string;
  meta_data: { key: string; value: any }[];
}

interface GetMetaFieldFunction {
  (meta_data: { key: string; value: any }[], key: string): string;
}

export const downloadCSV = (
  products: Product[],
  selectedProducts: number[],
  getMetaField: GetMetaFieldFunction,
  addMessage: (message: string) => void
) => {
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
