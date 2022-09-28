import React from 'react'
import Grid from '@mui/material/Grid'

import './homeInfo.style.scss'

const HomeInfo = props => {
  return (
    <div className="homeInfoWrapper">
      <p className="homeInfoWrapper__title">
        Nguồn truy cập của bạn cho tất cả các nhu cầu về giọng nói chuyên nghiệp
      </p>

      <Grid className="homeInfoWrapper__row" container spacing={2}>
        <Grid className="homeInfoWrapper__col" item xs={12} md={7}>
          <div className="homeInfoValue">
            <div className="homeInfoValue__item">
              <div className="homeInfoValue__item__icon">
                <img src="icons/mic.svg" alt="mic" />
              </div>
              <div className="homeInfoValue__item__content">
                <p className="homeInfoValue__item__content__title">
                  Dễ dàng tìm được diễn viên lồng tiếng hoàn hảo cho dự án của
                  bạn
                </p>
                <p className="homeInfoValue__item__content__desc">
                  Truy cập vào kho tài năng đa dạng của chúng tôi với hơn
                  2.000.000 tài năng lồng tiếng chuyên nghiệp trên 160 quốc gia.{' '}
                  <a href="#">Bắt đầu duyệt tài năng.</a>
                </p>
              </div>
            </div>
            <div className="homeInfoValue__item">
              <div className="homeInfoValue__item__icon">
                <img src="icons/stopwatch.svg" alt="stopwatch" />
              </div>
              <div className="homeInfoValue__item__content">
                <p className="homeInfoValue__item__content__title">
                  Hoàn thành công việc bằng giọng nói nhanh hơn thuê ngoài
                </p>
                <p className="homeInfoValue__item__content__desc">
                  Đưa ra quyết định tuyển dụng nhanh chóng và cộng tác với nhóm
                  của bạn trên thị trường dễ sử dụng của chúng tôi, thường là
                  trong ít nhất một ngày.{' '}
                  <a href="#">Tìm hiểu cách hoạt động.</a>
                </p>
              </div>
            </div>
            <div className="homeInfoValue__item">
              <div className="homeInfoValue__item__icon">
                <img src="icons/wallet.svg" alt="wallet" />
              </div>
              <div className="homeInfoValue__item__content">
                <p className="homeInfoValue__item__content__title">
                  Giọng nói chất lượng cao, trong phạm vi ngân sách của bạn
                </p>
                <p className="homeInfoValue__item__content__desc">
                  Nghe thử giọng đọc miễn phí và chọn ứng viên
                  lồng tiếng tốt nhất phù hợp với dự án của bạn.
                  <a href="#">Tìm hiểu về giá cả.</a>
                </p>
              </div>
            </div>
            <div className="homeInfoValue__item">
              <div className="homeInfoValue__item__icon">
                <img src="icons/audio-file.svg" alt="audio-file" />
              </div>
              <div className="homeInfoValue__item__content">
                <p className="homeInfoValue__item__content__title">
                  Sẵn sàng sử dụng các tệp chất lượng phát sóng
                </p>
                <p className="homeInfoValue__item__content__desc">
                  Tài năng giọng nói của chúng tôi được đầu tư vào sự nghiệp
                  chuyên nghiệp của họ nhiều như bạn, với phần mềm và thiết bị
                  âm thanh hàng đầu.
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className="homeInfoWrapper__col" item xs={12} md={4}>
          <div className="homeInfoCard">
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">90 phút</p>
              <p className="homeInfoCard__item__desc">
                Từ đăng tuyển đến phản hồi đầu tiên
              </p>
            </div>
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">24 tiếng</p>
              <p className="homeInfoCard__item__desc">
                Để hoàn thành công việc
              </p>
            </div>
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">4.5 Điểm</p>
              <p className="homeInfoCard__item__desc">Đánh giá trung bình</p>
            </div>
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">500,000+</p>
              <p className="homeInfoCard__item__desc">Việc làm đã đăng</p>
            </div>
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">2,000,000</p>
              <p className="homeInfoCard__item__desc">Tài năng để lựa chọn</p>
            </div>
            <div className="homeInfoCard__item">
              <p className="homeInfoCard__item__title">100+ Ngôn ngữ</p>
              <p className="homeInfoCard__item__desc">
                Từ các diễn viên lồng tiếng toàn cầu
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default HomeInfo
