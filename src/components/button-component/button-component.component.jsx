import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "./button-component.style.scss";

const ButtonComponent = (props) => {
  const { title, addAcction } = props;
  return (
    <div className="button-component" onClick={addAcction}>
      <Button className="buttonComponent" variant="outlined" size="medium">
        <AddIcon /> {title}
      </Button>
    </div>
  );
};

export default ButtonComponent;
