import React from "react";
import "./row.style.scss";
function Row({ children, justifyContent }) {
  return <div className={`row ${justifyContent}`}>{children}</div>;
}

export default Row;
