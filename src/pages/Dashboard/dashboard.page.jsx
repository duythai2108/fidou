import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftAdmin from "../../components/LeftAdmin/leftadmin.component";
import Header from "../../components/HeaderAdmin/header.component";
import "./dashboard.style.scss";
import Swal from "sweetalert2";
import { postAuthen } from "../../axios/authenfunction";
import API from "../../constans/api";

function Dashboard() {
  let [isShow, setIsShow] = useState(false);
  let [account, setAccount] = useState({});

  useEffect(() => {
    let accountAdmin = JSON.parse(localStorage.getItem("accountAdmin"));
    if (!accountAdmin) {
      showLogin();
    } else {
      setAccount(accountAdmin);
    }
  }, []);

  const showLogin = () => {
    Swal.fire({
      title: "Đăng nhập",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="username">' +
        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Password"/>',
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    }).then((response) => {
      let { value } = response;
      let username = value[0];
      let password = value[1];
      postAuthen(
        API["LOGIN_ADMIN"],
        {
          email: username,
          password: password,
        },
        true
      )
        .then((response) => {
          localStorage.setItem(
            "accountAdmin",
            JSON.stringify(response.data.data)
          );
          localStorage.setItem(
            "jwtAdmin",
            JSON.stringify(response.data.data.jwtToken)
          );
          setAccount(response.data.data);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tài khoảng k tồn tại",
          }).then(() => {
            showLogin();
          });
        });
    });
  };

  return (
    <div className="dashboard">
      {account.id ? (
        <>
          <LeftAdmin
            accountAdmin={account}
            isShow={isShow}
            showNav={setIsShow}
          />
          <div className="dashboard__right">
            <Header showNav={setIsShow} />
            <Outlet />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Dashboard;
