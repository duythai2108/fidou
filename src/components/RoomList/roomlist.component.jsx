import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Room from "../Room/room.component";
import "./roomlist.style.scss";
function RoomList({ room, setOnRoom, onRoom }) {
  const { Panel } = Collapse;

  return (
    <div className="roomlist">
      <Collapse ghost defaultActiveKey={1} className="roomlist__collapse">
        <Panel header="Danh sách các phòng làm việc" key={1}>
          <div className="roomlist__collapse__search">
            <SearchOutlined />
            <input type="text" placeholder="Search room" />
          </div>
          {room.map((item, index) => {
            return (
              <Typography.Link
                key={index}
                onClick={() => {
                  setOnRoom(item);
                }}
              >
                <Room
                  name={item.title}
                  isActive={item.id == onRoom.id}
                  time={item.lastSent}
                />
              </Typography.Link>
            );
          })}
        </Panel>
      </Collapse>
    </div>
  );
}

export default RoomList;
