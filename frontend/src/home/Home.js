import { getAccessToken } from "../shared/utils";
import UserInfo from "../user-info/UserInfo";
import "./Home.css";

export default function Home() {
  const parsedToken = getAccessToken();
  return (
    <div className="App">
      <h1>Aplicación Demo Open ID Connect</h1>
      {parsedToken && <UserInfo parsedToken={parsedToken} />}
      <h2>Elija un flujo de autenticación</h2>
      <ul>
        <li>
          <div class="flow">
            <h3>Authentication Code (con PKCE)</h3>
            <ol>
              <li>
                El <b>cliente</b> redirige al usuario a la página del{" "}
                <b>Identity Provider</b> para que introduzca sus credenciales
                sin que estas pasen por él.
              </li>
              <li>
                El <b>Identity Provider</b> verifica la identidad del usuario y
                lo redirige de vuelta al <b>cliente</b> junto con un{" "}
                <b>código de autenticación</b>
              </li>
              <li>
                El <b>cliente</b> hace una request al <b>Identity Provider</b>{" "}
                para intercambiar el <b>código de autenticación</b> por el{" "}
                <b>JWT</b>
              </li>
            </ol>
            <a href="/auth/code">Elegir</a>
          </div>
        </li>
        <li>
          <div class="flow">
            <h3>Implicit Flow</h3>
            <span>
              <ol>
                <li>
                  El <b>cliente</b> redirige al usuario a la página del{" "}
                  <b>Identity Provider</b> para que introduzca sus credenciales
                  sin que estas pasen por él.
                </li>
                <li>
                  El <b>Identity Provider</b> verifica la identidad del usuario
                  y lo redirige de vuelta al <b>cliente</b> junto con el JWT.
                </li>
              </ol>
            </span>
            <a href="/auth/implicit">Elegir</a>
          </div>
        </li>
      </ul>
    </div>
  );
}
