import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'

export default function CrawlerIManageForm(props) {


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

    function resetCursor(e) {
        e.preventDefault();
        setData({cursor: '0'});
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
                            <label label className="small">Server</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="Server FQDN (e.g. imanage.simsage.ai)"
                                    autoFocus={true}
                                    value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label label className="small">Admin username</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                                />
                            </form>
                        </div>
                        <div className="form-group col-6">
                            <label label className="small">Admin password</label>
                            <form>
                                <input type="password" className="form-control"
                                    placeholder="********"
                                    autoFocus={true}
                                    value={specific_json.password}
                                       onChange={(event) => {setData({password: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
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
                                    placeholder="aka. API secret"
                                    autoFocus={true}
                                    value={specific_json.clientSecret}
                                       onChange={(event) => {setData({clientSecret: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label label className="small">Library ID</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="e.g. Active"
                                    autoFocus={true}
                                    value={specific_json.libraryId}
                                       onChange={(event) => {setData({libraryId: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row border-top pt-4 mb-4">
                        <div className="form-group col-6">
                            <label className="small">Event-cursor index to check from</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.cursor}
                                               onChange={(event) => {setData({cursor: event.target.value})}}
                                />
                                <div className="btn bt-sm btn-primary ms-2" onClick={(e) => resetCursor(e)}>Now</div>
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
                    <a href="resources/imanage-setup.pdf" id="dlIManage" target="_blank"
                    title="Download the SimSage iManage setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>iManage <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    )
}