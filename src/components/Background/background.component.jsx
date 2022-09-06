import React from "react";
import { Link } from "react-router-dom";
import "./background.style.scss";
function Background() {
  return (
    <div className="background">
      <div className="background__left">
        <h1>FIDOU - Sàn giao dịch giọng nói lớn nhất Việt Nam</h1>
        <p>
          Thuê các tài năng sở hữu giọng nói ưu tú một cách nhanh nhất, và cơ hội
          tìm kiếm việc làm tốt nhất.
        </p>
        <div className="background__left__button">
          <button>
            <Link to={"/search/candidate"}>Tìm ứng viên</Link>
          </button>
          <button>
            <Link to={"/search/job"}>Tìm công việc</Link>
          </button>
        </div>
      </div>
      <div className="background__right">
        <img src="images/bg.webp" alt="" />
      </div>
    </div>
  );
}

export default Background;
