import React from "react";
import "./comment.style.scss";
import Rating from "@mui/material/Rating";

function Comment({ value, content, date }) {
  return (
    <div className="comment">
      <p>{date}</p>
      <Rating name="read-only" value={value} readOnly />
      <p>{content}</p>
    </div>
  );
}

export default Comment;
