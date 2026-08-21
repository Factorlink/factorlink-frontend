import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { Storefront, Visibility, CheckCircle } from "@mui/icons-material";
import Layout from "../../components/Layout";
import FactoringMarketplaceTable from "../../components/Facturas/FactoringMarketplaceTable";
import FactoringOfertasTable from "../../components/Facturas/FactoringOfertasTable";
import FactoringCedidasTable from "../../components/Facturas/FactoringCedidasTable";
import useAuthStore from "../../store/authStore";
import type { Meta } from "../../types/meta";
import {
  pageHeaderSx,
  appContentSx,
} from "../../theme/layoutStyles";

const TAB_ROUTES = [
  "/marketplace",
  "/marketplace/ofertas",
  "/marketplace/cedidas",
];

const EMPTY_META: Meta = {
  lastPage: 1,
  limit: 10,
  page: 1,
  total: 0,
  totalCargada: 0,
  totalCedida: 0,
  totalEnMarketplace: 0,
  totalConOfertas: 0,
  totalGeneral: 0,
};

const getTabFromPath = (pathname: string) => {
  const idx = TAB_ROUTES.indexOf(pathname);
  return idx >= 0 ? idx : 0;
};

/** Keep badge totals when resetting pagination/filters on tab change. */
const preserveBadgeMeta = (prev: Meta): Meta => ({
  ...EMPTY_META,
  totalEnMarketplace: prev.totalEnMarketplace,
  totalConOfertas: prev.totalConOfertas,
  totalCedida: prev.totalCedida,
  totalGeneral: prev.totalGeneral,
});

const Marketplace = () => {
  const { currentRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const activeTab = getTabFromPath(location.pathname);
  const prevTabRef = useRef(activeTab);
  const factoringId = currentRole?.factoringId || "";
  const prevFactoringIdRef = useRef(factoringId);

  const [meta, setMeta] = useState<Meta>(EMPTY_META);

  const handleChildMetaChange = useCallback((childMeta: Meta) => {
    setMeta((prev) => ({
      ...prev,
      ...childMeta,
      totalEnMarketplace:
        typeof childMeta.totalEnMarketplace === "number"
          ? childMeta.totalEnMarketplace
          : prev.totalEnMarketplace,
      totalConOfertas:
        typeof childMeta.totalConOfertas === "number"
          ? childMeta.totalConOfertas
          : prev.totalConOfertas,
      totalCedida:
        typeof childMeta.totalCedida === "number"
          ? childMeta.totalCedida
          : prev.totalCedida,
      totalGeneral:
        typeof childMeta.totalGeneral === "number"
          ? childMeta.totalGeneral
          : prev.totalGeneral,
    }));
  }, []);

  useEffect(() => {
    const prevTab = prevTabRef.current;
    if (prevTab !== activeTab) {
      prevTabRef.current = activeTab;
      setSearchParams(new URLSearchParams());
      setMeta(preserveBadgeMeta);
    }
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    if (prevFactoringIdRef.current === factoringId) return;
    prevFactoringIdRef.current = factoringId;
    setSearchParams(new URLSearchParams());
    setMeta(EMPTY_META);
  }, [factoringId, setSearchParams]);

  const tabChipSx = (isActive: boolean) => ({
    height: 22,
    minWidth: 22,
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: isActive
      ? "var(--color-bg-accent-primary)"
      : "var(--color-bg-neutral-secondary)",
    color: isActive
      ? "var(--color-fg-on-accent-primary)"
      : "var(--color-fg-default-primary)",
  });

  const marketplaceBadge =
    meta.totalEnMarketplace || (activeTab === 0 ? meta.total : 0);
  const ofertasBadge =
    meta.totalConOfertas || (activeTab === 1 ? meta.total : 0);
  const cedidasBadge = meta.totalCedida || (activeTab === 2 ? meta.total : 0);

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box
          sx={[
            pageHeaderSx,
            {
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: 3,
              p: 3,
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Storefront
                sx={{ color: "var(--color-fg-default-secondary)", fontSize: 28 }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-fg-default-primary)",
                }}
              >
                Marketplace
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Explora las facturas disponibles para financiamiento y envía tus
                ofertas.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => {
              navigate(TAB_ROUTES[newValue]);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              icon={<Storefront sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Marketplace
                  {marketplaceBadge > 0 && (
                    <Chip
                      label={marketplaceBadge}
                      size="small"
                      sx={tabChipSx(activeTab === 0)}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<Visibility sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Con Ofertas
                  {ofertasBadge > 0 && (
                    <Chip
                      label={ofertasBadge}
                      size="small"
                      sx={tabChipSx(activeTab === 1)}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<CheckCircle sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Cedidas
                  {cedidasBadge > 0 && (
                    <Chip
                      label={cedidasBadge}
                      size="small"
                      sx={tabChipSx(activeTab === 2)}
                    />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <FactoringMarketplaceTable
            key={`marketplace-${factoringId}`}
            factoringId={factoringId}
            onMetaChange={handleChildMetaChange}
          />
        ) : activeTab === 1 ? (
          <FactoringOfertasTable
            key={`ofertas-${factoringId}`}
            factoringId={factoringId}
            onMetaChange={handleChildMetaChange}
          />
        ) : (
          <FactoringCedidasTable
            key={`cedidas-${factoringId}`}
            factoringId={factoringId}
            onMetaChange={handleChildMetaChange}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Marketplace;
