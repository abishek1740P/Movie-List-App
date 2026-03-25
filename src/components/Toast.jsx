import { useEffect } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Toast.css";

function Toast() {
  const { toast } = useMovieContext();

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">
        {toast.type === "success" ? "❤️" : "💔"}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}

export default Toast;
