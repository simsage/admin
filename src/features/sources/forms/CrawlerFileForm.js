import React, {useEffect} from "react";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {BsFilePdf} from "react-icons/bs";
import { DOCUMENTATION, useSelectedSource } from './common.js';


export default function CrawlerFileForm(props) {

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
            {/*************************************-USER & PASSWORD-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Username</label>
                    <input type="text" className="form-control"
                           placeholder="username"
                           autoFocus={true}
                           value={specific_json.username}
                           onChange={(event) => {
                               setData({username: event.target.value})
                           }}
                    />
                </div>
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                        name="Password"
                        placeholder="********"
                        required={!source_saved}
                    />
                </div>
                <div className="col-2 offset-2">
                    <a href={DOCUMENTATION.MS_FILESHARE} id="dlMSFileshare" target="_blank"
                       title="Download the SimSage Microsoft Fileshare setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Microsoft Fileshare <br/>Setup Guide
                    </a>
                </div>
            </div>
            {/*************************************-SERVER & DOMAIN-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Server</label>
                    <input type="text" className="form-control"
                           placeholder="(hostname or IP-address)"
                           value={specific_json.server}
                           onChange={(event) => {
                               setData({server: event.target.value})}}
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small required">Share name</label>
                    <input type="text" className="form-control"
                           placeholder="share name"
                           value={specific_json.shareName}
                           onChange={(event) => {
                               setData({shareName: event.target.value})}}
                    />
                </div>
            </div>
            {/*************************************-SHARE & PATH-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Share path</label>
                    <input type="text" className="form-control"
                           placeholder="path inside share (optional)"
                           value={specific_json.sharePath}
                           onChange={(event) => {
                               setData({sharePath: event.target.value})}}
                    />
                </div>
            </div>
            <hr />
            {/*************************************-USE AD & SERVER-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Use Active Directory (Optional)</label>
                    <div className="form-check form-switch"
                         title="Enable to establish active directory connection">
                        <input className="form-check-input"
                               type="checkbox"
                               checked={specific_json.useAD}
                               onChange={(event) => {
                                   setData({useAD: event.target.checked})
                               }}
                        />
                    </div>
                </div>
                <div className="form-group col-4">
                    <label className="small">Active Server</label>
                    <input type="text" className="form-control"
                           disabled={!specific_json.useAD}
                           placeholder="AD server address"
                           value={specific_json.activeServer}
                           onChange={(event) => {
                               setData({activeServer: event.target.value})}}
                    />
                </div>
            </div>
            {/*************************************-ENABLE SSL & DOMAIN NAME-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Enable SSL Connection</label>
                    <div className="form-check form-switch"
                         title="If enabled, SSL connection will be established, more secure.">
                        <input className="form-check-input"
                               disabled={!specific_json.useAD}
                               type="checkbox"
                               checked={specific_json.useSSL}
                               onChange={(event) => {
                                   setData({useSSL: event.target.checked})
                               }}
                        />
                    </div>
                </div>
                <div className="form-group col-4">
                    <label className="small">Domain name</label>
                    <input type="text" className="form-control"
                           disabled={!specific_json.useAD}
                           placeholder="domain (e.g. SIMSAGE)"
                           value={specific_json.domain}
                           onChange={(event) => {
                               setData({domain: event.target.value})}}
                    />
                </div>
            </div>
            {/*************************************-ACTIVE DIRECTORY PATH-*************************************/}
            <div className="row mb-4">
                <div className="form-group col-4"/>
                <div className="form-group col-4">
                    <label className="small">Active Directory Path</label>
                    <input type="text" className="form-control"
                           disabled={!specific_json.useAD}
                           placeholder="AD Path (e.g. DC=simsage,DC=co,DC=uk)"
                           value={specific_json.adPath}
                           onChange={(event) => {
                               setData({adPath: event.target.value})}}
                    />
                </div>
            </div>
        </div>
    )
}
