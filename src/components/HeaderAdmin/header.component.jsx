import React, { useEffect, useRef, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TableRowsIcon from "@mui/icons-material/TableRows";
import "./header.style.scss";
import { Link } from "react-router-dom";
import { List, ListItemButton } from "@mui/material";
import path from "../../constans/path";
function Header({ setDark, showNav }) {
  let [showInfo, setShowInfo] = useState(false);
  let [showNotification, setShowNotification] = useState(false);
  let avatar = useRef(null);
  let bell = useRef(null);
  useEffect(() => {
    // window.addEventListener("click", (event) => {
    //   if (avatar.current != event.target) {
    //     setShowInfo(false);
    //   } else {
    //     setShowInfo(true);
    //   }
    //   if (bell.current.contains(event.target)) {
    //     setShowNotification(true);
    //   } else {
    //     setShowNotification(false);
    //   }
    // });
  }, []);
  return (
    <div className="header__admin">
      <div
        className=""
        onClick={() => {
          showNav(true);
        }}
      >
        <TableRowsIcon className="tab" />
      </div>

      <div className="">
        {/* <ToggleButton label="test" setDark={setDark} /> */}
        <div className="notification-wrapper">
          <div
            className=""
            onClick={() => {
              setShowNotification(true);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              setShowNotification(true);
            }}
          >
            <NotificationsIcon className="icon" ref={bell} />
          </div>
          <div className={`notification ${showNotification ? "active" : ""}`}>
            <div className="notification__item">
              <p>notification item</p>
            </div>
            <div className="notification__item">
              <p>notification item</p>
            </div>
            <div className="notification__item">
              <p>notification item</p>
            </div>
          </div>
        </div>
        <div
          className="header__admin__avatar"
          onContextMenu={(event) => {
            event.preventDefault();
            setShowInfo(true);
          }}
        >
          <img
            src="https://minimal-kit-react.vercel.app/static/mock-images/avatars/avatar_default.jpg"
            alt=""
            ref={avatar}
          />

          <div className={`menu ${showInfo ? "active" : ""}`}>
            <h5 className="menu__fullname">Tran Gia Bao</h5>
            <h6 className="menu__email">baotgse140077@fpt.edu.vn</h6>

            <List className="menu__link">
              <Link to={path["PROFILE_PAGE"]} className="menu__link__item">
                <ListItemButton>My Profile</ListItemButton>
              </Link>
              <Link to={path["LOGIN_PAGE"]} className="menu__link__item">
                <ListItemButton>Log out</ListItemButton>
              </Link>
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
