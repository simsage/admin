
window.ENV = {
    // SimSage platform version (used for display only in UI)
    version: '7.5.6',
    // api version of api_base
    api_version: 1,
    // is this a production build or not?
    debug: true,
    // dark or light theme?
    theme: 'light',
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'https://uat-cloud.simsage.ai/api',
    // web sockets platform endpoint for comms
    ws_base: 'https://uat-cloud.simsage.ai/ws-api',
    // the web-site to go to when SimSage logo is clicked on the login page
    web_base: 'https://simsage.ai/',
    // date picker display format
    date_format: 'yyyy/MM',
    // msal/jwt clientId and authority
    client_id: "1f65697f-7c2f-4faa-99c2-53253a4edd7a",
    authority: "https://login.microsoftonline.com/530fb855-94ec-4ff6-9801-60d86836c41f",
    // how long a session is "fresh" for in ms
    session_expiry_time: 3600000
};
