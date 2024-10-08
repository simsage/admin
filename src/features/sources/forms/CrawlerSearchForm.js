import React, {useEffect, useState} from "react";
import {useSelectedSource} from "./common";

export default function CrawlerSearchForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const [query_list, setQueryList] = useState(specific_json.queryList ? specific_json.queryList : [''])

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


    function handleQueryInputChange(val, index) {
        let temp_list = query_list.filter((item) => {
            return item.trim().length > 0
        })
        if (val.trim().length === 0) {
            temp_list.splice(index, 1);
        } else {
            temp_list[index] = val;
        }

        //update SpecificJson
        const data = {queryList: temp_list}
        setSpecificJson({...specific_json, ...data})

        //add extra text input
        temp_list.push('');
        setQueryList([...temp_list])
    }

    function showQueryText() {
        return query_list.map((item, index) => {
            return <input key={index}
                          type="text" className="form-control"
                          spellCheck={false}
                          placeholder="Query text to run"
                          value={item}
                          onChange={(e) => handleQueryInputChange(e.target.value, index)}
            />
        })
    }

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small required">Target Organisation</label>
                    <input type="text" className="form-control"
                           placeholder="ID to query"
                           autoFocus={true}
                           value={specific_json.target_organisation_id}
                           onChange={(event) => {
                               setData({target_organisation_id: event.target.value})
                           }}
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small required">Target Knowledgebase</label>
                    <input type="text" className="form-control"
                           placeholder="ID to search across"
                           autoFocus={true}
                           value={specific_json.target_kb_id}
                           onChange={(event) => {
                               setData({target_kb_id: event.target.value})
                           }}
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Search User</label>
                    <input type="text" className="form-control"
                           placeholder="User ID the search will run"
                           autoFocus={true}
                           value={specific_json.userId}
                           onChange={(event) => {
                               setData({userId: event.target.value})
                           }}
                    />
                </div>
                <div className="form-group col-4">
                    <label className="small">Query text</label>
                    {showQueryText()}
                </div>
            </div>
        </div>
    );
}