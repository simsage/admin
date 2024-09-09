import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";
import {SharepointSiteAndLibraries} from "./SharepointSiteAndLibraries";
import {DOCUMENTATION, invalid_credential, useSelectedSource} from "./common";

export default function CrawlerSharepoint365Form(props) {

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

    const [editSiteDetails, setEditSiteDetails] = useState(false)
    const [currentSiteDetails, setCurrentSiteDetails] = useState({})
    const [currentSiteRow, setCurrentSiteRow] = useState(-1)

    const getSites = () => {
        if (specific_json && specific_json.sites) {
            return specific_json.sites
        } else return []
    }
    const editSite = (index) => {
        const curAllSites = specific_json.sites ? specific_json.sites : []
        setCurrentSiteRow(index)
        setCurrentSiteDetails(curAllSites[index])
        setEditSiteDetails(true)
    }

    const removeSite = (index) => {
        const curAllSites = specific_json.sites ? specific_json.sites : []
        curAllSites.splice(index, 1)
        setData({sites: curAllSites})
    }

    const closeEditForm = (e) => {
        setEditSiteDetails(false)
        e.preventDefault()
    }

    const setSiteValue = (siteValue) => {
        const curSites = specific_json.sites ? specific_json.sites : []
        if (currentSiteRow === -1) {
            curSites.push(siteValue)
        } else {
            curSites[currentSiteRow] = siteValue
        }
        setData({sites: curSites})

        setEditSiteDetails(false)
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
    }, [props])

    useEffect(() => {

        const validate_sharepoint = () => {
            const {tenantId, clientId} = specific_json
            let missing = []

            if (invalid_credential(tenantId))
                missing.push("Tenant ID")

            if (invalid_credential(clientId))
                missing.push("Client ID")

            return (missing.length > 0) ? `Sharepoint365 Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) props.set_verify(() => validate_sharepoint)

    }, [props.set_verify, specific_json])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {editSiteDetails &&
                <SharepointSiteAndLibraries
                    handleClosed={closeEditForm} siteDetails={currentSiteDetails} setSiteValue={setSiteValue}
                />
            }
            <div className="row mb-4">
                <div className="col-9">
                    <div className="row mb-4">
                        <div className="form-group col-6">
                            <label className="small required">Tenant ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   autoFocus={true}
                                   value={specific_json.tenantId}
                                   onChange={(event) => {
                                       setData({tenantId: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-6">
                            <label className="small required">Client ID</label>
                            <input type="text" className="form-control"
                                   placeholder=""
                                   value={specific_json.clientId}
                                   onChange={(event) => {
                                       setData({clientId: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="form-group col-12">
                            <SensitiveCredential
                                selected_source={selected_source}
                                specific_json={specific_json.clientSecret}
                                onChange={(event) => {
                                    setData({clientSecret: event.target.value})
                                }}
                                name="Client Secret"
                                required={!source_saved}
                            />
                        </div>
                    </div>
                    <div className="row border-top pt-4">
                        <div className="col-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox"
                                       checked={specific_json.crawlAllSites}
                                       onChange={(event) => {
                                           setData({crawlAllSites: event.target.checked});
                                       }}
                                       title="Crawl all sites"/>
                                <label className="form-check-label small">Crawl all SharePoint sites</label>
                            </div>

                        </div>

                    </div>
                    {!specific_json.crawlAllSites &&
                        <div className="row mb-4">
                            <div className="form-group col-12">
                                &nbsp;
                            </div>
                            <div className={"drive_row col-12"}>
                                <div className={"col-4 small text-black-50"}>
                                    Site Name
                                </div>
                                <div className={"col-6 small text-black-50"}>Libraries</div>
                                <div className={"col-2 small text-black-50"}>
                                    <button className="btn text-primary btn-sm fw-500"
                                            onClick={(e) => {
                                                setCurrentSiteRow(-1)
                                                setCurrentSiteDetails({
                                                    siteName: "",
                                                    libraryCsv: ""
                                                })
                                                setEditSiteDetails(true)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                    >+ Add Site
                                    </button>
                                </div>
                            </div>
                            <div className={"gdrive-drives-scroll-section"}>
                                {getSites().map((site, index) => {
                                    return <div className={"drive_row col-12"}>
                                        <div className={"col-4"}>
                                            <div>{site.siteName}</div>
                                        </div>
                                        <div className={"col-6"}>
                                            {site && site.libraryCsv.trim().length === 0 &&
                                                <span className={"fst-italic fw-lighter"}>All</span>}
                                            {site && site.libraryCsv.trim().length > 0 &&
                                                <span>{site.libraryCsv.trim()}</span>}
                                        </div>
                                        <div className={"col-2"}>
                                            <button className="btn text-primary btn-sm" onClick={(e) => {
                                                editSite(index);
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }}>Edit
                                            </button>
                                            <button className="btn text-primary btn-sm" onClick={(e) => {
                                                removeSite(index);
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }}>Remove
                                            </button>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    }
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.SHAREPOINT365} id="dlsharepoint" target="_blank" rel="noreferrer"
                       title="Download the SimSage Sharepoint365 setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>Sharepoint 365 <br/>Setup Guide
                    </a>
                </div>
            </div>

        </div>
    )
}