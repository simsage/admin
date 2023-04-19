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
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Username</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder=""
                            autoFocus={true}
                            value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <label className="small">Password</label>
                    <form>
                        <input type="password" className="form-control"
                            placeholder="********"
                            value={specific_json.password}
                            onChange={(event) => {setData({password: event.target.value})}}
                        />
                    </form>
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Domain name</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder=""
                            value={specific_json.domain}
                                onChange={(event) => {setData({domain: event.target.value})}}
                        />
                    </form>
                </div>
                <div className="form-group col-8">
                    <label className="small">FQDN</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="e.g. simsage.ai  (this will form your user's email addresses, eg. account-name@simsage.ai)"
                            value={specific_json.fqdn}
                                onChange={(event) => {setData({fqdn: event.target.value})}}
                        />
                    </form>
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-4">
                    <label className="small">Server</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="(hostname or IP-address)"
                            value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <label className="small">Share name</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder=""
                            value={specific_json.shareName}
                                       onChange={(event) => {setData({shareName: event.target.value})}}
                        />
                    </form>
                </div>
                <div className="form-group col-4">
                    <label className="small">Share path</label>
                    <form>
                        <input type="text" className="form-control"
                            placeholder="path inside share (optional)"
                            value={specific_json.sharePath}
                                       onChange={(event) => {setData({sharePath: event.target.value})}}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}