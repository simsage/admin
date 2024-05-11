import React, {useEffect, useState} from "react";
import {BsFilePdf} from "react-icons/bs";
import {DOCUMENTATION, useSelectedSource} from "./common";

export default function CrawlerWebForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const [webCssIgnore, setWebCssIgnore] = useState(specific_json.webCssIgnore?specific_json.webCssIgnore:selected_source?'':'header, footer');

    function handleWebCssIgnore(data){
        setWebCssIgnore(data);
        setData({webCssIgnore:data})
    }



    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-3">
                <div className="form-group col-6">

                    <label className="small required">http/s or file:// base url (non-file paths must end with /)</label>
                    <input type="text"
                           placeholder="(e.g. https://simsage.ai)"
                           title="web site start url"
                           autoFocus={true}
                           className="form-control"
                           value={specific_json.baseUrlList}
                           onChange={(event) => {
                               setData({baseUrlList: event.target.value})
                           }}
                    />
                </div>
                <div className="col-2 offset-2">
                    <a href={DOCUMENTATION.WEB} id="dlGDrive" target="_blank"
                       title="Download the SimSage web crawler setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Web Crawler <br/>Setup Guide
                    </a>
                </div>
                <div className="col-2">
                    <a href={DOCUMENTATION.GOOGLE_DRIVE} id="dlGDrive" target="_blank"
                       title="Download the SimSage Google Drive setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Google Drive <br/>Setup Guide
                    </a>
                </div>
            </div>

            <div className="row mb-3 pt-3 border-top">
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="check for pre-rendering Javascript based websites into HTML">
                        <input className="form-check-input" type="checkbox"
                               checked={specific_json.renderJS === true}
                               onChange={(event) => {
                                   setData({renderJS: event.target.checked});
                               }}
                        />
                        <label className="form-check-label small">pre-render Javascript websites</label>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-3">
                    <label className="small">Valid extensions (html is always valid)</label>
                    <input type="text" className="form-control"
                           value={specific_json.validExtensions}
                           onChange={(event) => {
                               setData({validExtensions: event.target.value})
                           }}
                    />
                </div>

                <div className="form-group col-3">
                    <label className="small">Ignore extensions (html cannot be ignored)</label>
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
                              placeholder="css/html root fragments to exclude csv (e.g. header, footer, div.class-name)"
                              rows="3"
                              value={webCssIgnore}
                              onChange={(event) => {
                                  handleWebCssIgnore(event.target.value)
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
                    <label className="small">exclude paths (csv list)</label>
                    <textarea className="form-control"
                              placeholder="a set of possible paths values, separated by commas (csv) to exclude pages (e.g. /images/) [optional]"
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
                            <label className="small">openid-configuration endpoint</label>
                            <input type="text"
                                   placeholder="openid-configuration endpoint (e.g. https://login.microsoftonline.com/<tenant-id>/.well-known/openid-configuration)"
                                   className="form-control"
                                   value={specific_json.OIDCEndpoint}
                                   onChange={(event) => {
                                       setData({OIDCEndpoint: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-12">
                            <label className="small">OIDC/OAuth client id</label>
                            <input type="text"
                                   placeholder="OIDC/OAuth client id"
                                   className="form-control"
                                   value={specific_json.OIDCClientID}
                                   onChange={(event) => {
                                       setData({OIDCClientID: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-12">
                            <label className="small">OIDC/OAuth secret</label>
                            <input type="password"
                                   placeholder="OIDC/OAuth secret"
                                   className="form-control"
                                   value={specific_json.OIDCSecret}
                                   onChange={(event) => {
                                       setData({OIDCSecret: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
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
                </div>

            </div>

        </div>
    )
}