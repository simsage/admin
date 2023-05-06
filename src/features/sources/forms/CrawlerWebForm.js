import React, {useEffect, useState} from "react";

export default function CrawlerWebForm(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    // const self = this;
    // const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error, setError] = useState()


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }


    // start the OIDC set up process
    function setup_oidc_request() {
        if (!props.form_data && !props.form_data.specificJson)
            return
        if (this.state.OIDCClientID === "" || this.state.OIDCSecret === "") {
            if (this.props.onError)
                this.props.onError("OIDC Request", "please provide values for the OIDC Client ID and OIDC Secret fields.");
        // } else if (this.props.setUpOIDCRequest) {
        //     this.props.setUpOIDCRequest(this.state.OIDCClientID, this.state.OIDCSecret);
        }
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerFileForm.js: Something went wrong.</h1>;
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
                            placeholder="csv words, exclude articles by words [optional]"
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
                <div className="form-group">
                    <div>
                        <a href="../resources/simsage-oidc-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage OIDC setup guide">
                            <img src="../images/pdf-icon.png" alt="OIDC setup guide" className="image-size" />
                        </a>
                    </div>
                </div>
                <div className="form-group col-6">
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
                <div className="form-group col-6">
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
                <div className="form-group col-6">
                    <button className="inactiveText btn-sm btn-primary" onClick={() => setup_oidc_request()}>
                        set up OIDC
                    </button>
                </div>
            </div>

            <div className="row mb-3 pt-5 border-top">
                <div className="form-group">
                    <div>
                        <a href="../resources/simsage-google-drive-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage Google drive setup guide">
                            <img src="../images/pdf-icon.png" alt="Google drive setup guide" className="image-size" />
                        </a>
                    </div>
                </div>
                <div className="form-group col-6">
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
                <div className="form-group col-6">
                    <label className="small">Google drive json key</label>
                    <textarea className="form-control"
                              placeholder="the Google drive json key identifying the service account to use to access and impersonate user-drive data.  Leave empty if you've already set this value previously and don't want to change it."
                              rows="3"
                              value={specific_json.googleJsonKeyFile}
                              onChange={(event) => {setData({googleJsonKeyFile: event.target.value})}}
                    />
                </div>
            </div>

        </div>
    )
}