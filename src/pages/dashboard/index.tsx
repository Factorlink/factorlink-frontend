import { Box, Grid } from "@mui/material";
import Layout from "../../components/Layout";
import InvoiceBanner from "../../components/Dashboard/InvoiceBanner";
import RetainedInvoicesCard from "../../components/Dashboard/RetainedInvoicesCard";
import DueInvoicesCard from "../../components/Dashboard/DueInvoicesCard";
import PendingInvoicesTabs from "../../components/Dashboard/PendingInvoicesTabs";

const Dashboard = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default Dashboard;
