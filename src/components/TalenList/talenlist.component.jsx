import React, { useEffect, useState } from 'react'
import { getAuthen, getParam } from '../../axios/authenfunction'
import API from '../../constans/api'
import TalenCard from '../TalenCard/talencard.component'
import './talenlist.style.scss'
function TalenList() {
  const [candidates, setCandidates] = useState([])
  useEffect(() => {
    console.log('run')
    getAuthen(API['GET_LIST_CANDIDATE'] + '?pageSize=6&pageNumber=1').then(
      response => {
        setCandidates(response.data.data)
      }
    )
  }, [])

  return (
    <div className="talenlist">
      <div className="talenlist__header">
        <p className="talenlist__header__title">
          Duyệt các tài năng hoặc dự án hàng đầu
        </p>
        <p className="talenlist__header__desc">
          Thuê những tài năng hoàn hảo và làm việc sát cánh với họ để mang công
          việc của bạn đến với cuộc sống. Hoặc là có thể tự kiếm mình một công việc
          bằng giọng nói của mình
        </p>
      </div>

      <h1>Các ứng viên hàng đầu</h1>

      <div className="talenlist__list">
        {candidates?.map((item, index) => {
          return (
            <TalenCard
              provice={item.provinceName}
              avatarUrl={item.avatarUrl}
              name={item.name}
              id={item.id}
              demo={item.voiceDemos.length > 0 ? item.voiceDemos[0] : null}
              rate={item.averageReviewPoint}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TalenList
