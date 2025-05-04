import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Shared.css";
import { saveAccessToken } from "../shared/utils";

const parseSession = (session) => {
  const jwtRegex = /.*access_token=(.*)&token_type.*/;
  const [_match, jwt] = jwtRegex.exec(session);
  return jwt;
};

export default function Redirect() {
  const jwt = parseSession(window.location.hash.substring(1));
  saveAccessToken(jwt);
  return (
    <main>
      <h1>Atenticación exitosa (Implicit Flow)</h1>
      <h2>Explicación</h2>
      <div>
        El usuario fue autenticado exitosamente. El Identity provider lo
        redirigió directamente a esta página con el siguiente access_token
        embebido en la URI como search param:
      </div>
      <div className="code">
        <h4>access_token:</h4>
        {jwt}
      </div>
      <h2>JWT Decodificado:</h2>
      <div>
        A continuación pueden verse los datos incluidos en el JWT decodificado
      </div>
      <JsonView className="json-view" value={jwtDecode(jwt)} />
    </main>
  );
}
