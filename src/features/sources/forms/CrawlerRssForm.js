import React, {useEffect} from "react";
import {useSelectedSource} from "./common";

export default function CrawlerRssForm(props) {


    // Fetch selected source and calculate source_saved using custom hook
    const {
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

            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small required">Main RSS Feed</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="RSS endpoint"
                            autoFocus={true}
                            value={specific_json.endpoint}
                        onChange={(event) => setData({endpoint: event.target.value})} />
                    </form>
                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li className="">This is the main endpoint for any RSS
                            feed. Be sure to uncheck.</li>
                    </ul>
                </div>
                <div className="form-group col-6">
                    <label className="small">Initial RSS Feed CSV list <span className="fst-italic text-black-50"> (optional)</span></label>
                    <form>
                        <textarea className="form-control"
                            placeholder="RSS endpoint CSV list"
                            autoFocus={true}
                            value={specific_json.initial_feed}
                            onChange={(event) => setData({initial_feed: event.target.value})} />
                    </form>
                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li className="">The contents of this RSS endpoint is a CSV list and each item will be processed once when the crawler starts and is meant to act as an initial set up..</li>
                    </ul>
                </div>
            </div>
    </div>)
}