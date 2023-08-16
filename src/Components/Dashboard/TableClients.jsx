import { Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useMemo } from "react";

export default function TableClients({ clientes, loadingtableclientes }) {
  const handleEditRow = async () => {};

  const columns = useMemo(
    () => [
      {
        accessorKey: "tipo_cliente", //access nested data with dot notation
        header: "Tipo de cliente",
        /* muiTableHeadCellProps: {
              align: "center",
            },
            muiTableBodyCellProps: {
              align: "center",
            }, */
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "apellido",
        header: "Apellido",
      },
      {
        accessorKey: "tipo_documento",
        header: "tipo de documento",
      },
      {
        accessorKey: "numero_documento",
        header: "Numero de documento",
      },
      {
        accessorKey: "razon_social",
        header: "Razón Social",
      },
      {
        accessorKey: "rut",
        header: "Numero de Rut",
      },
      {
        accessorKey: "fecha_fundacion",
        header: "Año de fundacion",
      },
    ],
    []
  );

  return (
    <div className="row mb-2">
      <div className="col">
        <MaterialReactTable
          columns={columns}
          data={clientes}
          state={{
            isLoading: loadingtableclientes,  
          }}
          renderDetailPanel={({ row }) => (
            <Box>
            
            </Box>
          )}
        />
      </div>
    </div>
  );
}
