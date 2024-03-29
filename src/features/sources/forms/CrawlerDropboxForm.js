import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import {useDispatch, useSelector} from "react-redux";
import {showErrorAlert} from "../../alerts/alertSlice";
import Api from "../../../common/api";
import SensitiveCredential from "../../../components/SensitiveCredential";

export default function CrawlerDropboxForm(props) {

    const selected_source = props.source;
    const dispatch = useDispatch();

    // is this source "active" as a saved source?
    const source_saved = selected_source && selected_source.sourceId > 0;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson :
        selected_source.specificJson ? selected_source.specificJson :
            "{\"clientId\": \"\", \"clientSecret\": \"\", \"folderList\": \"/\", \"oidcKey\": \"" + Api.createGuid() + "\"}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;
    const {selected_source_id} = useSelector((state) => state.sourceReducer);
    const [copied_uri, setCopiedUri] = useState('')

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

    // make sure we have an OIDC key to start with when creating a new source
    if (!source_saved && !specific_json.oidcKey) {
        specific_json.oidcKey = Api.createGuid();
    }

    // redirect url for dropbox OIDC
    const redirect = window.ENV.api_base + "/crawler/dropbox-oidc-code/" + specific_json.oidcKey;

    function handleCopyUri(e, selected_id) {
        e.preventDefault();
        let is_copied = Api.writeToClipboard(selected_id)
        if (is_copied) setCopiedUri(selected_id)
    }

    // get an OIDC code for dropbox
    function get_oidc(e) {
        e.preventDefault();
        const oidc_disabled = (!specific_json.clientId || !specific_json.clientSecret || !selected_source_id);
        if (oidc_disabled) {
            dispatch(showErrorAlert({title: "error", message: "you must save this source before setting up an OIDC token"}))
        } else {
            const dropbox_url = "https://www.dropbox.com/oauth2/authorize?client_id=" +
                encodeURIComponent(specific_json.clientId) + "&redirect_uri=" +
                encodeURIComponent(redirect) +
                "&response_type=code" +
                "&token_access_type=offline"
            window.open(dropbox_url, "_blank");
        }
    }

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <label className="small required">Client id (aka. app key)</label>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.clientId}
                                       onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {setData({clientSecret: event.target.value})}}
                                name="Client Secret"
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <label className="small">Dropbox oidc key</label>
                            <input type="text" className="form-control"
                                   placeholder="random key indentifying this endpoint"
                                   value={specific_json.oidcKey}
                                   onChange={(event) => {setData({oidcKey: event.target.value})}}
                            />
                            <span className="btn btn-light copied-style small position-absolute px-2 py-1 rounded"
                                  style={{left: "52%", marginTop: "-30px"}}
                                  title="regenerate the OIDC key, you will need to re-set up your dropbox connection if you do."
                                  onClick={() => setData({oidcKey: Api.createGuid()})} >
                                <img src="images/refresh.svg" className="refresh-image" alt="refresh"
                                     title="regenerate the oidc key" />
                            </span>
                        </div>
                    </div>
                    { selected_source_id &&
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <label className="small">Dropbox Redirect URI</label>
                            <div>{redirect}
                            {(copied_uri !== redirect) &&
                                <span className="btn btn-light copied-style small position-absolute top-50 start-50 translate-middle px-2 py-1 rounded">
                                <button onClick={(e) => handleCopyUri(e, redirect)}
                                        className={"btn text-primary btn-sm"}>Copy
                                </button>
                                </span>
                            }
                            {(copied_uri === redirect) &&
                                <span className="copied-style small position-absolute top-50 start-50 translate-middle text-white bg-dark px-2 py-1 rounded">Copied!</span>
                            }
                            </div>
                        </div>
                    </div>
                    }
                    <div className="row mb-4">
                        <div className="form-group col-8" title={source_saved ? "set up a new OIDC token connection" : "you must save your source before this action can be performed"}>
                            <button className="small btn btn-dark" formAction="return false;" disabled={!source_saved}
                                    onClick={(e) => get_oidc(e)}>set up OIDC token</button>
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="form-group col-8">
                            <label className="small d-flex justify-content-between">
                                Start folder
                                <span className="fst-italic fw-light small">(separate folders by comma)</span>
                            </label>
                            <input type="text" className="form-control"
                                placeholder=""
                                value={specific_json.folderList}
                               onChange={(event) => {setData({folderList: event.target.value})}}
                            />
                            <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li className="">Each folder must be part of the root folder and not contain any sub-folders.</li>
                                <li className="">
                                Each folder name must start with '/'.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-2 offset-1">
                    <a href="resources/simsage-dropbox-setup.pdf" id="dlDropbox" target="_blank"
                    title="Download the SimSage Dropbox setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                    <BsFilePdf size={25}/>
                    <span className="me-2 mt-2"></span>Dropbox <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    )
}