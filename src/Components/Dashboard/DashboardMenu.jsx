import React, { useContext, useEffect, useState } from "react";
import SaveClientForm from "./SaveClientForm";
import SaveCuentaForm from "./SaveCuentaForm";
import SaveMovimientoForm from "./SaveMovimientoForm";
import TableClients from "./TableClients";
import TableCuentas from "./TableCuentas";
import * as qs from "qs";
import AuthContext from "../../AuthContext/AuthContext";
import { toastError } from "../../Helpers/toast";

const clientesApi = import.meta.env.VITE_APP_CLIENTES;
const cuentasApi = import.meta.env.VITE_APP_CUENTAS;

export default function DashboardMenu() {
  const [clientes, setClientes] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  const [loadingtableclientes, setLoadingTableClientes] = useState(false);
  const [loadingtablecuentas, setLoadingTableCuentas] = useState(false);

  const { auth, setAuth } = useContext(AuthContext);

  const updateClientes = async (e) => {
    setLoadingTableClientes(true);

    const query = qs.stringify(
      {
        populate: {
          cuentas: {
            populate: ["movimientos_cuenta"],
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );

    try {
      let response = await fetch(`${clientesApi}?${query}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
      });

      let result = await response.json();

      if (result.error) {
        toastError(`Ocurrio algun error`);

        setAuth({
          login: false,
          username: null,
          jwt: null,
          customers_limit: null,
        });
        return;
      }

      //ok
      //Normalizar datos

      setClientes(result.data);
      //console.log(result.data);
      setLoadingTableClientes(false);

      return;
    } catch (err) {
      toastError(`No hay conexión al servidor`);
      setAuth({
        login: false,
        username: null,
        jwt: null,
      });
      return;
    }
  };

  const updateCuentas = async (e) => {
    setLoadingTableCuentas(true);

    const query = qs.stringify(
      {
        populate: "*",
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );

    try {
      let response = await fetch(`${cuentasApi}?${query}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
      });

      let result = await response.json();

      if (result.error) {
        toastError(`Ocurrio algun error`);

        setAuth({
          login: false,
          username: null,
          jwt: null,
          customers_limit: null,
        });
        return;
      }

      //ok

      setCuentas(result.data);
      //console.log(result.data);
      setLoadingTableCuentas(false);

      return;
    } catch (err) {
      toastError(`No hay conexión al servidor`);
      setAuth({
        login: false,
        username: null,
        jwt: null,
      });
      return;
    }
  };

  useEffect(() => {
    updateClientes();
    updateCuentas();
  }, []);

  return (
    <div className="container">
      <div className="row py-5 justify-content-center align-items-center">
        <div className="col">
          <div className="card card-registration" style={{}}>
            <div className="card-body p-4">
              <nav className="">
                <div className="nav nav-tabs mb-2" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active"
                    id="nav-clientes-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-clientes"
                    type="button"
                    role="tab"
                    aria-controls="nav-clientes"
                    aria-selected="true"
                  >
                    Clientes
                  </button>

                  <button
                    className="nav-link"
                    id="nav-cuentas-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-cuentas"
                    type="button"
                    role="tab"
                    aria-controls="nav-cuentas"
                    aria-selected="false"
                  >
                    Cuentas
                  </button>

                  <button
                    className="nav-link"
                    id="nav-movimientos-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-movimientos"
                    type="button"
                    role="tab"
                    aria-controls="nav-movimientos"
                    aria-selected="false"
                  >
                    Movimientos
                  </button>
                </div>
              </nav>

              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-clientes"
                  role="tabpanel"
                  aria-labelledby="nav-clientes-tab"
                >
                  <SaveClientForm updateClientes={updateClientes} />
                  <TableClients
                    clientes={clientes}
                    loadingtableclientes={loadingtableclientes}
                  />
                </div>
              </div>

              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade"
                  id="nav-cuentas"
                  role="tabpanel"
                  aria-labelledby="nav-cuentas-tab"
                >
                  <SaveCuentaForm
                    clientes={clientes}
                    updateCuentas={updateCuentas}
                  />
                  <TableCuentas
                    cuentas={cuentas}
                    loadingtablecuentas={loadingtablecuentas}
                    updateCuentas={updateCuentas}
                    setCuentas={setCuentas}
                  />
                </div>
              </div>

              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade"
                  id="nav-movimientos"
                  role="tabpanel"
                  aria-labelledby="nav-movimientos-tab"
                >
                  <SaveMovimientoForm
                    cuentas={cuentas}
                    updateCuentas={updateCuentas}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
