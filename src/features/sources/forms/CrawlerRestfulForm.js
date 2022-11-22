import React, {useEffect, useState} from "react";

export default function CrawlerRestfulForm(props) {


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
        return <h1>CrawlerRestfulForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">API url</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control jdbc-field-width"
                                       placeholder="JSON url (will grab the first list inside it can find as the source)"
                                       value={specific_json.url}
                                       onChange={(event) => {setData({url: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">record primary key (use [field-name])</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control jdbc-field-width"
                                       placeholder="the name of the primary key in the record"
                                       value={specific_json.pk}
                                       onChange={(event) => {setData({pk: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">JSON fields</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control jdbc-field-width"
                                       placeholder="document http/https reference JSON fields in square brackets [FIELD-NAME]"
                                       disabled={specific_json.customRender}
                                       value={specific_json.content_url}
                                       onChange={(event) => {setData({content_url: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">text index template (use [field-name])</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="REST text index template, an text template referencing REST fields in square brackets [FIELD-NAME]"
                                  disabled={!specific_json.customRender}
                                  rows={7}
                                  value={specific_json.text}
                                  onChange={(event) => {setData({text: event.target.value})}}
                        />
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">html render template (use [field-name])</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="REST html render template, an html template referencing REST fields in square brackets [FIELD-NAME]"
                                  disabled={!specific_json.customRender}
                                  rows={7}
                                  value={specific_json.template}
                                  onChange={(event) => {setData({template: event.target.value})}}
                        />
                    </span>
            </div>

        </div>
    )
}