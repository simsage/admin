import React, {useEffect, useState} from 'react';
import {BsFilePdf} from 'react-icons/bs'

import Api from "../../../common/api";

// import '../css/crawler.css';
// import {useForm} from "react-hook-form";

export default function CrawlerConfluenceForm(props) {
    const selected_source = props.source;
    const [has_error, setFormError] = useState();
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data;
    const [form_show_password,setShowPassword]=useState(false);

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
        return <h1>CrawlerOnedriveForm.js: Something went wrong.</h1>;
    }


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-8">
                            <label className="small">Confluence Base Url</label>
                            <form>
                                <input type="text" className="form-control"
                                    // placeholder="Base Url of the Atlassian installation"
                                    autoFocus={true}
                                    value={specific_json.baseUrl}
                                    onChange={(event) => {
                                        setData({baseUrl: event.target.value})
                                    }}
                                />
                            </form>
                        </div>
                        <div className="form-group col-4">
                            <label className="small">Confluence User</label>
                            <form>
                                <input type="text" className="form-control"
                                    // placeholder="User id to use to log into Confluence"
                                    autoFocus={true}
                                    value={specific_json.userId}
                                    onChange={(event) => {
                                        setData({userId: event.target.value})
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <label className="small">Access Token</label>
                            <form>
                                <div className="form-control d-flex align-items-center">
                                    <input type={form_show_password ? "text" : "password"} className="border-0 p-0 w-100"
                                        autoFocus={true}
                                        placeholder="********"
                                        value={specific_json.accessToken}
                                        onChange={(event) => {
                                            setData({accessToken: event.target.value})
                                        }}
                                    />
                                    <span className='small text-primary' onClick={() => setShowPassword(!form_show_password)}>{!form_show_password?'Show':'Hide'}</span>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row border-top pt-4 mb-4">
                        <div className="col-6">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    Categories to crawl
                                    <span className="fst-italic fw-light small">(separate categories by comma)</span>
                                </label>
                                <textarea className="form-control"
                                    disabled={specific_json.crawlAllSites}
                                    placeholder="(leave empty to crawl all categories)"
                                    rows={3}
                                    value={specific_json.categories}
                                    onChange={(event) => {
                                        setData({categories: event.target.value})
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-6">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    Spaces to crawl
                                    <span className="fst-italic fw-light small">(separate space keys by comma)</span>
                                </label>
                                <textarea className="form-control"
                                    disabled={specific_json.crawlAllSites}
                                    placeholder="(leave empty to crawl all spaces)"
                                    rows={3}
                                    value={specific_json.includeSpaces}
                                    onChange={(event) => {
                                        setData({includeSpaces: event.target.value})
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    Spaces to exclude
                                    <span className="fst-italic fw-light small">(separate space keys by comma)</span>
                                </label>
                                <textarea className="form-control"
                                    disabled={specific_json.crawlAllSites}
                                    placeholder="(leave empty to not exclude any spaces)"
                                    rows={3}
                                    value={specific_json.excludeSpaces}
                                    onChange={(event) => {
                                        setData({excludeSpaces: event.target.value})
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-2 offset-1">
                    <a href="resources/simsage-confluence-crawler-setup.pdf" id="dlGDrive" target="_blank"
                        title="View the SimSage Sharepoint365 setup guide" className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Confluence <br/>Setup Guide 
                    </a>
                </div>
            </div>

        </div>
    );
}


