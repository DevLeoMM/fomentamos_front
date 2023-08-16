import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toastError, toastInfo, toastSuccess } from "../../Helpers/toast";
import CurrencyFormat from "react-currency-format";
import { strtonumber } from "../../Helpers/functions";
import AuthContext from "../../AuthContext/AuthContext";

const apiMovimientos = import.meta.env.VITE_APP_MOVIMIENTOS;
const cuentasApi = import.meta.env.VITE_APP_CUENTAS;

let maxsaldopeso = import.meta.env.VITE_APP_MAXSALDOPESO;
let maxsaldodolar = import.meta.env.VITE_APP_MAXSALDODOLAR;
let maxsaldoeuro = import.meta.env.VITE_APP_MAXSALDOEURO;

//convertir en numero
maxsaldopeso = strtonumber(maxsaldopeso);
maxsaldodolar = strtonumber(maxsaldodolar);
maxsaldoeuro = strtonumber(maxsaldoeuro);

const initialForm = {
  tipo_movimiento: "ingreso",
  monto: "",
  cuenta: "DEFAULT",
};

export default function SaveMovimientoForm({ updateCuentas, cuentas }) {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  let button_save = loading ? "" : "Guardar Movimiento";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: initialForm,
    mode: "onChange",
  });

  const onSubmit = async (form) => {
    if (!strtonumber(form.monto)) {
      window.alert("Coloca un monto");
      return;
    }

    if (form.cuenta === "DEFAULT") {
      window.alert("Selecciona una cuenta");
      return;
    }

    //buscar cuenta
    let cuenta = cuentas.find((element) => element.id == form.cuenta);

    //valores
    let saldocuenta = strtonumber(cuenta.saldo);
    let monto = strtonumber(form.monto);
    let maximo = 0;
    let resultado = 0;
    if (cuenta.moneda == "peso") {
      maximo = maxsaldopeso;
    }
    if (cuenta.moneda == "dolar") {
      maximo = maxsaldodolar;
    }
    if (cuenta.moneda == "euro") {
      maximo = maxsaldoeuro;
    }

    if (form.tipo_movimiento == "egreso") {
      resultado = saldocuenta - monto;

      if (resultado < 0) {
        toastInfo("Saldo de cuenta no puede ser menor a 0");
        return;
      }
    }

    if (form.tipo_movimiento == "ingreso") {
      resultado = saldocuenta + monto;

      if (resultado > maximo) {
        if (cuenta.moneda == "peso")
          toastInfo(`Saldo de cuenta no puede ser mayor a ${maxsaldopeso} cop`);

        if (cuenta.moneda == "dolar")
          toastInfo(`Saldo de cuenta no puede ser mayor a ${maxsaldodolar} $`);

        if (cuenta.moneda == "euro")
          toastInfo(`Saldo de cuenta no puede ser mayor a ${maxsaldoeuro} €`);

        return;
      }
    }

    let dataSendMovimientos = {
      ...form,
      monto: strtonumber(form.monto),
    };

    let dataUpdateCuenta = {
      saldo: resultado.toString(),
    };

    try {
      let response = await fetch(apiMovimientos, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataSendMovimientos }),
      });

      let result = await response.json();

      if (result.error) {
        toastError(`Ocurrio algun error`);

        reset(initialForm);
        setLoading(false);
        return;
      }

      // ok
      toastSuccess(`Movimiento registrado`);

      let response2 = await fetch(`${cuentasApi}/${form.cuenta}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataUpdateCuenta }),
      });

      let result2 = await response2.json();

      setLoading(false);
      reset(initialForm);
      updateCuentas();
      //updateMovimientos();

      return;
    } catch (err) {
      toastError(`Ha ocurrido algun error`);
      console.log(err);

      //cleanUi
      reset(initialForm);
      setLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="mb-4">
            <select
              className="form-select text-center"
              disabled={loading}
              {...register("tipo_movimiento")}
            >
              <option default value="ingreso">
                Ingreso
              </option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
        </div>

        <div className="col-sm-6 col-md-2">
          <div className="form-outline">
            <Controller
              control={control}
              name="monto"
              rules={{}}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <CurrencyFormat
                  className="form-control text-center"
                  name={name}
                  value={value}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  placeholder="Monto"
                  onChange={onChange}
                  onBlur={onBlur}
                  onKeyDown={(evt) => {
                    if (evt.key === "-" || evt.key === ",")
                      return evt.preventDefault();
                  }}
                  disabled={loading}
                />
              )}
            />
            {errors.monto && (
              <div className="invalid-tooltip">{errors.monto.message}</div>
            )}
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="mb-4">
            <select
              className="form-select text-center"
              placeholder="cuenta"
              name="cuenta"
              disabled={loading}
              defaultValue={"DEFAULT"}
              {...register("cuenta")}
            >
              <option value="DEFAULT" disabled>
                {" "}
                -- Cuenta --{" "}
              </option>

              {cuentas.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >{`Cuenta - ${c.numero_cuenta}`}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-sm-6 col-md-4">
            <div className="d-grid">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div
                    className="spinner-border"
                    style={{ width: "2.7rem", height: "2.7rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-outline-custom-color fw-bold"
                  type="submit"
                >
                  {button_save}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
