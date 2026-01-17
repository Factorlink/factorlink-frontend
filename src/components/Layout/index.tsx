import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";

const Layout = ({ children, hideMenu = false, hideSuite = false }: { children: React.ReactNode; hideMenu?: boolean; hideSuite?: boolean }) => {
  return (
    <Box sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}>
      {!hideMenu && <Sidebar />}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header hideSuite={hideSuite} />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;