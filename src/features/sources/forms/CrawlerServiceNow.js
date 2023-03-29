import React, {useEffect, useState} from 'react';

const CrawlerServiceNow = (props) => {


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
        return <h1>CrawlerServiceNow.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                <div className="full-column-2">
                    <span className="small-label-right">UserName</span>
                    <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="Username"
                                       autoFocus={true}
                                       value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                                />
                            </form>
                        </span>
                </div>
            </div>
            <div className="form-group">
                <div className="full-column-2">
                    <span className="small-label-right">Password</span>
                    <span className="bigger-text">
                            <form>
                                <input type="password" className="form-control"
                                       placeholder="Password"
                                       value={specific_json.password}
                                onChange={(event) => {setData({password: event.target.value})}}
                                />
                            </form>
                        </span>
                </div>
            </div>
            <div className="form-group">
                <div className="full-column-2">
                    <span className="small-label-right">Instance Name</span>
                    <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="Service Now Instance Name"
                                       value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                                />
                            </form>
                        </span>
                </div>
            </div>
        </div>
    )
};

export default CrawlerServiceNow;