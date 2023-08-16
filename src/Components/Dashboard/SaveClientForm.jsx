import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toastError, toastSuccess } from "../../Helpers/toast";
import AuthContext from "../../AuthContext/AuthContext";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let regexNombreApellido = /^[a-zA-Z]*$/;
let regexDocumento = /^[0-9]*$/;
let regexRut = /^[0-9]*$/;
let regexRazon_Social = /^[a-zA-Z ]*$/;

const apiCLientes = import.meta.env.VITE_APP_CLIENTES;

////////////////////////////////// InitialStates
const initialFormPersonaNatural = {
  nombre: "",
  apellido: "",
  tipo_documento: "cedula_ciudadania",
  numero_documento: "",
  rut: "",
};

const initialFormPersonaJuridica = {
  tipo_cliente: "",
  rut: "",
  razon_social: "",
};
/////////////////////////////////////

export default function SaveClientForm({ updateClientes }) {
  const [loading, setLoading] = useState(false);
  const [tipo_cliente, setTipo_cliente] = useState("persona_natural");
  const { auth } = useContext(AuthContext);

  let button_save = loading ? "" : "Guardar Cliente";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialFormPersonaNatural,
    mode: "onChange",
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    control: control2,
  } = useForm({
    defaultValues: {},
    mode: "onChange",
  });

  const handleSelectChange = (e) => {
    setTipo_cliente(e.target.value);
  };

  const onSubmitPersonaNatural = async (form) => {
    setLoading(true);

    let data = { ...form, tipo_cliente: tipo_cliente };

    try {
      let response = await fetch(apiCLientes, {
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
        toastError(`Rut se encuentra registrado`);

        reset(initialFormPersonaNatural);
        setLoading(false);
        return;
      }

      // Login Correcto
      toastSuccess(`Cliente registrado`);

      setLoading(false);
      reset(initialFormPersonaNatural);
      updateClientes();

      return;
    } catch (err) {
      toastError(`Ha ocurrido algun error`);

      //cleanUi();
      reset(initialFormPersonaNatural);
      setLoading(false);
      return;
    }
  };

  const onSubmitPersonaJuridica = async (form) => {
    setLoading(true);

    let data = {
      ...form,
      fecha_fundacion: new Date().getFullYear(form.fecha_fundacion),
      tipo_cliente: tipo_cliente,
    };

    try {
      let response = await fetch(apiCLientes, {
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
        toastError(`Rut se encuentra registrado`);

        reset2(initialFormPersonaJuridica);
        setLoading(false);
        return;
      }

      // Login Correcto
      toastSuccess(`Cliente registrado`);

      setLoading(false);
      reset2(initialFormPersonaJuridica);
      updateClientes();

      return;
    } catch (err) {
      toastError(`Ha ocurrido algun error`);

      //cleanUi();
      reset2(initialFormPersonaJuridica);
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-6 col-md-3">
          <div className="mb-4">
            <select
              className="form-select"
              name="tipo_cliente"
              disabled={loading}
              onChange={handleSelectChange}
            >
              <option default value="persona_natural">
                Persona Natural
              </option>
              <option value="persona_juridica">Persona Jurídica</option>
            </select>
          </div>
        </div>
      </div>

      {tipo_cliente === "persona_natural" ? (
        <form key={1} onSubmit={handleSubmit(onSubmitPersonaNatural)}>
          <div className="row mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors.nombre ? "is-invalid" : ""
                  }`}
                  placeholder="Nombre"
                  autoFocus={true}
                  disabled={loading}
                  {...register("nombre", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexNombreApellido,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 80, message: "Máximo 80 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">{errors.nombre?.message}</div>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors.apellido ? "is-invalid" : ""
                  }`}
                  placeholder="Apellido"
                  disabled={loading}
                  {...register("apellido", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexNombreApellido,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 250, message: "Máximo 250 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">
                  {errors.apellido?.message}
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="mb-4">
                <select
                  className="form-select text-center"
                  placeholder="tipo_documento"
                  name="tipo_documento"
                  disabled={loading}
                  {...register("tipo_documento")}
                >
                  <option default value="cedula_ciudadania">
                    Cedula Ciudadania
                  </option>
                  <option value="cedula_extranjeria">Cedula Extranjeria</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors.numero_documento ? "is-invalid" : ""
                  }`}
                  placeholder="Documento"
                  disabled={loading}
                  {...register("numero_documento", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexDocumento,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 15, message: "Máximo 15 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">
                  {errors.numero_documento?.message}
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors.rut ? "is-invalid" : ""
                  }`}
                  placeholder="Rut"
                  disabled={loading}
                  {...register("rut", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexRut,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 9, message: "Máximo 9 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">{errors.rut?.message}</div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-sm-6 col-md-3">
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
        </form>
      ) : (
        <form key={2} onSubmit={handleSubmit2(onSubmitPersonaJuridica)}>
          <div className="row mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors2.razon_social ? "is-invalid" : ""
                  }`}
                  placeholder="Razón Social"
                  autoFocus={true}
                  disabled={loading}
                  {...register2("razon_social", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexRazon_Social,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">
                  {errors2.razon_social?.message}
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-2">
              <div className="form-outline">
                <Controller
                  control={control2}
                  rules={{
                    required: { value: true, message: "Requerido" },
                  }}
                  name="fecha_fundacion"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <ReactDatePicker
                      className="form-control text-center"
                      showYearPicker
                      dateFormat="yyyy"
                      onChange={onChange}
                      onBlur={onBlur}
                      selected={value}
                    />
                  )}
                />
                {errors2.fecha_fundacion && (
                  <div className="">{errors2.fecha_fundacion.message}</div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="form-outline position-relative">
                <input
                  type="text"
                  className={`form-control text-center ${
                    errors2.rut ? "is-invalid" : ""
                  }`}
                  placeholder="Rut"
                  disabled={loading}
                  {...register2("rut", {
                    required: "Campo requerido",
                    pattern: {
                      value: regexRut,
                      message: "Formato invalido",
                    },
                    maxLength: { value: 9, message: "Máximo 9 caracteres" },
                  })}
                />
                <div className="invalid-tooltip">{errors2.rut?.message}</div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-sm-6 col-md-3">
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
        </form>
      )}
    </>
  );
}
