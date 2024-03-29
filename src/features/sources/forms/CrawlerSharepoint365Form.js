import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";

export default function CrawlerSharepoint365Form(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const l_form_data = props.form_data;

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Tenant ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.tenantId}
                                    onChange={(event) => {setData({tenantId: event.target.value})}}
                                />
                            </form>
                        </div>
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    value={specific_json.clientId}
                                    onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {
                                    setData({clientSecret: event.target.value})
                                }}
                                name="Client Secret"
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="col-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"     
                                    checked={specific_json.crawlAllSites}
                                    onChange={(event) => { setData({crawlAllSites: event.target.checked}); }}
                                    title="Crawl all sites"/>
                                <label className="form-check-label small">Crawl all SharePoint sites</label>
                            </div>

                        </div>
                        <div className="col-8">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    filter SharePoint sites by partial-names (case insensitive)
                                    <span className="fst-italic fw-light small">(separate sharepoint site names by comma)</span>
                                </label>
                                <textarea className="form-control"
                                    disabled={specific_json.crawlAllSites}
                                    placeholder="Specific Sharepoint sites"
                                    rows={3}
                                    value={specific_json.sharePointSitesToCrawl}
                                    onChange={(event) => {setData({sharePointSitesToCrawl: event.target.value})}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-sharepoint365-setup.pdf" id="dlsharepoint" target="_blank"
                    title="Download the SimSage Sharepoint365 setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>Sharepoint 365 <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    )
}