import React, {useEffect, useState} from "react";

export default function CrawlerSearchForm2(props){

    const selected_source = props.source;
    const [has_error, setFormError] = useState();
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;

    const [query_list, setQueryList] = useState(specific_json.queryList?specific_json.queryList:[''])
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


    function handleQueryInputChange(val,index){
        let temp_list = query_list.filter((item) => {
            if (item.trim().length) {
                return item
            }
        })
        if(val.trim().length === 0){
            temp_list.splice(index,1);
        }else {
            temp_list[index] = val;
        }

        //update SpecificJson
        const data = {queryList:temp_list}
        setSpecificJson({...specific_json,...data})

        //add extra text input
        temp_list.push('');
        setQueryList([...temp_list])

    }

    function showQueryText(){
        return query_list.map((item,index)=>{
            return <input key={index}
                type="text" className="form-control dropbox-text-width"
                spellCheck={false}
                style={{width: "500px", marginRight: "10px"}}
                placeholder="Query text to run"
                value={item}
                onChange={(e) => handleQueryInputChange(e.target.value,index)}
            /> ;
        })
    }


    if (has_error) {
        return <h1>CrawlerOnedriveForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">Target Organisation</span>
                    <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       style={{width: "400px", marginRight: "10px"}}
                                       placeholder="Organisation id to query"
                                       value={specific_json.target_organisation_id}
                                       onChange={(event) => {
                                           setData({target_organisation_id: event.target.value})
                                       }}
                                />
                            </form>
                        </span>
                </div>
            </div>

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">Target Knowledgebase</span>
                    <span className="bigger-text">
                            <form>
                                <input className="textarea-width"
                                       spellCheck={false}
                                       style={{width: "400px", marginRight: "10px"}}
                                       placeholder="The Knowledgebase id to search across"
                                       value={specific_json.target_kb_id}
                                       onChange={(event) => {
                                           setData({target_kb_id: event.target.value})
                                       }}
                                />
                            </form>
                        </span>
                </div>
            </div>
            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">Search User</span>
                    <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="User id under which the search will run"
                                               value={specific_json.userId}
                                               onChange={(event) => {
                                                   setData({userId: event.target.value})
                                               }}
                                        />
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                </div>
            </div>
            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">Query text</span>
                    <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                {showQueryText()}
                                </tbody>
                            </table>
                            </form>
                        </span>
                </div>
            </div>

        </div>
    );
}