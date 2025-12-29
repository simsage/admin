import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import {useDispatch, useSelector} from "react-redux";
import {showErrorAlert} from "../../alerts/alertSlice";
import Api, {uri_esc} from "../../../common/api";
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, validDropBoxFolderList} from './common.js';
import {CopyButton} from "../../../components/CopyButton";


export default function CrawlerDropboxForm(props) {

    const [specific_json, setSpecificJson] = useState(undefined)
    const [source_saved, setSourceSaved] = useState(false)

    useEffect(() => {
        if (!specific_json) {
            const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ?
                props.form_data.specificJson : props.source.specificJson ? props.source.specificJson :
                    "{\"clientId\": \"\", \"clientSecret\": \"\", \"folderList\": \"/\", \"oidcKey\": \"" + Api.createGuid() + "\"}"
            setSpecificJson(JSON.parse(specific_json_from_form_data))
            setSourceSaved(props.source && props.source.sourceId > 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.source, props.form_data, source_saved, specific_json, setSpecificJson, setSourceSaved])

    //update setFormData when specific_json is changed
    useEffect(() => {
        if (specific_json) {
            let specific_json_stringify = JSON.stringify(specific_json)
            props.setFormData({...props.form_data, specificJson: specific_json_stringify})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    useEffect(() => {
        const validate_dropbox = () => {
            const {folderList} = specific_json && specific_json.folderList ? specific_json.folderList : ''
            let missing = []
            if (!validDropBoxFolderList(folderList)) missing.push("folderList")
            return missing.length > 0 ? `Dropbox Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) props.set_verify(() => validate_dropbox)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.set_verify, specific_json])

    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    const dispatch = useDispatch();
    const selected_source_id = (props.source && props.source.sourceId) ? props.source.sourceId : null;
    const oidc_disabled = (!specific_json || !specific_json.clientId || !specific_json.oidcKey ||
        !selected_source_id || ("" + selected_source_id === "0"));

    //update local variable specific_json when data is changed
    function setData(data) {
        if (specific_json) {
            setSpecificJson({...specific_json, ...data})
        }
    }

    // make sure we have an OIDC key to start with when creating a new source
    if (!source_saved && specific_json && !specific_json.oidcKey) {
        specific_json.oidcKey = Api.createGuid();
    }

    // redirect url for dropbox OIDC
    const redirect = window.ENV.api_base + "/crawler/dropbox-oidc-code/" + ((specific_json && specific_json.oidcKey) ? specific_json.oidcKey : '');

    // get an OIDC code for dropbox
    function get_oidc(e) {
        e.preventDefault();
        if (oidc_disabled) {
            dispatch(showErrorAlert({
                title: "error",
                message: "you must save this source before setting up an OIDC token"
            }))
        } else {
            const dropbox_url = "https://www.dropbox.com/oauth2/authorize?client_id=" +
                uri_esc(specific_json.clientId) +
                "&response_type=code" +
                "&token_access_type=offline" +
                "&redirect_uri=" + redirect
            window.open(dropbox_url, "_blank");
        }
    }


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Client id (aka. app key)</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json ? specific_json.clientId : ''}
                                   onChange={(event) => {
                                       setData({clientId: event.target.value})
                                   }}
                                   required
                            />
                        </div>
                        <div className="form-group col-6">
                            <SensitiveCredential
                                selected_source={props.source}
                                specific_json={specific_json ? specific_json.clientSecret : ''}
                                onChange={(event) => {
                                    setData({clientSecret: event.target.value})
                                }}
                                name="Client Secret"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small">Dropbox oidc key</label>
                            <div className="d-flex input-group">
                                <input type="text" className="form-control"
                                       placeholder="random key indentifying this endpoint"
                                       value={specific_json && specific_json.oidcKey ? specific_json.oidcKey : ''}
                                       onChange={(event) => {
                                           setData({oidcKey: event.target.value})
                                       }}
                                />
                                <span className="input-group-text copied-style"
                                      title="regenerate the OIDC key, you will need to re-set up your dropbox connection if you do."
                                      onClick={() => setData({oidcKey: Api.createGuid()})}>
                                    <img src={REFRESH_IMAGE} className="refresh-image" alt="refresh"
                                         title="regenerate the oidc key"/>
                                </span>
                            </div>
                        </div>
                    </div>
                    {selected_source_id &&
                        <div className="row mb-4 row border-top pt-4">
                            <div className="form-group col-10 d-flex align-items-center">
                                <div>
                                    <h6>Dropbox Redirect URI</h6>
                                    <p>{redirect}</p>
                                </div>
                                <div className="ms-3">
                                    <CopyButton reference={redirect}/>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="row mb-4">
                        <div className="form-group col-8" title={source_saved ? "set up a new OIDC token connection" :
                            "you must save your source before this action can be performed"}>
                            <button className="btn btn-primary" formAction="return false;" disabled={oidc_disabled}
                                    onClick={(e) => get_oidc(e)}>set up OIDC token
                            </button>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="form-group col-8">
                            <label className="small d-flex justify-content-between">
                                Start folder
                                <span className="fst-italic fw-light small">(separate folders by comma)</span>
                            </label>
                            <input type="text" className="form-control"
                                   value={specific_json ? specific_json.folderList: ''}
                                   onChange={(event) => {
                                       setData({folderList: event.target.value})
                                   }}
                            />
                            <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li>Each folder must be part of the root folder and not contain any sub-folders.</li>
                                <li>Each folder name must start with '/'.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.DROPBOX} id="dlDropbox" target="_blank" rel="noreferrer"
                       title="Download the SimSage Dropbox setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Dropbox<br/>Setup Guide
                    </a>
                </div>
            </div>
        </div>
    )
}