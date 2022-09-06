import React from "react";
import "./img.style.scss";
function ImageComponent({ src }) {
  return (
    <div className="ImageComponent">
      <div className="img">
        <img src={src} alt="" />
      </div>
    </div>
  );
}

export default ImageComponent;
