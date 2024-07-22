// components/EcommerceLink.tsx
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface EcommerceLinkProps {
  platform: 'amazon' | 'ebay'; // Add more platforms as needed
  countryCode: string;
  identifiers: string; // Array of ASINs or identifiers
  country: string;
  icon: IconProp; // FontAwesome icon for the platform
  link: string;
}

const EcommerceLink: React.FC<EcommerceLinkProps> = ({ platform, countryCode, identifiers, country, icon }) => {
  
  //   const identifierArray = identifiers ? identifiers.split(',').map(identifier => identifier.trim()) : [];
  const identifierArray = typeof identifiers === 'string'
    ? identifiers.split(',').map(identifier => identifier.trim()).filter(identifier => identifier !== '')
    : [];
  // console.log('identifiers:', identifiers);
  
  const generateLink = (identifier: string) => {
    switch (platform) {
      case 'amazon':
        return `https://amazon.${countryCode}/a/dp/${identifier}`;
      case 'ebay':
        return `https://ebay.${countryCode}/itm/${identifier}`;
      default:
        return '#'; // Handle other platforms or default case
    }
  };
  return (
      <>
      {identifierArray.map((identifier, index) => (
        <Link key={index} href={generateLink(identifier)} target='_blank' rel='noopener noreferrer' className='whitespace-nowrap border border-white/20 hover:border-white/80 rounded-full  mr-2 text-xs p-1 px-2' >
            <FontAwesomeIcon icon={icon} /> {country}
        </Link>
      ))}
    </>
  );
};

export default EcommerceLink;
