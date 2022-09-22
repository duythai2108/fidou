import React from "react";
import { Link } from "react-router-dom";
import PATH from "../../constans/path";
import "./footer.style.scss";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__1">
        <Link to={PATH["HOME_PAGE"]}>
          <img src="/images/logo.png" alt="" />
        </Link>
        <p>
          Fidou đang dần dần chiếm lấy thị phần Việt Nam một cách hết sức chậm rãi
          và chuyên nghiệp. Kể từ năm 2022 hoạt động của FIDOU đang dần có được sự
          quan tâm của cộng đồng trong việc tìm kiếm cơ hội nghề nghiệp và nâng cao
          chất lượng giọng nói Việt.
        </p>
      </div>
      <div className="footer__2">
        <h1>Công ty</h1>
        <span>Thông tin</span>
        <span>Liên hệ</span>
        <span>Thành tựu</span>
        <span>Nhấn</span>
        <span>Báo cáo</span>
      </div>
      <div className="footer__3">
        <h1>Giá trị</h1>
        <span>Trợ giúp</span>
        <span>Blog cá nhân</span>
        <span>Danh thiếp</span>
        <span>Mã nguồn</span>
        <span>Sự kiện</span>
      </div>
    </footer>
  );
}

export default Footer;
