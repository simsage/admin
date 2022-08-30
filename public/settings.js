
window.ENV = {
    // SimSage platform version (used for display only in UI)
    version: '7.3.32',
    // api version of api_base
    api_version: 1,
    // is this a production build or not?
    debug: true,
    // dark or light theme?
    theme: 'light',
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'https://uat.simsage.ai/api', //'http://localhost:8080/api', //'https://uat-cloud.simsage.ai/api',
    // web sockets platform endpoint for comms
    ws_base: 'https://uat.simsage.ai/ws-api', //'http://localhost:8080/ws-api', //'https://uat-cloud.simsage.ai/ws-api',
    // the web-site to go to when SimSage logo is clicked on the login page
    web_base: 'https://simsage.ai/',
    // date picker display format
    date_format: 'yyyy/MM',
    // msal/jwt clientId and authority
    client_id: "a7c09973-7853-48f6-a067-5a14a5e7b210",
    authority: "https://simsageapi.b2clogin.com/simsageapi.onmicrosoft.com/B2C_1_simsage",

    //local_storage_key to save state
    local_storage_key:'http://localhost:4230/state',
};


//Access to XMLHttpRequest at 'http://uat-cloud.simsage.ai/api/auth/admin/authenticate/msal' from origin 'http://localhost:4230' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.