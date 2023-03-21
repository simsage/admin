import React, {Component, useEffect, useState} from 'react';

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
        <div className="crawler-page">
            <div className="form-group">
                    <span className="office-manual-box">
                    <a href="resources/simsage-confluence-crawler-setup.pdf" id="dlGDrive" target="_blank"
                       title="download the SimSage Google-drive setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="google-drive setup guide" className="image-size"/>
                        </a>
                    </span>
            </div>

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">Confluence Base Url</span>
                    <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="Base Url of the Atlassian installation"
                                               value={specific_json.baseUrl}
                                               onChange={(event) => {
                                                   setData({baseUrl: event.target.value})
                                               }}
                                        />
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                </div>
                <div className="full-column-2">
                    <span className="label-right-top">Confluence User</span>
                    <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="User id to use to log into Confluence"
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
                    <span className="label-right-top">Access Token</span>
                    <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type={form_show_password ? "text" : "password"}
                                               className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="Access token for the user"
                                               value={specific_json.accessToken}
                                               onChange={(event) => {
                                                   setData({accessToken: event.target.value})
                                               }}
                                        />
                                    </td>
                                    <td className={"password_hide_show"}>
                                        <p onClick={() => setShowPassword(!form_show_password)}>{!form_show_password?'Show':'Hide'}</p>
                                    </td>
                                    <td>

                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                </div>

                <div className="full-column-2">
                    <span className="label-right-top">Categories to crawl</span>
                    <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of categories separated by commas to crawl (leave empty to crawl all categories)"
                                          value={specific_json.categories}
                                          onChange={(event) => {
                                              setData({categories: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                </div>
                <div className="full-column-2">
                    <span className="label-right-top">Spaces to crawl</span>
                    <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of space keys separated by commas to crawl (leave empty to crawl all spaces)"
                                          value={specific_json.includeSpaces}
                                          onChange={(event) => {
                                              setData({includeSpaces: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                </div>
                <div className="full-column-2">
                    <span className="label-right-top">Spaces to exclude</span>
                    <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of space keys separated by commas to exclude from crawling (leave empty not to exclude any spaces)"
                                          value={specific_json.excludeSpaces}
                                          onChange={(event) => {
                                              setData({excludeSpaces: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                </div>
            </div>

        </div>
    );
}


