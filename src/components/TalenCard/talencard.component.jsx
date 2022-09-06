import React from "react";
import { Link } from "react-router-dom";
import PATH from "../../constans/path";
import Rating from "@mui/material/Rating";
import "./talencard.style.scss";
function TalenCard({ avatarUrl, name, id, demo, provice, rate }) {
  return (
    <div className="talencard">
      <div className="talencard__avatar">
        <img src={avatarUrl} alt="" />
      </div>

      <div className="talencard__name">
        <h3>{name}</h3>
      </div>

      <div className="talencard__location">
        <i class="fa fa-map-marker-alt"></i>
        {provice} City
      </div>
      <Rating
        name="read-only"
        value={rate}
        readOnly
        style={{ marginTop: "10px" }}
      />

      {demo ? (
        <div className="talencard__audio">
          <h5>{demo.title}</h5>

          <audio controls>
            <source src={demo.url} />
          </audio>
          <h6>{demo.subCategoryName}</h6>
        </div>
      ) : (
        <div
          style={{
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Chưa có demo nào
        </div>
      )}

      <Link to={PATH["PROFILE_PAGE"] + "/" + id}>Xem hồ sơ</Link>
    </div>
  );
}

export default TalenCard;
