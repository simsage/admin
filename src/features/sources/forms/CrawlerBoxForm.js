import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import Api from "../../../common/api";

export default function CrawlerBoxForm(props) {

    // 2020-01-01 00:00 GMT (without milliseconds)
    const time2020 = 1577836800;

    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error,setError] = useState()

    let date_time_str = "complete crawl";

    if (specific_json.timeToCheckFrom > time2020)
        date_time_str = Api.toPrettyDateTime(new Date(specific_json.timeToCheckFrom * 1000));


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }

    function setTimeToNow(e) {
        e.preventDefault()
        setData({timeToCheckFrom: Math.floor(Date.now() / 1000)});
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>crawler-dropbox.js: Something went wrong.</h1>;
    }

    return (

        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label label className="small">Client ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.clientId}
                                       onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                            </form>
                        </div>
                        <div className="form-group col-6">
                            <label label className="small">Client secret</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.clientSecret}
                                       onChange={(event) => {setData({clientSecret: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label label className="small">Enterprise ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.enterpriseId}
                                       onChange={(event) => {setData({enterpriseId: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row border-top pt-4 mb-4">
                        <div className="form-group col-6">
                            <label className="small">Time to check from</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.timeToCheckFrom}
                                               onChange={(event) => {setData({timeToCheckFrom: event.target.value})}}
                                />
                                <a className="btn bt-sm btn-primary ms-2" onClick={(e) => setTimeToNow(e)}>Now</a>
                                <span className="small text-nowrap ms-3 text-capitalize">{date_time_str}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="form-group col-8">
                            <label className="small d-flex justify-content-between">
                                Start folder
                                <span className="fst-italic fw-light small">(separate folders by comma)</span>
                            </label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="Leave empty to crawl all folders"
                                    autoFocus={true}
                                    value={specific_json.folderList}
                                   onChange={(event) => {setData({folderList: event.target.value})}}
                                />
                            </form>
                            <ul class="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li className="">Each folder must be part of the root folder and not contain any sub-folders.</li>
                                <li className="">
                                Each folder name must start with '/'.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="../resources/simsage-box-setup.pdf" id="dlBox" target="_blank"
                    title="Download the SimSage Bbox setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>Box <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    )
}