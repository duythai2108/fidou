import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Radio } from 'antd'
import './profilemini.style.scss'
import { getAuthen, postAuthen } from '../../axios/authenfunction'
import API from '../../constans/api'
import Swal from 'sweetalert2'
import Rating from '@mui/material/Rating'

function ProfileMini({ data, isShowInvite }) {
  const onChange = e => {
    setValue(e.target.value)
  }
  let [isShowAddJob, setIsShowAddJob] = useState(false)
  const [value, setValue] = useState(1)
  let [prepareData, setPrepareData] = useState({
    sub: [],
    demos: [],
    account: [],
    jobs: []
  })
  let title2 = useRef(null)
  let description2 = useRef(null)
  let day = useRef(null)
  let hours = useRef(null)
  let minute = useRef(null)
  let price = useRef(null)
  let tone = useRef(null)
  let minAge = useRef(null)
  let maxAge = useRef(null)
  let gender = useRef(null)
  let language = useRef(null)

  useEffect(() => {
    getAuthen(API['GET_SUBCATEGORY']).then(response => {
      setPrepareData({
        sub: response.data.data
      })
    })
  }, [])

  const handelAddJob = () => {
    const txtTitle = title2.current.value
    const txtDescription = description2.current.value
    const txtDay = day.current.value
    const txtHours = hours.current.value
    const txtMinute = minute.current.value
    const txtPrice = price.current.value
    const txtTone = tone.current.value
    const txtMinAge = minAge.current.value
    const txtMaxAge = maxAge.current.value
    const txtGender = gender.current.value
    const txtLanguage = language.current.value

    const dataa = {
      jobPayload: {
        name: txtTitle,
        description: txtDescription,
        dayDuration: new Number(txtDay),
        hourDuration: new Number(txtHours),
        minuteDuration: new Number(txtMinute),
        subCategoryId: value,
        price: new Number(txtPrice),
        tone: new Number(txtTone),
        minAge: new Number(txtMinAge),
        maxAge: new Number(txtMaxAge),
        gender: new Number(txtGender),
        language: new Number(txtLanguage)
      },
      candidateId: data.id
    }

    postAuthen(API['INVITE_TO_JOB'], dataa, true)
      .then(response => {
        setIsShowAddJob(false)
        Swal.fire('Thông báo', 'Mời thành công!', 'success')
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.msg
        })
      })
  }

  const createSchedule = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Báo cáo ứng cử viên',
      html: `
              <input type="datetime-local"  id="swal-input1">
        `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Tạo lịch hẹn',
      preConfirm: () => {
        return {
          candidateId: data.id,
          scheduledTime: document.getElementById('swal-input1').value
        }
      }
    })

    if (formValues) {
      postAuthen(API['POST_SCHEDULE'], formValues, true)
        .then(response => {
          Swal.fire(
            'Thông báo!',
            'Tạo lịch hẹn với ứng viên thành công',
            'success'
          )
        })
        .catch(error => {
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Đặt lịch không thành công!'
          })
        })
    }
  }
  return (
    <div className="profile-mini box">
      <div className="left">
        <img src={data.avatarUrl} alt="" />
      </div>
      <div className="right">
        <Link to={`/profile/${data.id}`} target="_blank">
          <h3>{data.name}</h3>
        </Link>
        <p>{data.description}</p>
        <Rating name="read-only" value={data.averageReviewPoint} readOnly />
        {isShowInvite ? (
          <div className="wrapper">
            <button
              className="button"
              onClick={() => {
                setIsShowAddJob(true)
              }}
            >
              Mời vào dự án
            </button>

            {/* <button
              className="button"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                createSchedule();
              }}
            >
              Hẹn lịch
            </button> */}
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        title="Mời vào công việc"
        centered
        visible={isShowAddJob}
        onOk={() => handelAddJob()}
        onCancel={() => setIsShowAddJob(false)}
        width={800}
        className="modal-adddemo"
      >
        <div className="modal-adddemo__skill box">
          <h3>
            Kĩ năng<span>*</span>
          </h3>
          <p>Chọn 1 kĩ năng phù hợp khi mời ứng viên tham gia công việc.</p>
          <div className="modal-adddemo__skill__list">
            <Radio.Group onChange={onChange} value={value}>
              {prepareData.sub.length > 0
                ? prepareData.sub.map((item, index) => {
                    return (
                      <Radio value={item.id} key={index}>
                        {item.name}
                      </Radio>
                    )
                  })
                : ''}
            </Radio.Group>
          </div>
          <h3>
            Ngôn ngữ yêu cầu cho ứng viên <span>*</span>
          </h3>
          <select ref={language}>
            <option disabled selected value>
              -- Chọn --
            </option>
            <option value="0">Tiếng Việt</option>
            <option value="1">Tiếng Anh</option>
          </select>
          <h3>
            Giới tính yêu cầu cho ứng viên <span>*</span>
          </h3>
          <select ref={gender}>
            <option disabled selected value>
              -- Chọn --
            </option>
            <option value="0">Nam</option>
            <option value="1">Nữ</option>
          </select>
          <h3>
            Tone <span>*</span>
          </h3>
          <select ref={tone}>
            <option disabled selected value>
              -- Chọn --
            </option>
            <option value="0">Giọng trầm</option>
            <option value="1">Giọng vừa</option>
            <option value="2">Giọng cao</option>
          </select>
        </div>
        <div className="box">
          <div className="row">
            <h3>
              Độ tuổi <span>*</span>
            </h3>
            <input type="number" min="18" ref={minAge} /> -{' '}
            <input type="number" min="18" ref={maxAge} />
          </div>
        </div>
        <div className="modal-adddemo__description box">
          <h3>
            Tiêu đề <span>*</span>
          </h3>
          <p>Miêu tả ngắn gọn tiêu đề cần cho công việc của bạn.</p>
          <input type="text" ref={title2} />
          <h3>
            Nội dung <span>*</span>
          </h3>
          <p>Chia sẻ một số yêu cầu công việc cần thiết cho ứng viên.</p>
          <input type="text" ref={description2} />
        </div>

        <div className="box">
          <div className="row">
            <h3>
              Ngày hoàn thành<span>*</span>
            </h3>
            <input type="number" ref={day} />
          </div>
          <div className="row">
            <h3>
              Giờ hoàn thành <span></span>
            </h3>
            <input type="number" ref={hours} />
          </div>
          <div className="row">
            <h3>
              Phút hoàn thành <span></span>
            </h3>
            <input type="number" ref={minute} />
          </div>
          <div className="row">
            <h3>
              Giá <span>*</span>
            </h3>
            <input type="number" ref={price} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfileMini
