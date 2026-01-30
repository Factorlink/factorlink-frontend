import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import Layout from "../../components/Layout";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";



const Facturas = () => {
  const theme = useTheme();
  const { currentRole } = useAuthStore();
  const { loading, getFacturas } = useFacturas();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: 10,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchFacturas = async () => {
      if (currentRole?.empresaId) {
        const  { data, meta: metaResponse } = await getFacturas({
          page: meta.page,
          limit: meta.limit,
          empresaId: currentRole.empresaId,
        });
        setFacturas(data);
        setMeta(metaResponse);
      }
    };
    
    fetchFacturas();
  }, [currentRole?.empresaId, meta.page]);

  return (
    <Layout>
      Facturas
    </Layout>
  );
};

export default Facturas;
