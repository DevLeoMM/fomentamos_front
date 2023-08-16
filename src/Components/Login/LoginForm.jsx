import { useContext, useEffect, useState } from "react";
import logo from "../../Resources/Logo.png";
import { toastError } from "../../Helpers/toast";
import AuthContext from "../../AuthContext/AuthContext";
import { useForm } from "react-hook-form";

const auth = import.meta.env.VITE_APP_AUTH;
let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;

////////////////////////////////// InitialStates
const initialForm = {
  email: "",
  password: "",
};
/////////////////////////////////////

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialForm,
    mode: "onChange",
  });

  let button_ingresar = loading ? "" : "Entrar";

  useEffect(() => {
  }, []);

  const onSubmit = async (form) => {
    setLoading(true);
    
    let datasend = { identifier: form.email, password: form.password };

    try {
      let response = await fetch(auth, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datasend),
      });

      let result = await response.json();

      if (result.error) {
        toastError(`Credenciales Invalidas`);

        //limpiar formulario, enfocar email 
        
        reset(initialForm)
        setLoading(false);
        return;
      }
      
      // Login Correcto
      setAuth({
        login: true,
        jwt: result.jwt,
        username: result.user.username,
        customers_limit: result.user.customers_limit,
      });
      
      //setLoading(false);

      return;
    } catch (err) {
      toastError(`No hay conexión al servidor`);

      //cleanUi();
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <div className="container">
        <div className="row vh-100 justify-content-center align-items-center ">
          <div className="col-10 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
            <div className="card card-registration">
              <div className="card-body p-4">
                  <div className="col-sm-6 mb-4 mx-auto">
                      <img
                        src={logo}
                        className="img-fluid mx-auto d-block"
                        alt="Logo"
                        width="160"
                      ></img>
                    </div>

                <h5 className="card-title text-center mb-2 fs-2">
                  Clientes Fomentamos
                </h5>
                <h6 className="text-center mb-4">
                  Ingresa tus credenciales para continuar
                </h6>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-outline mb-3 position-relative">
                    <input
                      type="email"
                      className={`form-control form-control-lg text-center ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email"
                      autoFocus={true}
                      disabled={loading}
                      
                      {...register("email", {
                        required: "Campo requerido",
                        pattern: {
                          value: regexEmail,
                          message: "Formato invalido",
                        },
                      })}
                    />
                    <div className="invalid-tooltip">
                      {errors.email?.message}
                    </div>
                  </div>

                  <div className="form-outline mb-4 position-relative">
                    <input
                      type="password"
                      className={`form-control form-control-lg text-center ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Clave"
                      disabled={loading}
                      {...register("password", {
                        required: "Campo requerido",
                      })}
                    />
                    <div className="invalid-tooltip">
                      {errors.password?.message}
                    </div>
                  </div>

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
                        className="btn btn-outline-custom-color fw-bold fs-5"
                        type="submit"
                      >
                        {button_ingresar}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
