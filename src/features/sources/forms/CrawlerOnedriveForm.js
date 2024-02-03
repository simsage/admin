import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";

export default function CrawlerOnedriveForm(props) {

    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    // const self = this;
    // const theme = props.theme;
    const l_form_data = props.form_data;

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
                                       onChange={(event) => {
                                           setData({tenantId: event.target.value})
                                       }}
                                />
                            </form>
                        </div>
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <form>
                                <input type="text" className="form-control"
                                       placeholder=""
                                       autoFocus={true}
                                       value={specific_json.clientId}
                                       onChange={(event) => {
                                           setData({clientId: event.target.value})
                                       }}
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
                    <div className="row mb-4 border-top pt-4">
                        <div className="form-group col-12">
                            <label className="small required">Redirect URL</label>
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="Redirect url: the SimSage interface url to return-to after MS sign-in completes."
                                       autoFocus={true}
                                       value={specific_json.redirectUrl}
                                       onChange={(event) => {
                                           setData({redirectUrl: event.target.value})
                                       }}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="col-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"
                                       checked={specific_json.crawlAllOfOneDrive}
                                       onChange={(event) => {
                                           setData({crawlAllOfOneDrive: event.target.checked});
                                       }}
                                       title="Crawl all of Exchange"/>
                                <label className="form-check-label small" for="enableOperator">Crawl all of One
                                    Drive</label>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    or Crawl specific One Drive accounts
                                    <span
                                        className="fst-italic fw-light small">(separate email addresses by comma)</span>
                                </label>
                                <textarea className="form-control"
                                          placeholder="Specific One Drive accounts"
                                          disabled={specific_json.crawlAllOfOneDrive}
                                          rows={3}
                                          value={specific_json.oneDriveUsersToCrawl}
                                          onChange={(event) => {
                                              setData({oneDriveUsersToCrawl: event.target.value})
                                          }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-onedrive-setup.pdf" id="dlOffice365" target="_blank"
                       title="Download the SimSage One Drive setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>One Drive <br/>Setup Guide
                    </a>
                </div>
            </div>

        </div>
    )
};