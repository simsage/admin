import React, {useEffect, useState} from "react";
import {BsFilePdf} from 'react-icons/bs'
import SensitiveCredential from "../../../components/SensitiveCredential";
import {OneDriveUserAndLibraries} from "./OneDriveUserAndLibraries";
import {DOCUMENTATION, useSelectedSource} from "./common";

export default function CrawlerOneDriveForm(props) {


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

    const [editDriveUser, setEditDriveUser] = useState(false)
    const [currentDriveUser, setCurrentDriveUser] = useState({isGroup: false, libraryCsv: "", driveUser: " "})
    const [currentRow, setCurrentRow] = useState(-1)

    const getDriveUsers = () => {
        if (specific_json && specific_json.driveUsers) {
            return specific_json.driveUsers
        } else return []
    }
    const editDriveUsers = (index) => {
        const curAllSites = specific_json.driveUsers ? specific_json.driveUsers : []
        setCurrentRow(index)
        setCurrentDriveUser(curAllSites[index])
        setEditDriveUser(true)
    }

    const removeSiteUser = (index) => {
        const curAllSites = specific_json.driveUsers ? specific_json.driveUsers : []
        curAllSites.splice(index, 1)
        setData({sites: curAllSites})
    }

    const closeEditForm = (e) => {
        setEditDriveUser(false)
        e.preventDefault()
    }

    const setDriveUser = (siteValue) => {
        const driveUsers = specific_json.driveUsers ? specific_json.driveUsers : []
        if (currentRow === -1) {
            driveUsers.push(siteValue)
        } else {
            driveUsers[currentRow] = siteValue
        }
        setData({driveUsers: driveUsers})

        setEditDriveUser(false)
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {editDriveUser &&
                <OneDriveUserAndLibraries handleClosed={closeEditForm} driveDetails={currentDriveUser}
                                          setDriveValue={setDriveUser}/>}
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
                                       checked={specific_json.crawlAllUsers}
                                       onChange={(event) => {
                                           setData({crawlAllUsers: event.target.checked});
                                       }}
                                       title="Crawl all users"/>
                                <label className="form-check-label small">Crawl all User Drives</label>
                            </div>

                        </div>

                    </div>
                    {!specific_json.crawlAllUsers &&
                        <div className="row mb-4">
                            <div className="form-group col-12">
                                &nbsp;
                            </div>
                            <div className={"drive_row col-12"}>
                                <div className={"col-4 small text-black-50"}>
                                    User / Group
                                </div>
                                <div className={"col-6 small text-black-50"}>Libraries</div>
                                <div className={"col-2 small text-black-50"}>
                                    <button className="btn text-primary btn-sm fw-500"
                                            onClick={(e) => {
                                                setCurrentRow(-1)
                                                setCurrentDriveUser({
                                                    siteName: "",
                                                    libraryCsv: ""
                                                })
                                                setEditDriveUser(true)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                    >+ Add User / Group
                                    </button>
                                </div>
                            </div>
                            <div className={"gdrive-drives-scroll-section"}>
                                {getDriveUsers().map((site, index) => {
                                    return <div className={"drive_row col-12"}>
                                        <div className={"col-4"}>
                                            <div>{site.driveUser}</div>
                                        </div>
                                        <div className={"col-6"}>
                                            {site && (!site.libraryCsv || site.libraryCsv.trim().length === 0) &&
                                                <span className={"fst-italic fw-lighter"}>All</span>}
                                            {site && site.libraryCsv && site.libraryCsv.trim().length > 0 &&
                                                <span>{site.libraryCsv.trim()}</span>}
                                        </div>
                                        <div className={"col-2"}>
                                            <button className="btn text-primary btn-sm" onClick={(e) => {
                                                editDriveUsers(index);
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }}>Edit
                                            </button>
                                            <button className="btn text-primary btn-sm" onClick={(e) => {
                                                removeSiteUser(index);
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
                    <a href={DOCUMENTATION.ONE_DRIVE} id="dlsharepoint" target="_blank"
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