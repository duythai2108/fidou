import { CircularProgress } from '@mui/material';
import React from 'react';
import './loading-table.style.scss';

const LoadingTable = ({ length }) => {
  return (
    <tr>
      <td className="load" colSpan={length}>
        <div className="">
          <CircularProgress />
        </div>
      </td>
    </tr>
  );
};

export default LoadingTable;
