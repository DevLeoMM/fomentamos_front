import { toast } from "react-toastify";

export function toastSuccess(message) {
  return toast.success(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { fontFamily: "Helvetica", fontSize: "large", textAlign: "center"}
  });
}

export function toastInfo(message) {
  return toast.info(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { fontFamily: "Helvetica", fontSize: "large", textAlign: "center"}
  });
}

export function toastError(message) {
  return toast.error(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { fontFamily: "Helvetica", fontSize: "large", textAlign: "center"}
  });
}