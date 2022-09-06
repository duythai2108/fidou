import React from 'react';
import './table-column-text.style.scss';

const TableColumnText = props => {
  const { data } = props;
  return (
    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      {data}
    </td>
  );
};

export default TableColumnText;
