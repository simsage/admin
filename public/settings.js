
window.ENV = {
    // SimSage platform version (used for display only in UI)
    version: '7.7.5',
    // api version of api_base
    api_version: 1,
    // use password sign-in or single-sign-on? (value: "password" or "single-sign-on")
    authentication: "single-sign-on",
    // the local storage key name
    local_storage_key: "https://admin.simsage.ai/state",
    // is this a production build or not?
    debug: true,
    // dark or light theme?
    theme: 'light',
    // security groups to add to new sources (provided they exist)
    new_source_security_groups: [{"acl": "Users", "access": "R", isUser: false}],
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'http://localhost:8080/api',
    // web sockets platform endpoint for comms
    ws_base: 'http://localhost:8080/ws-api',
    // date picker display format
    date_format: 'yyyy/MM',
    // msal/jwt clientId and authority
    client_id: "a7c09973-7853-48f6-a067-5a14a5e7b210",
    full_authority: "https://simsageapi.b2clogin.com/simsageapi.onmicrosoft.com/B2C_1_simsage",
    known_authority: "https://simsageapi.b2clogin.com",
    // how long a session is "fresh" for in ms
    session_expiry_time: 3600000
};
