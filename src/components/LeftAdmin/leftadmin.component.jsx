import { List } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./leftadmin.style.scss";
import ButtonItem from "../ButtonItem/buttonitem.component";
import path from "../../constans/path";
import CategoryIcon from "@mui/icons-material/Category";
function LeftAdmin({ accountAdmin, isShow, showNav }) {
  let [account, setAccount] = useState(accountAdmin);
  useEffect(() => {
    // const account = JSON.parse(localStorage.getItem("account"));
    // setAccount(account);
    console.log(account);
  }, []);
  return (
    <div className="">
      <div className={`dashboard__left ${isShow ? "active" : ""}`}>
        <Link to="/dashboard/profile">
          <div className="dashboard__left__profile">
            <img
              src={
                account.avatarUrl
                  ? account.avatarUrl
                  : "http://vcap.vn/public/admin/img/avatar.png"
              }
              alt=""
            />
            <h6>{account.name}</h6>
          </div>
        </Link>

        <div className="dashboard__left__listpage">
          <List>
            <>
              <ButtonItem
                to={"/" + path["ADMIN_PAGE"] + "/" + path["ACCOUNT_ADMIN_PAGE"]}
                title="Account"
                showNav={showNav}
              >
                <CategoryIcon className="icon" />
              </ButtonItem>
              <ButtonItem
                to={
                  "/" + path["ADMIN_PAGE"] + "/" + path["CATEGORY_ADMIN_PAGE"]
                }
                title="Category"
                showNav={showNav}
              >
                <CategoryIcon className="icon" />
              </ButtonItem>
              <ButtonItem
                to={
                  "/" +
                  path["ADMIN_PAGE"] +
                  "/" +
                  path["SUBCATEGORY_ADMIN_PAGE"]
                }
                title="Sub Category"
                showNav={showNav}
              >
                <CategoryIcon className="icon" />
              </ButtonItem>
              <ButtonItem
                to={"/" + path["ADMIN_PAGE"] + "/" + path["DEPOSIT_ADMIN_PAGE"]}
                title="Deposit"
                showNav={showNav}
              >
                <CategoryIcon className="icon" />
              </ButtonItem>
              <ButtonItem
                to={"/" + path["ADMIN_PAGE"] + "/" + path["REPORT"]}
                title="Report"
                showNav={showNav}
              >
                <CategoryIcon className="icon" />
              </ButtonItem>
            </>
          </List>
        </div>
      </div>
      <div
        className={`overlay ${isShow ? "active" : ""}`}
        onClick={() => {
          showNav(false);
        }}
      ></div>
    </div>
  );
}

export default LeftAdmin;
