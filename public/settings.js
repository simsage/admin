
window.ENV = {
    // SimSage platform version (used for display only in UI)
    version: '8.4',
    // api version of api_base
    api_version: 1,
    // run from this location, starting with a / (or empty)
    base_name: "",
    // is this a production build or not?
    debug: true,
    // dark or light theme default?
    theme: 'dark',
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'http://localhost:8080/api',
    // date picker display format
    date_format: 'yyyy/MM',
    show_ai_training: false,
    // cookie storage length
    session_length_in_minutes: 60,
    // use our /auth0/ app for sp and one-drive and keycloak set up in crawlers
    use_azure_app: false,
    // if available, the preferred kb_id
    preferred_kb_id: "46ff0c75-7938-492c-ab50-442496f5de51",
    // keycloak real, client_id and server
    kc_realm: "simsage-test",
    kc_client_id: "simsage-test-client",
    kc_endpoint: "https://security3.simsage.ai",
};
