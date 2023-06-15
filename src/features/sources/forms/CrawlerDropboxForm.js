import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import {useSelector} from "react-redux";
import sourceReducer from "../sourceSlice";

export default function CrawlerDropboxForm(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;
    const {selected_organisation_id, selected_knowledge_base_id} = useSelector((state) => state.authReducer);
    const {selected_source_id} = useSelector((state) => state.sourceReducer);

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


    // get an OIDC code for dropbox
    function get_oidc(client_id) {
        const redirect = window.ENV.api_base + "/crawler/oidc-code/" + selected_organisation_id + "/" + selected_knowledge_base_id + "/" + selected_source_id;
        const dropbox_url = "https://www.dropbox.com/oauth2/authorize?client_id=" +
            encodeURIComponent(client_id) + "&redirect_uri=" +
            encodeURIComponent(redirect) +
            "&response_type=code"
        window.open(dropbox_url, "_blank");
    }

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <label className="small">Client id (aka. app key)</label>
                            <form>
                                <input type="text" className="form-control"
                                    placeholder=""
                                    autoFocus={true}
                                    value={specific_json.clientToken}
                                       onChange={(event) => {setData({clientToken: event.target.value})}}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <button className="small btn btn-dark"
                                    title="get an OIDC code from dropbox for this crawler"
                                    onClick={() => get_oidc(specific_json.clientToken)}
                                    disabled={!specific_json.clientToken}>set up OIDC token</button>
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
                                    placeholder=""
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