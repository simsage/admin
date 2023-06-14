import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import Api from "../../../common/api";

export default function CrawlerGDriveForm(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;
    const [time_now, setTimeNow] = useState(specific_json.deltaIndicator?specific_json.deltaIndicator:0)

    const time2020 = 1577836800;
    let date_time_str = "complete crawl";

    if (time_now > time2020){
        date_time_str = Api.toPrettyDateTime(new Date(time_now * 1));
    }



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


    function handleSetTimeNow() {
        const temp_time_now = Math.floor(Date.now())
        setTimeNow(temp_time_now)
        setData({deltaIndicator:temp_time_now});
    }

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small">
                            JSON key contents
                            </label>
                            <textarea className="form-control"
                                disabled={specific_json.crawlAllSites}
                                placeholder="The Google JSON key identifying the service account to use to access and impersonate user-drive data.Leave empty if you've already set this value previously and don't want to change it."
                                rows={5}
                                value={specific_json.json_key_file}
                                          onChange={(event) => {setData({json_key_file: event.target.value})}}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small d-flex justify-content-between">
                                User list
                                <span className="fst-italic fw-light small">(separate email addresses of the users Drives to crawl by comma).
                                <span className="text-danger ms-1">Required</span></span>
                            </label>
                            <textarea className="form-control"
                                placeholder=""
                                rows={3}
                                value={specific_json.drive_user_csv}
                                          onChange={(event) => {setData({drive_user_csv: event.target.value})}}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small">Drive ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="Optional"
                                    autoFocus={true}
                                    value={specific_json.drive_id}
                                       onChange={(event) => {setData({drive_id: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-6">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"     
                                    checked={specific_json.sites_only}
                                    onChange={(event) => { setData({sites_only: event.target.checked}); }}
                                    value="Crawl only Google site data from these Drives"/>
                                <label className="form-check-label small" for="enableOperator">Crawl only Google site data from these Drives</label>
                            </div>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="form-group col-6">
                            <label className="small">Time to check from</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control"
                                    placeholder="Optional"
                                    autoFocus={true}
                                    value={time_now}
                                               onChange={(event) => {setData({deltaIndicator: event.target.value})}}
                                />
                                <div className="btn bt-sm btn-primary ms-2" onClick={() => handleSetTimeNow()}>Now</div>
                                <span className="small text-nowrap ms-3 text-capitalize">{date_time_str}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-google-drive-setup.pdf" id="dlGDrive" target="_blank"
                    title="Download the SimSage Google Drive setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>Google Drive <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    );

}