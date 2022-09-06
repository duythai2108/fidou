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
        <h1>Company</h1>
        <span>About</span>
        <span>Contact</span>
        <span>Careers</span>
        <span>Press</span>
        <span>Report</span>
      </div>
      <div className="footer__3">
        <h1>Learn</h1>
        <span>Help</span>
        <span>Blog</span>
        <span>Podcart</span>
        <span>Resources</span>
        <span>Events</span>
      </div>
    </footer>
  );
}

export default Footer;
