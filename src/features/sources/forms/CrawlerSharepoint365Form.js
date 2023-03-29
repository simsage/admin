import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'

export default function CrawlerSharepoint365Form(props) {


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
        return <h1>CrawlerSharepoint365Form.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                <div className="full-column-2">
                    <span className="small-label-right">tenant id</span>
                    <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="tenant id"
                                       autoFocus={true}
                                       value={specific_json.tenantId}
                                       onChange={(event) => {setData({tenantId: event.target.value})}}
                                />
                            </form>
                        </span>
                    <span className="office-manual-box">
                            <a href="resources/simsage-sharepoint365-setup.pdf" id="dlsharepoint" target="_blank"
                               title="View the SimSage Sharepoint365 setup guide">
                            <BsFilePdf size={25}/>
                        </a>

                        </span>
                </div>
            </div>


            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="client id"
                                       value={specific_json.clientId}
                                       onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">client secret</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="client secret"
                                       value={specific_json.clientSecret}
                                       onChange={(event) => {setData({clientSecret: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <br/>

            <div className="form-group">
                        <span className="full-column">
                            <div style={{float: 'left'}} title="Check this box if you want all SharePoint sites to be indexed">
                                <input type="checkbox"
                                       checked={specific_json.crawlAllSites}
                                       onChange={(event) => { setData({crawlAllSites: event.target.checked}); }}
                                       value="crawl all Sites?"
                                />
                                <span className="label-left">crawl all Sites?</span>
                            </div>
                        </span>
            </div>

            <br/>

            <div className="form-group">
                <div className="ull-column">crawl specific sharepoint sites by name</div>
            </div>
            <div className="form-group">
                <div className="full-column">
                        <textarea className="textarea-width"
                                  disabled={specific_json.crawlAllSites}
                                  placeholder="specific sharepoint sites (comma separated sharepoint site names)"
                                  rows={2}
                                  value={specific_json.sharePointSitesToCrawl}
                                  onChange={(event) => {setData({sharePointSitesToCrawl: event.target.value})}}
                        />
                </div>
            </div>

        </div>
    )
}