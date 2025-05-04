import JsonView from "@uiw/react-json-view";
import { jwtDecode } from "jwt-decode";
import "../shared/Shared.css";
import { saveAccessToken } from "../shared/utils";

export default function Redirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const jwt = searchParams.get("access_token");
  const code = searchParams.get("code");
  const verifier = searchParams.get("verifier");
  const challenge = searchParams.get("challenge");
  saveAccessToken(jwt);
  return (
    <main>
      <div>
        <h1>Atenticación exitosa (Authentication Code con PKCE)</h1>
        <h2>Explicación</h2>
        <div>
          El backend creó un código llamado 'verifier' y redirigió al cliente al
          Identity Provider junto con un 'challenge' (un hash del verifier).
        </div>
        <div className="code">
          <h4>challenge:</h4>
          {challenge}
        </div>
        <div>
          El usuario introdujo sus credenciales y tras autenticarlo, el Identity
          Provider lo redirigió al backend con el siguiente
          'authentication_code'
          <br />
        </div>
        <div className="code">
          <h4>authentication_code:</h4>
          {code}
        </div>
        <div>
          Subsiguientemente el backend intercambió el código por el JWT mediante
          una solicitud al Identity Provider donde además del
          'authentication_code' envió el 'verifier' para probar que fue él quien
          generó la solicitud original.
        </div>
        <div className="code">
          <h4>verifier:</h4>
          {verifier}
        </div>
        <div>Finalmente obtuvo el siguiente 'access_token' como respuesta</div>
        <div className="code">
          <h4>access_token:</h4> {jwt}
        </div>
      </div>
      <div>
        <h2>JWT Decodificado:</h2>
        <div>
          A continuación pueden verse los datos incluidos en el JWT decodificado
        </div>
        <JsonView className="json-view" value={jwtDecode(jwt)} />
      </div>
    </main>
  );
}
