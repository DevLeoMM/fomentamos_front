import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../../Helpers/toast";
import AuthContext from "../../AuthContext/AuthContext";

let regexNumeroCuenta = /^[0-9]*$/;
const cuentasApi = import.meta.env.VITE_APP_CUENTAS;

const initialForm = {
  numero_cuenta: "",
  moneda: "peso",
  saldo: 0,
  cliente: "DEFAULT",
};

export default function SaveCuentaForm({ clientes, updateCuentas }) {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  let button_save = loading ? "" : "Guardar Cuenta";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialForm,
    mode: "onChange",
  });

  const onSubmit = async (form) => {
    if (form.cliente === "DEFAULT") {
      window.alert("Selecciona un cliente");
      return;
    }
    //Create
    let data = {
      ...form,
      saldo: 0,
    };

    try {
      let response = await fetch(cuentasApi, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });

      let result = await response.json();

      if (result.error) {
        toastError(`Cuenta se encuentra registrada`);

        reset(initialForm);
        setLoading(false);
        return;
      }

      // Login Correcto
      toastSuccess(`Cuenta registrada`);

      setLoading(false);
      reset(initialForm);
      updateCuentas();

      return;
    } catch (err) {
      toastError(`Ha ocurrido algun error`);

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
          <div className="form-outline position-relative">
            <input
              type="text"
              className={`form-control text-center ${
                errors.numero_cuenta ? "is-invalid" : ""
              }`}
              placeholder="Numero de cuenta"
              autoFocus={true}
              disabled={loading}
              {...register("numero_cuenta", {
                required: "Campo requerido",
                pattern: {
                  value: regexNumeroCuenta,
                  message: "Formato invalido",
                },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
              })}
            />
            <div className="invalid-tooltip">
              {errors.numero_cuenta?.message}
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="mb-4">
            <select
              className="form-select text-center"
              disabled={loading}
              {...register("moneda")}
            >
              <option default value="peso">
                Peso
              </option>
              <option value="dolar">Dolar</option>
              <option value="euro">Euro</option>
            </select>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="mb-4">
            <select
              className="form-select text-center"
              placeholder="Cliente"
              name="cliente"
              disabled={loading}
              defaultValue={"DEFAULT"}
              {...register("cliente")}
            >
              <option value="DEFAULT" disabled>
                {" "}
                -- Cliente --{" "}
              </option>

              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{`Rut - ${c.rut}`}</option>
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
