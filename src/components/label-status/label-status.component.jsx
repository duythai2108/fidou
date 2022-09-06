import React, { useState } from "react";
import "./label-status.style.scss";

const LabelStatus = (props) => {
  const { state, label, size } = props;
  return <p className={` label-status ${state} ${size}`}>{label}</p>;
};

export default LabelStatus;
