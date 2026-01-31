import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Factura } from "../../../types/factura";
import { useFacturas } from "../../../hooks/useFacturas";

const FacturaDetail = () => {
  const { getFacturaById } = useFacturas();
  const { id } = useParams();
  const [factura, setFactura] = useState<Factura | null>(null);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const data = await getFacturaById(id!);
        setFactura(data);
      } catch (error) {
        console.error("Error fetching factura:", error);
      }
    };
    fetchFactura();
  }, [id, getFacturaById]);

  return (
    <div>
      {factura ? (
        <div>
          <h1>Factura {factura.id}</h1>
          <p>Cliente: {factura.empresaId}</p>
          <p>Total: {factura.montoTotal}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default FacturaDetail;