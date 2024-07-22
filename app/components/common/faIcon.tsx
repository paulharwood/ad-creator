// FaIcon.tsx
import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { all } from '@awesome.me/kit-f4b7200dd7/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core';
library.add(...all)

interface FaIconProps {
  symbol: string;
}

const FaIcon: React.FC<FaIconProps> = ({ symbol }) => {
  symbol = symbol.trim()
  return  <>
  <div className='fa-icon-wrapper'>
      <FontAwesomeIcon icon={['fas', symbol as IconName ]} />
    </div> 
  </>;
};

export default FaIcon;