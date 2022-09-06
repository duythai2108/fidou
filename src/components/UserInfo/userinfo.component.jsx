import { Avatar, Button, Typography } from "antd";
import React, { useEffect, useContext } from "react";
import "./userinfo.style.scss";
import { auth, db } from "../../Firebase/config";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AccountContext } from "../../context/AccountProvider";
// import { AuthContext } from "../../context/AuthProvider";
function UserInfo() {
  const navigation = useNavigate();
  // const data = useContext(AuthContext);
  const accountContext = useContext(AccountContext);
  let { data } = accountContext;
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <div className="user__info">
      <div>
        <Avatar
          src={
            data.account?.role == 0
              ? data.information?.avatarUrl
              : data.information?.logoUrl
          }
        ></Avatar>
        <Typography.Text className="user__info__name">
          {data.information?.name}
        </Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          navigation("/");
          auth.signOut();
        }}
      >
        Trở lại
      </Button>
    </div>
  );
}

export default UserInfo;
