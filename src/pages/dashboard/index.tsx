import { Box, Grid } from "@mui/material";
import Layout from "../../components/Layout";
import InvoiceBanner from "../../components/Dashboard/InvoiceBanner";
import RetainedInvoicesCard from "../../components/Dashboard/RetainedInvoicesCard";
import DueInvoicesCard from "../../components/Dashboard/DueInvoicesCard";
import PendingInvoicesTabs from "../../components/Dashboard/PendingInvoicesTabs";
import { appContentSx } from "../../theme/layoutStyles";

const Dashboard = () => {
  return (
    <Layout>
      {/* Content Area */}
      <Box sx={appContentSx}>
        {/* Invoice Banner */}
        <InvoiceBanner />

        {/* Cards Row */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 1, md: 2 } }}>
          <Grid size={{ xs: 12, lg: 5 }} sx={{ minWidth: 0 }}>
            <RetainedInvoicesCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }} sx={{ minWidth: 0 }}>
            <DueInvoicesCard />
          </Grid>
        </Grid>

        {/* Pending Invoices Tabs */}
        <Box sx={{ mt: { xs: 2, md: 3 } }}>
          <PendingInvoicesTabs />
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
