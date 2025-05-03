import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Jwt.css";

export default function Redirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const jwt = searchParams.get("access_token");
  return (
    <div style={{ padding: "2em" }}>
      <h1>Atenticación exitosa</h1>
      <div>
        El usuario fue autenticado exitosamente. La respuesta del Identity
        Provider pasó primero por el backend como puede verse en la terminal
        donde está corriendo el mismo.{" "}
      </div>
      <div>
        Subsiguientemente el backend lo redirigió a esta página con el
        'access_token' como un search param, y contiene la siguiente
        información:
        <JsonView value={jwtDecode(jwt)} />
      </div>

      <div className="jwt">
        <h2>JWT Serailizado:</h2>
        {jwt}
      </div>
    </div>
  );
}
