import { Avatar, Tooltip } from "antd";
import React from "react";
import Swal from "sweetalert2";
import "./message.style.scss";
function Message({ text, createAt, isMe, type, src, user, status }) {
  return (
    <div className={`message ${isMe ? "me" : ""}`}>
      <div className="wrapper">
        <div>
          <Tooltip title={user?.name}>
            <Avatar src={user?.avatarUrl ? user?.avatarUrl : user?.logoUrl} />
          </Tooltip>
        </div>
        <div className="message__text">
          <Tooltip title={createAt}>
            {type == "text" ? (
              <p>{text}</p>
            ) : (
              <audio
                controls
                controlsList={status == 1 ? "nodownload" : ""}
                onTimeUpdate={(e) => {
                  if (status == 1) {
                    const total = e.target.duration;
                    const limit = total * 0.1;
                    const currentTime = e.target.currentTime;
                    if (currentTime > limit) {
                      e.target.pause();
                      Swal.fire("Kết thúc dự án để nghe toàn bộ!");
                    }
                  }
                }}
              >
                <source src={src} />
              </audio>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Message;
