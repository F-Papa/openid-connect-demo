# OpenId Connect Demo

## Instructions

### Starting an instance of Keycloak

> docker run -d -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=your-password -e KC_PROXY=edge --restart always -v /your/projet/path:/opt/jboss/keycloak/standalone/data quay.io/keycloak/keycloak:23.0.6 start-dev

### Configuring the Keycloak Realm

1. Log into the Keycloak admin panel (http://localhost:8080/admin, user: admin, password: password)
2. Click on `master` (top left) and select Create a Realm from the drop-down menu
   1. Enter the following name for the new Realm: `criptografia-y-seguridad-informatica`
   2. Click Save

### Configuring the Keycloak Client

1. From Keycloak admin panel, enter the new realm
2. Click on `Clients` and `Create Client`
3. Enter the following `Client ID` and click next: `aplicacion-demo`
4. Enable the following settings and click next:

   1. Client Authentication
   2. Standard Flow
   3. Implicit Flow
   4. OIDC CIBA Grant
   5. Service accounts roles

5. For `Valid redirect URIs` enter:

   - `{{URL_FOR_THIS_APP}}/auth/redirect/*` (e.g. `http://localhost:4000/auth/redirect/*`)

6. For `Web Origins`:

   - `*`

7. Click save
8. From `Clients` go to the new client
9. Go to the `Credentials` tab
10. Copy the `Client Secret` and paste it in the `.env` file next to `CLIENT_SECRET=`

### Configuring the Keycloak User

1. Click on `Users` and `Add User`
2. Enter the following `username` you want and click on `create` (e.g. cripto-user)
3. Go to the `Credentials` tab and click on `Set Password` (e.g. 1234)
4. Enter any password you like and leave `Temporary`unchecked.

### Starting the Application

> docker compose --build

## Extra Docs

Once the app is running, access the following endpoints to follow the corresponding OIDC flow:

### Standard Flow

- GET /auth/code

This will redirect you to keycloak, where you will be prompted to enter your username and password (if you haven't already). Subsequently, you will be redirected to /auth/redirect/code where the app will exchange the authentication code for an access token, which will be displayed on screen.

#### PKCE

To enable PCKE:

1.  Go to your client settings in Keycloak admin panel
2.  Go to the advanced tab
3.  Set `Proof Key for Code Exchange Code Challenge Method` to S256
4.  Set PKCE to `1` in the `.env` file

### Implicit Flow

- GET /auth/implicit

This will redirect you to keycloak, where you will be prompted to enter your username and password (if you haven't already). Subsequently, you will be redirected to /auth/redirect/implicit where a javascript alert will display the token received. This is because for this flow, the token is kept in the browser and the client cannot access it directly.

### Direct Grant Flow

- GET /auth/direct

This will get an access token directly from keycloak without any redirect (username and password in the .env file are used) and it will be displayed on the screen.

### Client Credentials Flow

- GET /auth/client

This flow is for authenticating the client rather than the user and it will get an access token directly from keycloak without any redirect using the client_id and client_secret in the .env file. Once retrieved, the token will be displayed on the screen.

### Refresh Token Flow

- GET /auth/refresh?refresh_token={{REFRESH_TOKEN}}

This flow is for refreshing the access token previously with the refresh token included in the original response. It needs to be added to the query parameter as shown above
