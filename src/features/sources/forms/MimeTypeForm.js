import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";
import {Pagination} from "../../../common/pagination";
import Api from "../../../common/api";

export default function MimeTypeForm(props) {

    //const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)

    const page_size = props.page_size ? props.page_size : 5;
    const selected_organisation_id = props.organisation_id;
    const session_id = session.id;
    const included_mode = props.included_mode === true;

    const [active_page, setActivePage] = useState(0)
    const [active_filter, setActiveFilter] = useState('')
    const [initialized, setInitialized] = useState(false)
    const [mime_type_list, setMimeTypeList] = useState([])
    const [custom_mime_type, setCustomMimeType] = useState('')

    // set initial active group
    useEffect(() => {
        if (!initialized) {
            let mime_type_list = []
            for (const mime_type of props.mime_type_list) {
                if (mime_type && mime_type.length > 0) {
                    mime_type_list.push(mime_type)
                }
            }
            setMimeTypeList(mime_type_list)
            setInitialized(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mime_type_list, initialized, selected_organisation_id, session_id, active_page, active_filter]);


    function setFilter1(e, text) {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        } else if (text !== null) {
            setActiveFilter(text)
            setActivePage(0)
        }
    }

    function clearFilter1() {
        setActiveFilter('')
        setActivePage(0)
    }

    function setCustomMimeType1(e, text) {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        } else if (text !== null) {
            setCustomMimeType(text)
        }
    }

    function removeMimeType(mime_type) {
        let new_list = JSON.parse(JSON.stringify(mime_type_list))
        const index = new_list.indexOf(mime_type)
        if (index >= 0) {
            new_list.splice(index, 1)
            setMimeTypeList(new_list)
            if (props.on_update)
                props.on_update(new_list)
        }
    }

    const add_to_mime_type_list = (list) => {
        let new_list = JSON.parse(JSON.stringify(mime_type_list))
        list
            .forEach(mime_type => {
                if (new_list.indexOf(mime_type) === -1) {
                    new_list.push(mime_type)
                }
            })
        setMimeTypeList(new_list)
        if (props.on_update)
            props.on_update(new_list)
    }

    const add_custom_type = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let cmt = custom_mime_type.toLowerCase().trim()
        if (cmt.startsWith('.')) {
            cmt = cmt.substring(1).trim()
        }
        if (Api.file_type_to_mime_type[cmt] !== undefined) {
            add_to_mime_type_list(Api.file_type_to_mime_type[cmt])
            setCustomMimeType('')
        }
        else if (cmt.length > 2 && cmt.indexOf('/') > 1) {
            add_to_mime_type_list([cmt])
            setCustomMimeType('')
        }
    }

    const add_video = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        add_to_mime_type_list(Api.video_mime_type_list)
    }

    const add_audio = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        add_to_mime_type_list(Api.audio_mime_type_list)
    }

    const add_images = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        add_to_mime_type_list(Api.image_mime_type_list)
    }

    const add_office = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        add_to_mime_type_list(Api.office_mime_type_list)
    }

    const clear_all = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setMimeTypeList([])
        setActivePage(0)
        if (props.on_update)
            props.on_update([])
    }

    const get_filtered_mime_type_list_2 = () => {
        const af = active_filter.trim().toLowerCase()
        return mime_type_list.filter((mime_type) => {
            return af.length === 0 || mime_type.indexOf(af) >= 0
        })
    }

    const get_filtered_mime_type_list = () => {
        let list = []
        const start = active_page * page_size
        const end = start + page_size
        let filtered_list = get_filtered_mime_type_list_2()
        filtered_list = filtered_list.sort()
        for (const i in filtered_list) {
            if (i >= start && i < end) {
                list.push(filtered_list[i])
            }
        }
        return list
    }

    const pretty = (str) => {
        if (str.length > 55)
            return str.substring(0, 55) + " ..."
        return str
    }

    return (
        <div className="row pb-5">
            <div className="role-block col-6">
                <h6 className={"role-label text-center" + (included_mode ? " required" : "")} title={included_mode ? "included mode requires at least one mime-type to be added to the list" : ""}>
                    {included_mode ? "Included MimeTypes" : "Excluded MimeTypes"}
                </h6>
                <div className="role-area border rounded h-100">
                    <div className='mb-3 w-100 border-0 border-bottom d-flex align-items-center'>
                        <input type="text" className="filter-text w-100 px-2 py-2 border-0" placeholder="Filter..."
                               value={active_filter}
                               onKeyDown={(event) => setFilter1(event, null)}
                               onChange={(event) => setFilter1(event, event.target.value)}/>
                        <span className="clear px-3" title="clear filter" onClick={() => clearFilter1()}>&times;</span>
                    </div>
                    {
                        get_filtered_mime_type_list().map((mime_type, i) => {
                            return (<div key={i} className="role-chip d-flex justify-content-between align-items-center"
                                         title={"mimetype " + mime_type}>
                                    <span className="w-100" onClick={() => removeMimeType(mime_type)}>
                                        <span className="user-group-image-box" title={mime_type}><img className="user-group-image me-3"
                                                                                    src={"images/mimetype.svg"}
                                                                                    alt="group"/></span><span>{pretty(mime_type)}</span>
                                    </span>
                            </div>)
                        })
                    }
                </div>
                <Pagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={get_filtered_mime_type_list_2().length}
                    rowsPerPage={page_size}
                    page={active_page}
                    backIconButtonProps={{'aria-label': 'Previous Page',}}
                    nextIconButtonProps={{'aria-label': 'Next Page',}}
                    onChangePage={(page) => setActivePage(page)}
                />
            </div>

            <div className="role-block col-6">
                <div className='ms-5 mb-2'>
                    <span className="w-50 display-blocking">
                        <button className="btn btn-primary w-50" onClick={(e)=> add_custom_type(e)}>add MimeType or File Extension</button>
                    </span>
                    <span className="ms-2 border-0 border w-50 display-blocking">
                        <input type="text" className="filter-text px-2 py-2" placeholder="mime-type / file-extension"
                               readOnly={false}
                               value={custom_mime_type}
                               onKeyDown={(event) => setCustomMimeType1(event, null)}
                               onChange={(event) => setCustomMimeType1(event, event.target.value)}/>
                    </span>
                </div>
                <div className="ms-5 mb-2"><button className="btn btn-dark w-50" title="add all video mime-types" onClick={(e) => add_video(e)}>add Video Types</button></div>
                <div className="ms-5 mb-2"><button className="btn btn-dark w-50" title="add all audio mime-types" onClick={(e) => add_audio(e)}>add Audio Types</button></div>
                <div className="ms-5 mb-2"><button className="btn btn-dark w-50" title="add all office mime-types" onClick={(e) => add_office(e)}>add Office Types</button></div>
                <div className="ms-5 mb-2"><button className="btn btn-dark w-50" title="add all image mime-types" onClick={(e) => add_images(e)}>add Image Types</button></div>
                <div className="ms-5 mb-5">
                    <button className="btn btn-primary w-50" title="clear all mime-types" onClick={(e) => clear_all(e)}>
                        {included_mode ? "Clear Included MimeTypes" : "Clear Excluded MimeTypes"}
                    </button>
                </div>
            </div>

        </div>
    )
}
