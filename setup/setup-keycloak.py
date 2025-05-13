from keycloak import KeycloakAdmin
import random

RANDOM_INT = '' #random.randint(0, 100)

REALM_NAME = "criptografia-y-seguridad-informatica" + str(RANDOM_INT)
CLIENT_ID = "aplicacion-demo" + str(RANDOM_INT)

admin = KeycloakAdmin(
    server_url="http://localhost:8080",
    username="admin",
    password="password",
    realm_name="master",
    client_id="admin-cli",
    verify=True,
)

new_realm_payload = {
    "realm": REALM_NAME,
    "enabled": True,
    "displayName": "Criptografia y Seguridad Informatica",
}

admin.create_realm(new_realm_payload)

admin.change_current_realm(REALM_NAME)

new_client_payload = {
    "clientId": CLIENT_ID,
    "redirectUris": ["http://localhost:4000/*", "http://localhost:3000/*"],
    "webOrigins": ["*"],
    "standardFlowEnabled": True,
    "implicitFlowEnabled": True,
    "serviceAccountsEnabled": True,
    "enabled": True,
}

client_id = admin.create_client(new_client_payload)
client_data = admin.get_client(client_id)

client_secret = client_data["secret"]
assert type(client_secret) is str

print(f"Inserte el siguiente valor de CLIENT_SECRET en backend/.env: {client_secret}")

user_payload = {
    "username": "cripto-user",
    "enabled": True,
    "credentials": [{"type": "password", "value": "1234", "temporary": False}],
}

user_id = admin.create_user(user_payload)
assert type(user_id) is str
