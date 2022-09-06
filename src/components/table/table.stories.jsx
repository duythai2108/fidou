import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Table from './table.component.jsx';
import axios from 'axios';
// const columns = [
//     { heading: 'Number', value: 'companyID' },
//     { heading: 'Project Name', value: 'companyName' },
//     { heading: 'Company', value: 'companyPhone' },
//     { heading: 'Semeter', value: 'companyEmail' },
//     { heading: 'Council', value: 'council' },
//     { heading: 'Student', value: 'student' },
//     { heading: 'Status', value: 'status' },
//     { heading: 'Action', value: 'type' },
// ];
// const [dataTable, setDataTable] = useState([]);

// useEffect(() => {
//     axios('https://capstonegrading.herokuapp.com/api/Companies')
//         .then(res => setDataTable(res.data))
//         .catch(err => console.log(err))
// }, []);

storiesOf('components/Table', module).add(
  'test',
  () => <Table />
  // <div>
  //     <Table columns={columns} datas={dataTable}  />
  // </div>
);
