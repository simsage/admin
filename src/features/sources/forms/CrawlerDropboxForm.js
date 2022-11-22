import React, {useEffect, useState} from "react";
import Api from "../../../common/api";

export default function CrawlerDropboxForm(props) {


    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error,setError] = useState()


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerDropboxForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client token</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       autoFocus={true}
                                       spellCheck={false}
                                       placeholder="client token"
                                       value={specific_json.clientToken}
                                       onChange={(event) => {setData({clientToken: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="dropbox-manual-box">
                        <a href="../resources/simsage-dropbox-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Dropbox setup guide">
                            <span className="instructions-label">dropbox setup guide / instructions</span>
                        </a>
                    </span>
            </div>

            <div className="form-group small-text-with-width">
                You can enter multiple folders separated by commas.  Each folder must be part of the root folder and not contain any sub-folders.
                You can leave this entry empty to crawl all folders.  Each folder name must start with '/'.
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">start folder</span>
                        <span className="big-text">
                            <input type="text" className="form-control textarea-width"
                                   value={specific_json.folderList}
                                   onChange={(event) => {setData({folderList: event.target.value})}}
                            />
                        </span>
                    </span>
            </div>

        </div>
    )
}