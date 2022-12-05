import React, {useEffect, useState} from "react";

export default function CrawlerFileForm(props) {


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
        return <h1>CrawlerFileForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">user name</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       autoFocus={true}
                                       placeholder="user name"
                                       value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                                />
                            
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">password</span>
                        <span className="big-text">
                            
                                <input type="password" className="form-control"
                                       placeholder="password"
                                       value={specific_json.password}
                                       onChange={(event) => {setData({password: event.target.value})}}
                                />
                            
                        </span>
                    </span>
            </div>


            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">domain name</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       placeholder="domain name"
                                       value={specific_json.domain}
                                       onChange={(event) => {setData({domain: event.target.value})}}
                                />
                            
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">fqdn</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       placeholder="e.g.  simsage.ai  (this will form your user's email addresses, eg. account-name@simsage.ai)"
                                       value={specific_json.fqdn}
                                       onChange={(event) => {setData({fqdn: event.target.value})}}
                                />
                            
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">server</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       placeholder="server (hostname or ip-address)"
                                       value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                                />
                            
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">share name</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       placeholder="share name"
                                       value={specific_json.shareName}
                                       onChange={(event) => {setData({shareName: event.target.value})}}
                                />
                            
                        </span>
                    </span>
            </div>



            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">share path</span>
                        <span className="big-text">
                            
                                <input type="text" className="form-control"
                                       placeholder="path inside share (optional)"
                                       value={specific_json.sharePath}
                                       onChange={(event) => {setData({sharePath: event.target.value})}}
                                />
                            
                        </span>
                    </span>
            </div>


        </div>
    )
}