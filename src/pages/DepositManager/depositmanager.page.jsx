import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Table from '../../components/table/table.component'
import { getAdmin, postAdmin } from '../../axios/authenfunction'
import API from '../../constans/api'
import TableColumnText from '../../components/table-column-text/table-column-text.component'
import { Modal } from 'antd'
import Swal from 'sweetalert2'
import './depositmanager.style.scss'
function DepositManager() {
  const [data, setData] = useState([])
  const columns = [
    { heading: 'ID', value: 'id' },
    { heading: 'Số dư', value: 'availableBalance' },
    { heading: 'Số tiền kí quỹ', value: 'lockedBalance' },
    { heading: 'Mã nạp tiền', value: 'depositCode' }
  ]

  useEffect(() => {
    getAdmin(API['GET_WALLET_ADMIN'], true)
      .then(response => {
        console.log(response.data.data)
        setData(
          response.data.data.map(item => {
            return {
              id: <TableColumnText data={item.id} />,
              availableBalance: (
                <TableColumnText data={item.availableBalance} />
              ),
              lockedBalance: <TableColumnText data={item.lockedBalance} />,
              depositCode: <TableColumnText data={item.depositCode} />
            }
          })
        )
      })
      .catch()
  }, [])

  const add = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nạp tiền',
      html: `<div class="add-money">
        <div><label htmlFor="swal-input1">Số tiền: </label><input id="swal-input1" class="swal2-input"></div>
        <div><label htmlFor="swal-input2">Ví: </label><input id="swal-input2" class="swal2-input"></div>
      </div>`,
      focusConfirm: false,
      preConfirm: () => {
        postAdmin(
          API['POST_DEPOSIT'],
          {
            amount: Number(document.getElementById('swal-input1').value),
            depositCode: document.getElementById('swal-input2').value
          },
          true
        )
          .then(response => {
            const { id, availableBalance, lockedBalance } = response.data.data

            const oldData = data.filter(item => item.id.props.data === id)[0]
            // const index = data.indexOf(oldData);
            oldData.availableBalance = (
              <TableColumnText data={availableBalance} />
            )
            oldData.lockedBalance = <TableColumnText data={lockedBalance} />
            setData([...data])
            Swal.fire('Thông báo', 'Nạp tiền thành công', 'success')
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!'
            })
          })
      }
    })
  }

  return (
    <div>
      <Table columns={columns} datas={data} addAcction={add} />
    </div>
  )
}

export default DepositManager
