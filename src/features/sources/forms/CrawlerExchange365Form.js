import React, {useEffect} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from './common.js';


export default function CrawlerExchange365Form(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
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

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (

        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Tenant ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json.tenantId}
                                   onChange={(event) => {
                                       setData({tenantId: event.target.value})
                                   }}
                                   required
                            />
                        </div>
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   value={specific_json.clientId}
                                   onChange={(event) => {
                                       setData({clientId: event.target.value})
                                   }}
                                   required
                            />
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
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="col-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"
                                       checked={specific_json.crawlAllOfExchange}
                                       onChange={(event) => {
                                           setData({crawlAllOfExchange: event.target.checked});
                                       }}
                                       title="Crawl all of Exchange"/>
                                <label className="form-check-label small">Crawl all of Exchange</label>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    or Crawl specific Exchange accounts
                                    <span
                                        className="fst-italic fw-light small">(separate email addresses by comma)
                                    </span>
                                </label>
                                <textarea className="form-control"
                                          placeholder="Specific Exchange accounts"
                                          disabled={specific_json.crawlAllOfExchange}
                                          rows={3}
                                          value={specific_json.exchangeUsersToCrawl}
                                          onChange={(event) => {
                                              setData({exchangeUsersToCrawl: event.target.value})
                                          }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.EXCHANGE365} id="dlOffice365" target="_blank" rel="noreferrer"
                       title="Download the SimSage Exchange 365 setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Exchange 365 <br/>Setup Guide
                    </a>
                </div>
            </div>
        </div>
    )
}