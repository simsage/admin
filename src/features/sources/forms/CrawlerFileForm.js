import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {checkJcifsLibrary, installJcifsLibrary} from "../sourceSlice";

export default function CrawlerFileForm(props) {

    const selected_source = props.source;
    const dispatch = useDispatch();

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const {session, selected_organisation_id} = useSelector((state) => state.authReducer);
    const {has_jcifs, busy} = useSelector((state) => state.sourceReducer);
    const session_id = session.id;
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
        dispatch(checkJcifsLibrary({session_id: session_id, organisation_id: selected_organisation_id}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    function agreeLicense() {
        dispatch(installJcifsLibrary({session_id: session_id, organisation_id: selected_organisation_id}))
    }

    if (!has_jcifs) {
        return (
            <div className={"tab-content px-5 py-4 overflow-auto" + ((busy) ? " wait-cursor" : "")}>
                <div>&nbsp;</div>
                <div>The SimSage file-crawler requires the use of an open-source library called jcifs-ng.</div>
                <div>
                    Please click <a href="https://github.com/AgNO3/jcifs-ng/" rel="noreferrer"
                                    title="view jcifs-ng source-code" target="_blank">here</a> to view its source code.
                </div>
                <div>&nbsp;</div>
                <div>
                    In order to use this crawler you need to agree to the&nbsp;
                    <a href="https://raw.githubusercontent.com/AgNO3/jcifs-ng/master/LICENSE" rel="noreferrer"
                       title="view jcifs-ng license" target="_blank">jcifs-ng license agreement</a>.
                </div>
                <div>&nbsp;</div>
                <div>Please click the button below if you agree to this license and SimSage will automatically download this library for you.</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div>
                    <button onClick={agreeLicense} disabled={busy} type="button" className="btn btn-primary btn-block px-4"
                            title="I agree with the jcifs-ng license and wish to install it on SimSage"
                            data-bs-dismiss="modal">I Agree with the license and wish to install jcifs-ng
                    </button>
                </div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </div>
        )
    }

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Username</label>
                        <input type="text" className="form-control"
                            placeholder=""
                            autoFocus={true}
                            value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                        />
                </div>
                <div className="form-group col-4">
                    <label className="small">Password</label>
                    <input type="password" className="form-control"
                        placeholder="********"
                        value={specific_json.password}
                        onChange={(event) => {setData({password: event.target.value})}}
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Domain name</label>
                    <input type="text" className="form-control"
                        placeholder=""
                        value={specific_json.domain}
                            onChange={(event) => {setData({domain: event.target.value})}}
                    />
                </div>
                <div className="form-group col-8">
                    <label className="small">FQDN</label>
                        <input type="text" className="form-control"
                            placeholder="e.g. simsage.ai  (this will form your user's email addresses, eg. account-name@simsage.ai)"
                            value={specific_json.fqdn}
                                onChange={(event) => {setData({fqdn: event.target.value})}}
                        />
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Server</label>
                        <input type="text" className="form-control"
                            placeholder="(hostname or IP-address)"
                            value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                        />
                </div>
                <div className="form-group col-4">
                    <label className="small">Share name</label>
                        <input type="text" className="form-control"
                            placeholder=""
                            value={specific_json.shareName}
                                       onChange={(event) => {setData({shareName: event.target.value})}}
                        />
                </div>
                <div className="form-group col-4">
                    <label className="small">Share path</label>
                        <input type="text" className="form-control"
                            placeholder="path inside share (optional)"
                            value={specific_json.sharePath}
                                       onChange={(event) => {setData({sharePath: event.target.value})}}
                        />
                </div>
            </div>
        </div>
    )
}