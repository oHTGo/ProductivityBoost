# ProductivityBooster

## Auth feature

### Default credential

We use 2 OAuth2.0 credentials for auth

- CONSENT_CLIENT:

* Type: Web application
* Use the client to approve/reject Google consent form

- REFRESH_CLIENT:

* Type: Chrome Extension
* Use in manifest
* Use the client to request new access token

### Custom credential

You need to create a OAuth2.0 credential:

- Type: Web application
- Use own credential if you don't want to use the default credential
