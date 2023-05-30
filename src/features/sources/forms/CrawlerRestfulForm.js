import React, {useEffect, useState} from "react";

export default function CrawlerRestfulForm(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
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


    return (
        <div className="tab-content px-5 py-4 overflow-auto">

            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small">API url</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="JSON url (will grab the first list inside it can find as the source)"
                            autoFocus={true}
                            value={specific_json.url}
                                       onChange={(event) => {setData({url: event.target.value})}}
                        />
                    </form>
                </div>
                <div className="form-group col-6">
                    <label className="small">Record primary key</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="Use [field-name]"
                            autoFocus={true}
                            value={specific_json.pk}
                                       onChange={(event) => {setData({pk: event.target.value})}}
                        />
                    </form>
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small">JSON fields</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="document http/https reference JSON fields in square brackets [FIELD-NAME]"
                            autoFocus={true}
                            disabled={specific_json.customRender}
                            value={specific_json.content_url}
                                       onChange={(event) => {setData({content_url: event.target.value})}}
                        />
                    </form>
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small">Text index template</label>
                    <textarea className="form-control"
                            placeholder="REST text index template, an text template referencing REST fields in square brackets [FIELD-NAME]"
                            disabled={!specific_json.customRender}
                                  rows={5}
                                  value={specific_json.text}
                                  onChange={(event) => {setData({text: event.target.value})}}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="small">HTML render template</label>
                    <textarea className="form-control"
                            placeholder="REST html render template, an html template referencing REST fields in square brackets [FIELD-NAME]"
                            disabled={!specific_json.customRender}
                                  rows={5}
                                  value={specific_json.template}
                                  onChange={(event) => {setData({template: event.target.value})}}
                    />
                </div>
            </div>

        </div>
    )
}