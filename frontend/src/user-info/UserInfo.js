import { saveAccessToken } from "../shared/utils";
import "./UserInfo.css";

export default function UserInfo({ parsedToken }) {
  return (
    <div className="user-info">
      <h2>Usuario autenticado</h2>
      <div>
        <b>Usuario:</b> {parsedToken.username}
      </div>
      <div>
        <b>Válido hasta:</b> {parsedToken.expires_at}
      </div>
      <div>
        <b>Roles:</b>
        <ul>
          {parsedToken.roles?.map((role) => (
            <li>{role}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => {
          saveAccessToken("");
          window.location.reload();
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
