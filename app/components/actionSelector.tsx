// components/ActionSelector.tsx
import React from 'react';

interface Props {
  selectedProducts: number[];
  handleActionChange: (action: string) => void;
}

const ActionSelector: React.FC<Props> = ({ selectedProducts, handleActionChange }) => {
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <label htmlFor="actionSelect">Select an action:</label>
      <select id="actionSelect" onChange={(e) => handleActionChange(e.target.value)}>
        <option value="">Select...</option>
        <option value="view">View</option>
        <option value="edit">Edit</option>
        <option value="delete">Delete</option>
        {/* Add more actions as needed */}
      </select>
    </div>
  );
};

export default ActionSelector;
