import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";

const Layout = ({
  children,
  hideMenu = false,
  hideSuite = false,
}: {
  children: React.ReactNode;
  hideMenu?: boolean;
  hideSuite?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        maxHeight: "100dvh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg-default-secondary)",
      }}
    >
      {!hideMenu && <Sidebar />}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Header hideSuite={hideSuite} />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
