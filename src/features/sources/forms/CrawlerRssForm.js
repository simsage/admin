import React, {useEffect, useState} from "react";

export default function CrawlerRssForm(props) {


    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    // const self = this;
    // const theme = props.theme;
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
                    <label className="small">Main RSS Feed</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="RSS endpoint"
                            autoFocus={true}
                            value={specific_json.endpoint}
                        onChange={(event) => setData({endpoint: event.target.value})} />
                    </form>
                    <ul class="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li className="">This is the main endpoint for any RSS
                            feed. Be sure to uncheck.</li>
                    </ul>
                </div>
                <div className="form-group col-6">
                    <label className="small">Initial RSS Feed <span className="fst-italic text-black-50">(optional)</span></label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="RSS endpoint"
                            autoFocus={true}
                            value={specific_json.initial_feed}
                            onChange={(event) => setData({initial_feed: event.target.value})} />
                    </form>
                    <ul class="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li className="">The contents of this RSS endpoint will be processed once when the crawler starts and is meant to act as an initial set up..</li>
                    </ul>
                </div>
            </div>
    </div>)
}