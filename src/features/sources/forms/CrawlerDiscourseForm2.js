import React, {useEffect, useState} from "react";

export default function CrawlerDiscourseForm2(props){


    const selected_source = props.source;
    const [has_error, setFormError] = useState();
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
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
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerOnedriveForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">server hostname</span>
                        <span className="big-text">
                            <input type="text" className="form-control textarea-width"
                                   autoFocus={true}
                                   placeholder="server (e.g. discourse.simsage.ai)"
                                   value={specific_json.server}
                                   onChange={(event) => {setData({server: event.target.value})}}
                            />
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">api token</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="api token"
                                       value={specific_json.apiToken}
                                       onChange={(event) => {setData({apiToken: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="dropbox-manual-box">
                        <a href="resources/discourse-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Discourse setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="discourse setup guide" className="image-size" />
                        </a>
                    </span>
            </div>

        </div>);
}