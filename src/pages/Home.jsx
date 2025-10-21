import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SubNavbar from "../components/SubNavbar/SubNavbar";
import Background from "../components/Background/Background";
import DealsAndHighLights from "../components/DealsAndHighlights/DealsAndHighLights";
import AdminLayout from "../layouts/admin/admin-layout";
const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <SubNavbar></SubNavbar>
      <Background></Background>
      <DealsAndHighLights></DealsAndHighLights>
      {/* <AdminLayout /> */}
    </div>
  );
};

export default Home;
