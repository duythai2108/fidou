import React from "react";
import { Link } from "react-router-dom";
import PATH from "../../constans/path";
import "./notfound.style.scss";
function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__left">
        <div
          class=""
          style={{ color: "#4a5568", fontWeight: "700", fontSize: "50px" }}
        >
          404
        </div>
        <p class="text-2xl md:text-3xl font-light leading-normal">
          Sorry we couldn't find this page.{" "}
        </p>
        <p class="mb-8">
          But dont worry, you can find plenty of other things on our homepage.
        </p>

        <Link to={PATH["HOME_PAGE"]}>Back to homepage</Link>
      </div>
      <div className="notfound__right">
        <img src="images/notfound.svg" alt="" />
      </div>
    </div>
  );
}

export default NotFound;
