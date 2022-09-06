import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/footer.component";
import Header from "../Header/header.component";

function ExtraHeaderFooter() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default ExtraHeaderFooter;
