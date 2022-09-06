import React, { useEffect, useState } from "react";
import { getAuthen, getParam } from "../../axios/authenfunction";
import API from "../../constans/api";
import TalenCard from "../TalenCard/talencard.component";
import "./talenlist.style.scss";
function TalenList() {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    console.log("run");
    getAuthen(API["GET_LIST_CANDIDATE"] + "?pageSize=6&pageNumber=1").then(
      (response) => {
        setCandidates(response.data.data);
      }
    );
  }, []);

  return (
    <div className="talenlist">
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
          );
        })}
      </div>
    </div>
  );
}

export default TalenList;
