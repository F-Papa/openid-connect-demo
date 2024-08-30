# Keycloak Authenticator

### How to Run
```bash
npm start
```

## Requirements
- A Running instance of Keycloak

## Setup
### App
1. Save your app's URL in the `.env` file
2. Save the URL where keycloak will be running in the `.env` file
3. Save the PORT where the app will be running in the `.env` file

### Keycloak

#### Realm Setup
1. Log into Keycloak admin panel
2. Create a Realm
3. Enter a name for the new Realm
    1. Paste your new realm's name into the `.env` file next to `REALM=`
4. Click Save

#### Client Setup
1. From Keycloak admin panel, enter the new realm
2. Click on `Clients` and `Create Client`
3. Enter any `Client ID` you want and click next.
    1. Paste your new client id into the `.env` file next to `CLIENT_ID=`
4. Enable the following settings and click next: 
    1. Client Authentication 
    2. Standard Flow 
    3. Implicit Flow 
    4. Direct Access Grants
    5. Service accounts roles

5. For `Valid redirect URIs` enter ():
    - `{{URL_FOR_THIS_APP}}/auth/redirect/*`

6. For valid origins:
    - `*`

7. Click save
8. From `Clients` go to the new client
9. Go to the `Credentials` tab
10. Copy the `Client Secret` and paste it in the `.env` file next to  `CLIENT_SECRET=` 
1
#### User Setup

1. Click on `Users` and `Add User` 
2. Enter any `username` you want and click on `create`
3. Go to the `Credentials` tab and click on `Set Password`
4. Enter any password you like and leave `Temporary`unchecked.
5. Paste your new username and password into the `.env` file.

## Docs

Once the app is running, access the following endpoints to follow the corresponding OIDC flow:

### Standard Flow

- /auth/code

This will redirect you to keycloak, where you will be prompted to enter your username and password (if you haven't already). Subsequently, you will be redirected to /auth/redirect/code where the app will exchange the authentication code for an access token, which will be displayed on screen.  

#### PKCE

To enable PCKE:
 1. Go to your client settings in Keycloak admin panel
 2. Go to the advanced tab
 3. Set `Proof Key for Code Exchange Code Challenge Method` to S256
 4. Set PKCE to `1` in the `.env` file

### Implicit Flow

- /auth/implicit

This will redirect you to keycloak, where you will be prompted to enter your username and password (if you haven't already). Subsequently, you will be redirected to /auth/redirect/implicit where a javascript alert will display the token received. This is because for this flow, the token is kept in the browser and the client cannot access it directly.

### Direct Grant Flow

- /auth/direct

This will get an access token directly from keycloak without any redirect (username and password in the .env file are used) and it will be displayed on the screen. 

### Client Credentials Flow

- /auth/client

This flow is for authenticating the client rather than the user and it will get an access token directly from keycloak without any redirect using the client_id and client_secret in the .env file. Once retrieved, the token will be displayed on the screen. 

