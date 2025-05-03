import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Shared.css";
import { saveAccessToken } from "../shared/utils";

export default function Redirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const jwt = searchParams.get("access_token");
  saveAccessToken(jwt);
  return (
    <main>
      <h1>Atenticación exitosa</h1>
      <h2>Explicación</h2>
      <div>
        El usuario fue autenticado exitosamente. La respuesta del Identity
        Provider pasó primero por el backend como puede verse en la terminal
        donde está corriendo el mismo. <br />
        Subsiguientemente el backend lo redirigió a esta página con el
        'access_token' como un search param, y contiene la siguiente
        información:
        <JsonView value={jwtDecode(jwt)} />
      </div>

      <h2>JWT Serializado:</h2>
      <div className="jwt">{jwt}</div>
    </main>
  );
}
