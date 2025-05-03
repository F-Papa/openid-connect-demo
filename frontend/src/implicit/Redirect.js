import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Shared.css";

const parseSession = (session) => {
  const jwtRegex = /.*access_token=(.*)&token_type.*/;
  const [_match, jwt] = jwtRegex.exec(session);
  return jwt;
};

export default function Redirect() {
  const jwt = parseSession(window.location.hash.substring(1));
  return (
    <main>
      <h1>Atenticación exitosa</h1>
      <h2>Explicación</h2>
      <div>
        El usuario fue autenticado exitosamente. El Identity provider lo
        redirigió directamente a esta página <b>sin pasar por el backend</b>.
        Junto con la redirección, embebió el JWT está en la URL por lo que el el
        access_token vive únicamente en el navegador. El mismo contiene estos
        datos:
      </div>
      <JsonView value={jwtDecode(jwt)} />
      <h2>JWT Serializado:</h2>
      <div className="jwt">{jwt}</div>
    </main>
  );
}
