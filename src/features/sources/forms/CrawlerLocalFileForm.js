import React, {useEffect} from "react";
import {useSelectedSource} from './common.js';

export default function CrawlerLocalFileForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

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

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (

        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-3">
                    <label className="small required">Local folder CSV list</label>
                    <textarea cols="80" rows="5"
                              placeholder="csv list of local folders to crawl on the remote system"
                              value={specific_json.local_folder_csv}
                              onChange={(event) => {
                                  setData({local_folder_csv: event.target.value})
                              }}
                    />
                </div>
            </div>
        </div>
    )
}