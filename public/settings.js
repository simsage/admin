
window.ENV = {
    // SimSage platform version (used for display only in UI)
    version: '7.17',
    // api version of api_base
    api_version: 1,
    // is this a production build or not?
    debug: true,
    // dark or light theme?
    theme: 'light',
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'http://localhost:8080/api',
    // date picker display format
    date_format: 'yyyy/MM',
    // cookie storage length
    session_length_in_minutes: 60,
    // if available, the preferred kb_id
    preferred_kb_id: "46ff0c75-7938-492c-ab50-442496f5de51",
    // keycloak real, client_id and server
    kc_realm: "simsage-test",
    kc_client_id: "simsage-test-client",
    kc_endpoint: "https://security.simsage.ai",
};
