import "./Home.css";

export default function Home() {
  return (
    <div className="App">
      <h1>Aplicación Demo Open ID Connect</h1>
      <ul>
        <h2>Elija un flujo de autenticación</h2>
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
        <li>
          <div class="flow">
            <h3>Direct Grant</h3>
            <span>
              El cliente ya conoce las credenciales del usuario y las envía
              directamente al Identity Provider, a lo que este responde con el
              JWT
            </span>
            <a href="/auth/direct">Elegir</a>
          </div>
        </li>
      </ul>
    </div>
  );
}
