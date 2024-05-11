import React, {useEffect} from "react";
import {BsFilePdf} from "react-icons/bs";
import SensitiveCredential from "../../../components/SensitiveCredential";
import { DOCUMENTATION, useSelectedSource } from './common.js';

export default function CrawlerAWSForm(props) {

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
            {/**********************************-BUCKET-NAME, ACCESS-KEY & PDF-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Bucket Name</label>
                    <form>
                        <input type="email" className="form-control nfs-width"
                               autoFocus={true}
                               placeholder="e.g., simsagedev1"
                               value={specific_json.bucket_name}
                               onChange={(event) => {
                                   setData({bucket_name: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.access_key}
                        placeholder="*****************"
                        onChange={(event) => {
                            setData({access_key: event.target.value})
                        }}
                        name="Access Key"
                    />
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.AWS} id="dlGDrive" target="_blank"
                       title="Download the SimSage AWS setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>AWS <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/**********************************-SECRET KEY & REGION-**********************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Region</label>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="e.g., eu-west-2"
                               value={specific_json.region}
                               onChange={(event) => {
                                   setData({region: event.target.value})
                               }}
                               required
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.secret_key}
                        placeholder="*****************"
                        onChange={(event) => {
                            setData({secret_key: event.target.value})
                        }}
                        name="Secret Key"
                        required={!source_saved}
                    />
                </div>
            </div>
        </div>
    )
}
