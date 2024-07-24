import React, { useState } from 'react';
import Link from 'next/link';
import { faAmazon, faEbay } from '@fortawesome/free-brands-svg-icons';
import EcommerceLink from './ecommerceLink';
import GenerateImages from './generateImages';
import GenerateTemplates from './generateTemplates';
import FaIcon from './common/faIcon';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  meta_data: { key: string; value: any }[];
}

interface Props {
  product: Product;
  selectedProducts: number[];
  handleProductSelect: (productId: number) => void;
  getMetaField: (meta_data: { key: string; value: any }[], key: string) => string;
  addMessage: (message: string) => void;
}

const CategorySelectorRow: React.FC<Props> = ({
  product,
  selectedProducts,
  handleProductSelect,
  getMetaField,
  addMessage,
}) => {
  const [expandedProductDescription, setExpandedProductDescription] = useState<number | null>(null);
  const [expandedProductMeta, setExpandedProductMeta] = useState<number | null>(null);

  const toggleDescription = (productId: number) => {
    setExpandedProductDescription(expandedProductDescription === productId ? null : productId);
  };

  const toggleMeta = (productId: number) => {
    setExpandedProductMeta(expandedProductMeta === productId ? null : productId);
  };

  const featureIconsString = getMetaField(product.meta_data, 'feature_icons');
  const featureIconsArray = featureIconsString.split(',');
  console.log(featureIconsArray);

  return (
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
        <button onClick={() => toggleMeta(product.id)}>
          {expandedProductMeta === product.id ? '[hide meta ▲]' : '[show meta ▼]'}
        </button>
        {expandedProductMeta === product.id && (
          <ul>
            {product.meta_data.map((meta) => (
              <li key={meta.key}>
                {meta.key}: {meta.value}
              </li>
            ))}
          </ul>
        )}
      </td>
      <td className='align-top px-6 py-3'>
        <GenerateTemplates sku={product.sku} addMessage={addMessage} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='front' />
        <GenerateTemplates sku={product.sku} addMessage={addMessage} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='back' />
        <GenerateTemplates sku={product.sku} addMessage={addMessage} tpl={getMetaField(product.meta_data, 'three_d_template')} numLang={5} content='adverts' />
      </td>
      <td className='align-top px-6 py-3'>                 
        <GenerateImages sku={product.sku}  content='front' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} addMessage={addMessage} />
        <GenerateImages sku={product.sku}  content='back' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} addMessage={addMessage} />
        <GenerateImages sku={product.sku}  content='adverts' langs={['en', 'de', 'es', 'it', 'fr', 'pl', 'nl', 'se']} addMessage={addMessage} />
      </td>
      <td className='align-top px-6 py-3'>
        {featureIconsArray.map((icon, index) => (
          <FaIcon key={index} symbol={icon} /> 
      ))}
      </td>
      <td className='align-top px-6 py-3'></td>
      <td className='align-top px-6 py-3'>
        <EcommerceLink
            platform='amazon'
            countryCode='co.uk'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='UK'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='de'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='DE'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='es'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='ES'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='it'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='IT'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='fr'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='FR'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='pl'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='PL'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='nl'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='NL'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='amazon'
            countryCode='se'
            identifiers={getMetaField(product.meta_data, 'amazon_asin')}
            country='SE'
            icon={faAmazon} link={''}      />
        <EcommerceLink
            platform='ebay'
            countryCode='com'
            identifiers={getMetaField(product.meta_data, 'ebay_sku')}
            country='US'
            icon={faEbay} link={''}      />
      </td>
      <td className='align-top px-6 py-3'>
        {getMetaField(product.meta_data, 'three_d_ready') === 'yes' && (
          <Link href={`https://select.fitnesshealth.co/?sku=${product.sku}`} target='_blank' className='w-fit'>
            Select Template
          </Link>
        )}
      </td>
      <td className='align-top px-6 py-3'>
        {getMetaField(product.meta_data, 'last_published')}
      </td>
      <td className='align-top px-6 py-3'>
        <EcommerceLink link={`https://www.amazon.co.uk/dp/${getMetaField(product.meta_data, 'amazon')}?ref=myi_title_dp`} icon={faAmazon} platform={'amazon'} countryCode={''} identifiers={''} country={''} />
        <EcommerceLink link={`https://www.ebay.co.uk/itm/${getMetaField(product.meta_data, 'ebay')}`} icon={faEbay} platform={'amazon'} countryCode={''} identifiers={''} country={''} />
        <div className='flex space-x-1'>
          {featureIconsArray.map((icon, index) => (
            <div className='inline-block h-10 w-10 bg-contain bg-center bg-no-repeat' key={index} style={{ backgroundImage: `url('/${icon}')` }}></div>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default CategorySelectorRow;
