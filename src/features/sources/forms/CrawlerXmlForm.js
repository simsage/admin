import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import { DOCUMENTATION, useSelectedSource } from './common.js';

export default function CrawlerXmlForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

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

                    <label className="small required">http/s or file:// base url csv list</label>
                    <input type="text"
                           placeholder="(e.g. https://simsage.ai/folder/test.xml)"
                           title="XML crawler start url csv list"
                           autoFocus={true}
                           className="form-control"
                           value={specific_json.seedList}
                           onChange={(event) => {
                               setData({seedList: event.target.value})
                           }}
                    />
                </div>
                <div className="col-2 offset-4">
                    <a href={DOCUMENTATION.XML} id="dlGDrive" target="_blank"
                       title="Download the SimSage xml crawler setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Xml Crawler <br/>Setup Guide
                    </a>
                </div>
            </div>

            <div className="row mb-3">
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
                        <div className="small required">xml text content (Source-metadata-name mapper)</div>
                        <div>
                            <textarea
                                style={{width: "100%"}}
                                onChange={(event) => setData({xmlContent: event.target.value})}
                                placeholder="xml text body, please put metadata field names in square brackets (e.g. [document-type])"
                                title="xml text body, please put metadata field names in square brackets (e.g. [document-type])"
                                spellCheck={false}
                                rows={10}
                                value={specific_json.xmlContent}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
