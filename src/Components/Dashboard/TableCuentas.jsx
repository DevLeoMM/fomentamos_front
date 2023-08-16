import { Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useCallback, useContext, useMemo } from "react";
import AuthContext from "../../AuthContext/AuthContext";
import { toastError, toastInfo, toastSuccess } from "../../Helpers/toast";
import { numbertostr } from "../../Helpers/functions";

const cuentasApi = import.meta.env.VITE_APP_CUENTAS;

export default function TableCuentas({
  cuentas,
  loadingtablecuentas,
  updateCuentas,
  setCuentas,
}) {
  const { auth, setAuth } = useContext(AuthContext);



  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !window.confirm(
          `Estas seguro que deseas eliminar la cuenta numero ${row.getValue(
            "numero_cuenta"
          )}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render

      let id = row.original.id;
      let movimientos = row.original.movimientos_cuenta.length;

      if (movimientos !== 0) {
        toastInfo(`La cuenta tiene movimientos`);
        return
      }

      try {
        let response = await fetch(`${cuentasApi}/${id}`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${auth.jwt}`,
            "Content-Type": "application/json",
          },
        });

        let result = await response.json();

        if (result.error) {
          if (result.error.status == 404) {
            toastInfo(`Cuenta no encontrada`);

            //Actualizar tabla
            cuentas.splice(row.index, 1);
            setCuentas([...cuentas]);
            return;
          }

          setAuth({
            login: false,
            username: null,
            jwt: null,
          });

          return;
        }

        toastSuccess(`Cuenta eliminada`);

        //Actualizar tabla
        cuentas.splice(row.index, 1);
        setCuentas([...cuentas]);

        return;
      } catch (err) {
        toastError(`Ha ocurrido un error`);

        setAuth({
          login: false,
          username: null,
          jwt: null,
        });
        return;
      }
    },
    [cuentas]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "cliente.rut",
        header: "Rut",
      },
      {
        accessorKey: "numero_cuenta",
        header: "Cuenta",
      },
      {
        accessorKey: "cliente.nombre",
        header: "Cliente",
      },
      {
        accessorKey: "cliente.apellido",
        header: "Apellido",
      },
      {
        accessorKey: "cliente.tipo_cliente",
        header: "Tipo",
      },
      {
        accessorKey: "saldo",
        header: "Saldo",
        Cell: ({ cell }) => (
        <span>{numbertostr(cell.getValue("saldo"))}</span>
      ),
      },
      {
        accessorKey: "moneda",
        header: "Moneda",
      },
    ],
    []
  );

  return (
    <div className="row mb-2">
      <div className="col">
        <MaterialReactTable
          columns={columns}
          data={cuentas}
          state={{
            isLoading: loadingtablecuentas,
          }}
          enableRowActions
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </div>
    </div>
  );
}
