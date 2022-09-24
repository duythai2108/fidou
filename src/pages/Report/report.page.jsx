import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getAdmin, putAdmin, putAuthen } from '../../axios/authenfunction'
import TableColumnText from '../../components/table-column-text/table-column-text.component'
import Table from '../../components/table/table.component'
import API from '../../constans/api'
import './report.style.scss'

function Report() {
  const [data, setData] = useState([])
  const [realdata, setRealData] = useState([])
  const columns = [
    // { heading: "ID", value: "id" },
    { heading: 'Ngày tạo báo cáo', value: 'createdTime' },
    { heading: 'Trạng thái', value: 'isReviewed' },
    { heading: 'Ứng viên', value: 'candidateEmail' },
    { heading: 'Nội dung', value: 'content' },
    { heading: 'Nội dung âm thanh', value: 'voiceLink' },
    { heading: 'Thao tác', value: 'action' }
  ]

  const reportHandler = (id, status, realdata) => {
    console.log(realdata)
    putAdmin(
      API['REPORT_REVIEW'],
      {
        id: id,
        isTrue: status
      },
      true
    )
      .then(response => {
        console.log(realdata)
        realdata.filter(item => item.id == id)[0].isReviewed = true
        mapData(realdata)
        Swal.fire('Thông báo', 'Đánh giá thành công!', 'success')
      })
      .catch()
  }

  const mapData = list => {
    setData(
      list.map(item => {
        const date = new Date(item.createdTime)
        console.log(item.isReviewed)
        return {
          // id: item.id,
          createdTime: <TableColumnText data={date.toDateString()} />,
          isReviewed: <TableColumnText data={item.isReviewed ? 'done' : ''} />,
          content: <p>{item.content}</p>,
          candidateEmail: <p>{item.candidateEmail}</p>,
          voiceLink: (
            <a href={item.voiceLink} target="_blank">
              voice
            </a>
          ),
          action: !item.isReviewed ? (
            <>
              <button
                className="button action"
                onClick={() => {
                  reportHandler(item.id, true, realdata)
                }}
              >
                Chấp thuận
              </button>
              <button
                className="button action"
                onClick={() => {
                  reportHandler(item.id, false, realdata)
                }}
              >
                Từ chối
              </button>
            </>
          ) : (
            <></>
          )
        }
      })
    )
  }

  useEffect(() => {
    // Hide add button
    document
      .getElementsByClassName('button-component')[0]
      .style.setProperty('display', 'none')

    getAdmin(API['GET_REPORT_LIST'], true)
      .then(response => {
        setRealData(response.data.data)
        mapData(response.data.data)
      })
      .catch()
  }, [])

  useEffect(() => {
    console.clear()
    console.log(realdata)
  }, [realdata])

  // const add = async () => {
  //   const { value: formValues } = await Swal.fire({
  //     title: "Nạp tiền",
  //     html: `<div class="add-money">
  //       <div><label htmlFor="swal-input1">Số tiền: </label><input id="swal-input1" class="swal2-input"></div>
  //       <div><label htmlFor="swal-input2">Ví: </label><input id="swal-input2" class="swal2-input"></div>
  //     </div>`,
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       postAdmin(
  //         API["POST_DEPOSIT"],
  //         {
  //           amount: Number(document.getElementById("swal-input1").value),
  //           depositCode: document.getElementById("swal-input2").value,
  //         },
  //         true
  //       )
  //         .then((response) => {
  //           setData([]);
  //           Swal.fire("Thông báo", "Nạp tiền thành công", "success");
  //         })
  //         .catch((error) => {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops...",
  //             text: "Something went wrong!",
  //           });
  //         });
  //     },
  //   });

  //   if (formValues) {
  //     Swal.fire(JSON.stringify(formValues));
  //   }
  // };

  return (
    <div className="report">
      <Table columns={columns} datas={data} />
    </div>
  )
}

export default Report
