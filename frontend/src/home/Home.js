import { getParsedAccessToken } from "../shared/utils";
import UserInfo from "../user-info/UserInfo";
import "./Home.css";

export default function Home() {
  const parsedToken = getParsedAccessToken();
  return (
    <div className="App">
      <h1>Aplicación Demo Open ID Connect</h1>
      {parsedToken && <UserInfo parsedToken={parsedToken} />}
      <h2>Elija un flujo de autenticación</h2>
      <ul>
        <li>
          <div class="flow">
            <h3>Authentication Code (Estándar)</h3>
            <span>
              Redirige al usuario a la página del Identity Provider para que
              introduzca sus credenciales sin que el cliente (esta aplicación)
              las vea. Una vez verificada su identidad, será redirigido a la uri
              configurada por el cliente, proporcionándole el JWT al mismo.
            </span>
            <a href="/auth/code">Elegir</a>
          </div>
        </li>
        <li>
          <div class="flow">
            <h3>Implicit Flow</h3>
            <span>
              Redirige al usuario a la página del Identity Provider para que
              introduzca sus credenciales sin que el cliente (esta aplicación)
              las vea. Una vez verificada su identidad, será redirigido a la uri
              configurada por el cliente. A diferencia del flujo Authentication
              Code, el JWT permanece en el navegador del usuario
            </span>
            <a href="/auth/implicit">Elegir</a>
          </div>
        </li>
      </ul>
    </div>
  );
}
