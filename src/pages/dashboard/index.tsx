import { Box, Grid } from "@mui/material";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import InvoiceBanner from "../../components/dashboard/InvoiceBanner";   
import RetainedInvoicesCard from "../../components/dashboard/RetainedInvoicesCard"; 
import DueInvoicesCard from "../../components/dashboard/DueInvoicesCard";
import PendingInvoicesTabs from "../../components/dashboard/PendingInvoicesTabs";

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header />

        {/* Content Area */}
        <Box sx={{ p: 3, flex: 1 }}>
          {/* Invoice Banner */}
          <InvoiceBanner />

          {/* Cards Row */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <RetainedInvoicesCard />
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }}>
              <DueInvoicesCard />
            </Grid>
          </Grid>

          {/* Pending Invoices Tabs */}
          <Box sx={{ mt: 3 }}>
            <PendingInvoicesTabs />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
