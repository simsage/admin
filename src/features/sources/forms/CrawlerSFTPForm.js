import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from "./common";

export default function CrawlerSFTPForm(props) {

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
            {/**********************************-USERNAME, PASSWORD & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Username</label>
                    <form>
                        <input type="email" className="form-control nfs-width"
                               autoFocus={true}
                               placeholder="E.g., SFTP User"
                               value={specific_json.username}
                               onChange={(event) => {
                                   setData({username: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                        name="Pasword"
                        required={!source_saved}
                    />
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.SFTP} id="dlGDrive" target="_blank"
                       title="Download the SimSage Jira setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>SFTP <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-HOST NAME, PORT & ROOT PATH-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Hostname</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="E.g., IP"
                               value={specific_json.host_name}
                               onChange={(event) => {
                                   setData({host_name: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-2">
                    <label className="small required">Port</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="22 by default"
                               value={specific_json.port}
                               onChange={(event) => {
                                   setData({port: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-2">
                    <label className="small required">Root Path</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="E.g., /home"
                               value={specific_json.root_path}
                               onChange={(event) => {
                                   setData({root_path: event.target.value})
                               }}
                               required={!source_saved}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
