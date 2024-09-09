import React, {useEffect} from 'react';
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";
import {DOCUMENTATION, useSelectedSource} from './common.js';


export default function CrawlerConfluenceForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
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
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-8" title="base url (e.g. https://simsage.atlassian.net)">
                            <label className="small required">Confluence Base Url</label>
                            <input type="text" className="form-control" autoFocus={true}
                                   placeholder="base url (e.g. https://simsage.atlassian.net)"
                                   value={specific_json.baseUrl}
                                   onChange={(event) => {
                                       setData({baseUrl: event.target.value})
                                   }}
                                   required
                            />
                        </div>
                        <div className="form-group col-4">
                            <label className="small required">Confluence User</label>
                            <input type="text" className="form-control" placeholder="e.g., john@simsage.co.uk"
                                   value={specific_json.userId}
                                   onChange={(event) => {
                                       setData({userId: event.target.value})
                                   }}
                                   required
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.accessToken}
                                onChange={(event) => {
                                    setData({accessToken: event.target.value})
                                }}
                                name="Access Token"
                                placeholder="***********"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4 mb-4">
                        <div className="col-6">
                            <div className="form-group">
                                <label className="small d-flex justify-content-between">
                                    Categories (type of space, aka. labels)
                                    <span className="fst-italic fw-light small">
                                        (separate category (aka. labels) by comma)
                                    </span>
                                </label>
                                <textarea className="form-control" disabled={specific_json.crawlAllSites}
                                          placeholder="labels of categories, aka. types, case insensitive,
                                          separated by commas (leave empty to crawl all categories),
                                           e.g. knowledge-bases"
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
                                          placeholder="keys of spaces, case insensitive, separated by commas (leave empty to crawl all spaces)"
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
                                          placeholder="keys of spaces, case insensitive, separated by commas (leave empty to not exclude any spaces)"
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
                    <a href={DOCUMENTATION.CONFLUENCE} id="dlGDrive" target="_blank" rel="noreferrer"
                       title="Download the SimSage Confluence setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Confluence <br/>Setup Guide
                    </a>
                </div>
            </div>

        </div>
    );
}


