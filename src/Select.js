import React from 'react';

const Select = ({ id, value, onChange, children }) => {
  return (
    <select id={id} value={value} onChange={onChange}>
      {children}
    </select>
  );
};

export default Select;
