import React, {useEffect, useState} from "react";
import {setupOIDCRequest} from "../sourceSlice";
import {useDispatch, useSelector} from "react-redux";

export default function CrawlerWebForm(props) {

    const dispatch = useDispatch();

    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    // const self = this;
    // const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error, setError] = useState()


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }


    // start the OIDC set up process
    function setup_oidc_request(e) {
        e.preventDefault();
        if (!props.form_data && !props.form_data.specificJson)
            return
        if (specific_json.OIDCClientID === "" || specific_json.OIDCSecret === "") {
            console.error("OIDC Request", "please provide values for the OIDC Client ID and OIDC Secret fields.");
        } else {
            dispatch(
                setupOIDCRequest({
                    session_id: session_id,
                    organisation_id: organisation_id,
                    kb_id: kb_id,
                    OIDCClientID: specific_json.OIDCClientID,
                    OIDCSecret: specific_json.OIDCSecret
                })
            );
        }
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerWebForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-3">
                <div className="form-group col-6">
                    
                    <label className="small">http/s base url</label>
                        <input type="text"
                                placeholder="(e.g. https://simsage.ai)"
                                autoFocus={true}
                                className="form-control"
                                value={specific_json.baseUrlList}
                                onChange={(event) => {
                                    setData({baseUrlList: event.target.value})
                                }}
                        />
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-3">
                    <label className="small">Valid extensions</label>
                    <input type="text" className="form-control"
                            value={specific_json.validExtensions}
                            onChange={(event) => {
                                setData({validExtensions: event.target.value})
                            }}
                    />
                </div>
                
                <div className="form-group col-3">
                    <label className="small">Ignore extensions</label>
                    <input type="text" className="form-control"
                            value={specific_json.validExtensionsIgnore}
                            onChange={(event) => {
                                setData({validExtensionsIgnore: event.target.value})
                            }}
                    />
                </div>

                <div className="form-group col-3">
                    <label className="small d-flex justify-content-between">
                        User-agent
                        <span className="fst-italic fw-light small">(leave blank for default)</span>
                    </label>
                    <input type="text" className="form-control"
                           placeholder="web-crawler's user-agent"
                           title="(optional) web-crawler's user-agent"
                           value={specific_json.userAgent}
                           onChange={(event) => {
                               setData({userAgent: event.target.value})
                           }}
                    />
                </div>
            </div>

            <div className="row mb-5">
                <div className="form-group col-3">
                    <label className="small">Username</label>
                    <input type="text" className="form-control"
                            value={specific_json.basicUsername}
                            placeholder="optional basic auth username"
                            title="(optional) basic auth username"
                            onChange={(event) => {
                                setData({basicUsername: event.target.value})
                            }}
                    />
                </div>
                <div className="form-group col-3">
                    <label className="small d-flex justify-content-between">
                        Password
                        <span className="fst-italic fw-light small">(leave blank to keep previous)</span>
                    </label>
                    <input type="password" className="form-control"
                        placeholder="basic auth password"
                        title="(optional) basic auth password (leave blank to keep previous)"
                        value={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                    />
                </div>
            </div>
                
            <div className="row mb-3 pt-5 border-top">
                <div className="form-group col-6">
                    <label className="small">Include css csv</label>
                    <textarea className="form-control"
                            placeholder="css/html root fragments to include csv"
                            rows="3"
                            value={specific_json.webCss}
                            onChange={(event) => {
                                setData({webCss: event.target.value})
                            }}
                    />
                </div>

                <div className="form-group col-6">
                    <label className="small">Exclude css csv</label>
                    <textarea className="form-control"
                            placeholder="css/html root fragments to exclude csv"
                            rows="3"
                            value={specific_json.webCssIgnore?specific_json.webCssIgnore:'header, footer'}
                            onChange={(event) => {
                                setData({webCssIgnore: event.target.value})
                            }}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-6">
                    <label className="small">csv include words</label>
                    <textarea className="form-control"
                            placeholder="csv words, include articles by words [optional]"
                            rows="3"
                            value={specific_json.articleIncludeWordsCsv}
                            onChange={(event) => {
                                setData({articleIncludeWordsCsv: event.target.value})
                            }}
                    />
                </div>

                <div className="form-group col-6">
                    <label className="small">csv exclude words</label>
                    <textarea className="form-control"
                            placeholder="csv words, exclude articles by words [optional]"
                            rows="3"
                            value={specific_json.articleExcludeWordsCsv}
                            onChange={(event) => {
                                setData({articleExcludeWordsCsv: event.target.value})
                            }}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-6">
                    <label className="small">csv allowed domains</label>
                    <textarea className="form-control"
                            placeholder="csv prefix list of other domains to crawl (e.g. https://drive.google.com) [optional]"
                            rows="3"
                            value={specific_json.validDomainCSV}
                            onChange={(event) => {setData({validDomainCSV: event.target.value})}}
                    />
                </div>

                <div className="form-group col-6">
                    <label className="small">csv exclude prefixes</label>
                    <textarea className="form-control"
                            placeholder="csv urls (starting with https://), exclude pages by prefix starts [optional]"
                            rows="3"
                            value={specific_json.pagePrefixesToIgnore}
                            onChange={(event) => {setData({pagePrefixesToIgnore: event.target.value})}}
                    />
                </div>
            </div>

            <div className="row mb-3 pt-5 border-top">

                <div className="row mb-4">
                    <div className="col-9">
                        <div className="form-group col-12">
                            <label className="small">OIDC client id</label>
                            <input type="text"
                                   placeholder="OIDC client id"
                                   className="form-control"
                                   value={specific_json.OIDCClientID}
                                   onChange={(event) => {
                                       setData({OIDCClientID: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-12">
                            <label className="small">OIDC secret</label>
                            <input type="text"
                                   placeholder="OIDC secret"
                                   className="form-control"
                                   value={specific_json.OIDCSecret}
                                   onChange={(event) => {
                                       setData({OIDCSecret: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
                    <div className="col-2 offset-1">
                        <div className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="25" width="25" xmlns="http://www.w3.org/2000/svg"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"></path><path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"></path></svg>
                            <a href="../resources/simsage-oidc-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage OIDC setup guide">
                                <img src="../images/pdf-icon.png" alt="OIDC setup guide" className="image-size" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="form-group col-6">
                    <button className="inactiveText btn btn-white btn-primary px-4" onClick={(e) => setup_oidc_request(e)}>
                        set up OIDC
                    </button>
                </div>
            </div>

            <div className="row mb-3 pt-5 border-top">

                <div className="row mb-4">
                    <div className="col-9">
                        <div className="form-group col-12">
                            <label className="small">impersonation user</label>
                            <input type="text"
                                   placeholder="the user to impersonate for Google drive (e.g. john@abc.com)"
                                   className="form-control"
                                   value={specific_json.googleImpersonationUser}
                                   onChange={(event) => {
                                       setData({googleImpersonationUser: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-12">
                            <label className="small">Google drive json key</label>
                            <textarea className="form-control"
                                      placeholder="the Google drive json key identifying the service account to use to access and impersonate user-drive data.  Leave empty if you've already set this value previously and don't want to change it."
                                      rows="3"
                                      value={specific_json.googleJsonKeyFile}
                                      onChange={(event) => {setData({googleJsonKeyFile: event.target.value})}}
                            />
                        </div>
                    </div>
                    <div className="col-2 offset-1">
                        <div className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="25" width="25" xmlns="http://www.w3.org/2000/svg"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"></path><path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"></path></svg>
                            <a href="../resources/simsage-google-drive-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage Google drive setup guide">
                                <img src="../images/pdf-icon.png" alt="Google drive setup guide" className="image-size" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}