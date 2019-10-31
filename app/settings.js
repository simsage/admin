
const system_config = {
    // SimSage platform version (used for display only in UI)
    version: '5.1.3',
    // api version of api_base
    api_version: 1,
    // the service layer end-point, change "localhost:8080" to ...
    api_base: 'http://localhost:8080/api',
    // web sockets platform endpoint for comms
    ws_base: 'http://localhost:8080/ws-api',
    // the web-site to go to when SimSage logo is clicked on the login page
    web_base: 'https://simsage.nz/',
    // date picker display format
    date_format: 'yyyy/MM',
};

export default system_config;
