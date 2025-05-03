import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Jwt.css";

const parseSession = (session) => {
  const jwtRegex = /.*access_token=(.*)&token_type.*/;
  const [_match, jwt] = jwtRegex.exec(session);
  return jwt;
};

export default function Redirect() {
  const jwt = parseSession(window.location.hash.substring(1));
  return (
    <div style={{ padding: "2em" }}>
      <h1>Atenticación exitosa</h1>
      <div>
        El usuario fue autenticado exitosamente. El JWT está embebido en la URL
        y contiene esta información:
      </div>
      <JsonView value={jwtDecode(jwt)} />
      <div>
        El backend no recibió este código y vive únicamente en el navegador
      </div>
      <div className="jwt">
        <h2>JWT Serializado:</h2>
        {jwt}
      </div>
    </div>
  );
}
