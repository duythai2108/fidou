import React from "react";
import { Link } from "react-router-dom";
import Background from "../../components/Background/background.component";
import DropdownList from "../../components/DropdownList/dropdowlist.component";
import TalenList from "../../components/TalenList/talenlist.component";
import PATH from "../../constans/path";
function Home() {
  return (
    <div>
      <DropdownList />
      <Background />
      <TalenList />
    </div>
  );
}

export default Home;
