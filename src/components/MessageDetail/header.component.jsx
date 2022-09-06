import { UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Tooltip } from "antd";
import React, { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { postAuthen, putAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";
import { AccountContext } from "../../context/AccountProvider";
import "./header.style.scss";
function Header({
  orderId,
  title,
  description,
  status,
  candidateId,
  setSchedule,
  finishOrder,
}) {
  const accountContext = useContext(AccountContext);
  const { data } = accountContext;

  const createSchedule = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Hẹn lịch với ứng cử viên",
      html: `
              <input type="datetime-local"  id="swal-input1">
        `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Tạo lịch hẹn",
      preConfirm: () => {
        return {
          candidateId: candidateId,
          orderId: orderId,
          scheduledTime: document.getElementById("swal-input1").value,
        };
      },
    });

    if (formValues) {
      postAuthen(API["POST_SCHEDULE"], formValues, true)
        .then((response) => {
          Swal.fire(
            "Thông báo!",
            "Tạo lịch hẹn với ứng viên thành công",
            "success"
          );
          setSchedule(response.data.data);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.msg,
          });
        });
    }
  };

  return (
    <div className="headerchat">
      <div className="headerchat__info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {status == 1 && data.account?.role == 1 ? (
        <div>
          <button
            className="button"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              createSchedule();
            }}
          >
            Hẹn lịch
          </button>
          <button
            className="button"
            onClick={() => {
              putAuthen(
                API["PUT_FINISH"],
                {
                  orderId: orderId,
                },
                true
              ).then((response) => {
                finishOrder();
                Swal.fire("Thông báo", "Hoàn thành dự án", "success");
              });
            }}
          >
            Finish
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
