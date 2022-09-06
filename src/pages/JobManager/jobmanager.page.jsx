import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthen } from "../../axios/authenfunction";
import BasicTabs from "../../components/tab/tab.component";
import API from "../../constans/api";
import { AccountContext } from "../../context/AccountProvider";
import "./jobmanager.style.scss";

const JobManager = () => {
  const accountContext = useContext(AccountContext);
  const { data } = accountContext;
  let [listOrder, setListOrder] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
    if (!data.account) {
      navigate("/");
    }
    if (data.account?.role == 1) {
      getAuthen(API["GET_ORDER_ENTERPRISE"], true)
        .then((response) => {
          console.log(response.data.data);
          setListOrder(response.data.data);
        })
        .catch();
    }

    if (data.account?.role == 0) {
      getAuthen(API["GET_ORDER_CANDIDATE"], true)
        .then((response) => {
          setListOrder(response.data.data);
        })
        .catch();
    }
  }, [data]);

  return (
    <div className="job-manager">
      <div>
        <BasicTabs listOrder={listOrder} />
      </div>
    </div>
  );
};

export default JobManager;
