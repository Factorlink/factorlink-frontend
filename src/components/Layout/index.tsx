import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;