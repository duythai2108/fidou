import React from "react";
import "./room.style.scss";
function Room({ name, time, isActive }) {
  return (
    <div className={`room ${isActive ? "active" : ""}`}>
      <div className="room__name">{name}</div>
      <div className="room__time">{time}</div>
    </div>
  );
}

export default Room;
