import React, {useEffect} from "react";
import {useSelectedSource} from "./common";
import {useSelector} from "react-redux";

export default function CrawlerRssForm(props) {


    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const theme = useSelector((state) => state.homeReducer.theme);

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    useEffect(() => {
        const validate_RSS = () => {
            const {endpoint} = specific_json
            return !endpoint || endpoint < 5 ? `RSS Crawler: please provide the endpoint, min length 5` : null
        }

        if (props.set_verify) props.set_verify(() => validate_RSS)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">

            <div className="row mb-4">
                <div className="form-group col-6">
                    <label className="small required">Main RSS Feed</label>
                    <input type="text" className="form-control"
                           placeholder="RSS endpoint"
                           autoFocus={true}
                           value={specific_json.endpoint}
                           onChange={(event) => setData(
                               {endpoint: event.target.value}
                           )}
                           required
                    />
                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li>
                            This is the main endpoint for any RSS feed. Be sure to uncheck.
                        </li>
                    </ul>
                </div>
                <div className="form-group col-6">
                    <label className="small">Initial RSS Feed CSV list
                        <span className={(theme==="light" ? "text-black-50" : "text-white-50") + " fst-italic"}>(optional)</span>
                    </label>
                    <textarea className="form-control"
                              placeholder="RSS endpoint CSV list"
                              autoFocus={true}
                              value={specific_json.initial_feed}
                              onChange={(event) => setData({initial_feed: event.target.value})}/>
                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li>
                            The contents of this RSS endpoint is a CSV list and each item will be processed
                            once when the crawler starts and is meant to act as an initial set up..
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-6">
                    <label className="small">Include css csv</label>
                    <textarea className="form-control"
                              placeholder="css/html root fragments to include csv"
                              rows="3"
                              value={specific_json.webCss ?? ''}
                              onChange={(event) => {
                                  setData({webCss: event.target.value})
                              }}
                    />
                </div>

                <div className="form-group col-6">
                    <label className="small">Exclude css csv</label>
                    <textarea className="form-control"
                              placeholder="css/html root fragments to exclude csv (e.g. header, footer, div.class-name)"
                              rows="3"
                              value={specific_json.webCssIgnore ?? ''}
                              onChange={(event) => {
                                  setData({webCssIgnore: event.target.value})
                              }}
                    />
                </div>
            </div>
        </div>
    )
}