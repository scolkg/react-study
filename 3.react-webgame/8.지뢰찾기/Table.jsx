import React, { useContext, memo } from 'react';
import Tr from './Tr';
import { TableContext } from './MineSearch';


const Table = memo(() => {
  const { tableData } = useContext(TableContext);

  return (
    <>
      <table>
        <thead></thead>
        <tbody>
          {Array(tableData.length).fill().map( (tr, i) => <Tr key={i} rowIndex={i} />)}
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
});

export default Table;

