import React, {useEffect, useState} from "react";

export default function CrawlerMetadataForm(props) {

    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const num_rows = get_md_list().length;
    const l_form_data = props.form_data;


    const metadata_list = [
        {
            "key": "none",
            "display": null,
            "metadata": null,
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "author list",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "created date range",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "false",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "last modified date ranges",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "false",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "document type",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "people list",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "hashtag list",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "location list",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "money range",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "false",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
        {
            "key": "number range",
            "display": "",
            "metadata": "",
            "db1": "",
            "db2": "",
            "sort": "false",
            "sortDefault": "",
            "sortAscText": "",
            "sortDescText": "",
            "sourceId": 0,
            "fieldOrder": 0
        },
    ];


    useEffect(()=>{
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
    },[specific_json])



    function set_md_type(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            let match_item = null;
            for (const item of metadata_list) {
                if (item.key === value) {
                    match_item = item;
                    break;
                }
            }
            if (match_item != null) {
                md_list[index] = JSON.parse(JSON.stringify(match_item));
                setSpecificJson({...specific_json, metadata_list: md_list})
            }
        }
    }


    //functions
    function get_md_list() {
        return specific_json && specific_json.metadata_list ? specific_json.metadata_list : [];
    }


    function addNewMetadataMapping() {
        const md_list = get_md_list();
        md_list.push(JSON.parse(JSON.stringify(metadata_list[0]))); // add a copy of item 0
        setSpecificJson({...specific_json, metadata_list: md_list})
    }


    function deleteMetadataItem(index) {
        const md_list = [];
        const i_index = '' + index
        const existing_md_list = get_md_list();
        for (let i in existing_md_list) {
            if (i !== i_index) {
                if (existing_md_list.hasOwnProperty(i))
                    md_list.push(existing_md_list[i]);
            }
        }

        setSpecificJson({...specific_json, metadata_list: existing_md_list})
    }


    function move_row_up(md, index) {
        if (index > 0) {
            const md_list = get_md_list();
            const temp = md_list[index - 1];
            md_list[index - 1] = md;
            md_list[index] = temp;

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function move_row_down(md, index) {
        const md_list = get_md_list();
        if (index + 1 < md_list.length) {
            const temp = md_list[index + 1];
            md_list[index + 1] = md;
            md_list[index] = temp;

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setDefaultSort(record, index, direction, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].sortDefault = (value ? direction : "");
            for (const i in md_list) {
                if ("" + i !== "" + index && md_list.hasOwnProperty(i)) {
                    md_list[i].sortDefault = "";
                }
            }

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setSort(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].sort = value ? "true" : "false";

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function needs_metadata_field(md) {
        return (md.metadata !== null);
    }

    function checkMetadataName(event) {
        // only allow valid characters to propagate for metadata names
        if ((event.key >= 'a' && event.key <= 'z') ||
            (event.key >= 'A' && event.key <= 'Z') ||
            (event.key >= '0' && event.key <= '9') || event.key === '-') {
            return true;
        } else {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }


    function setUserMetadataName1(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].metadata = value;

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setValue(record, index, field_name, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index][field_name] = value;

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setDisplayName(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].display = value;

            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    if (form_error) {
        return <h1>crawler metadata: Something went wrong.</h1>;
    } else {
        return (
            <div className="px-5 py-4" style={{maxHeight: "600px"}}>

                {/* <div className="instructions-label">All rows in order of UI. Use 'actions' arrows to re-arrange existing
                    rows.
                </div> */}
                <div className="row mb-3">
                    <div className="col-6 d-flex">
                        <div class="alert alert-warning small py-2" role="alert">
                            All rows in order of UI. Use 'actions' arrows to re-arrange existing rows.
                        </div>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div>
                            <button onClick={addNewMetadataMapping} type="button" className="btn btn-primary btn-small"
                                    title="+ Add Metadata Mapping"
                                    data-bs-dismiss="modal">+ Add Metadata Mapping
                            </button>
                        </div>
                    </div>
                </div>

                <table className="table w-100">

                    <thead>
                    <tr className='table-header'>
                        <td className="small text-black-50 px-4 metadata-column">Data-type</td>
                        <td className="small text-black-50 px-4 display-column">UI Display-name</td>
                        <td className="small text-black-50 px-4 metadata-field-column">Metadata name</td>
                        <td className="small text-black-50 px-4 sort-field-column">Sortable</td>
                        <td className="small text-black-50 px-4 action-field-column"></td>
                    </tr>
                    </thead>

                    <tbody>
                    {/* <tr>
                        <td colSpan={5}>&nbsp;</td>
                    </tr> */}

                    {
                        get_md_list().map(function (md, index) {
                            return (<tr key={index}>

                                <td className="pt-3 ps-4 pe-0 pb-3">
                                    <select className="form-select text-capitalize" onChange={(event) => {
                                        set_md_type(md, index, event.target.value)
                                    }}
                                            defaultValue={md.key}
                                            aria-label="select what kind of metadata field to use">
                                        {
                                            metadata_list.map((value, j) => {
                                                return (<option key={j} value={value.key}>{value.key}</option>)
                                            })
                                        }
                                    </select>
                                </td>

                                <td className="pt-3 ps-4 pe-0 pb-3">
                                    {
                                        md.display !== null &&
                                        <span>
                                            <input type="text"
                                                   className="theme form-control"
                                                   placeholder="UI display-name"
                                                   title="name displayed in the UI for this item"
                                                   value={md.display}
                                                   onChange={(event) => {
                                                       setDisplayName(md, index, event.target.value)
                                                   }}/>
                                        </span>
                                    }
                                </td>


                                <td className="pt-3 ps-4 pe-0 pb-3">
                                    {
                                        needs_metadata_field(md) &&
                                        <div className="">
                                            <input type="text"
                                                   className="theme form-control"
                                                   placeholder="Metadata name"
                                                   value={md.metadata}
                                                   title="metadata names should only contain 0..9, a..z, and A..Z"
                                                   onKeyDown={(event) => {
                                                       return checkMetadataName(event)
                                                   }}
                                                   onChange={(event) => {
                                                       setUserMetadataName1(md, index, event.target.value)
                                                   }}/>
                                        </div>
                                    }
                                    {md.sort === "true" &&
                                        <div className="d-flex align-items-center mt-1">
                                            <input type="text"
                                                   placeholder="Sort descending UI text"
                                                   className="theme form-control"
                                                   value={md.sortDescText}
                                                   title="The text to display for this field if a descending sort is selected of this type"
                                                   onChange={(event) => {
                                                       setValue(md, index, "sortDescText", event.target.value)
                                                   }}/>
                                            {/* <div className=""
                                                title="Set this descending field as the default sort field for the UI">
                                                <input type="checkbox"
                                                    checked={md.sortDefault === "desc"}
                                                    onChange={(event) => {
                                                        setDefaultSort(md, index, "desc", event.target.checked);
                                                    }}
                                                />
                                            </div> */}
                                        </div>
                                    }
                                    {md.sort === "true" &&
                                        <div className="d-flex align-items-center mt-1">
                                            <input type="text"
                                                   className="theme form-control"
                                                   placeholder="Sort ascending UI text"
                                                   value={md.sortAscText}
                                                   title="The text to display for this field if an ascending sort is selected of this type"
                                                   onChange={(event) => {
                                                       setValue(md, index, "sortAscText", event.target.value)
                                                   }}/>
                                            {/* <div className=""
                                                title="Set this ascending field as the default sort field for the UI">
                                                <input type="checkbox"
                                                   checked={md.sortDefault === "asc"}
                                                   onChange={(event) => {
                                                       setDefaultSort(md, index, "asc", event.target.checked);
                                                   }}
                                            />
                                            </div>        */}
                                        </div>
                                    }
                                </td>

                                <td className="pt-3 ps-4 pe-0 pb-3">
                                    {md.sort !== "" &&
                                        // <div className=""
                                        //      title="enable this category as an item used for sorting in the UI">
                                        //     <input type="checkbox"
                                        //            checked={md.sort === "true"}
                                        //            onChange={(event) => {
                                        //                setSort(md, index, event.target.checked);
                                        //            }}
                                        //            value="enable result sorting over this field?"
                                        //     />
                                        //     <span className="sort-label"> sort</span>
                                        // </div>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input" title="Enable this category as an item used for sorting in the UI" value="Enable result sorting over this field?" type="checkbox" checked={md.sort === "true"}
                                                   onChange={(event) => {
                                                       setSort(md, index, event.target.checked);
                                                   }}/>
                                            {/* <label className="form-check-label" for="enableKnowledgeBase">Knowledge Base</label> */}
                                        </div>
                                    }
                                    {md.sort === "true" &&
                                        <div className=""
                                             title="Set this descending field as the default sort field for the UI">
                                            {'\u2190'}
                                            <input type="checkbox"
                                                   checked={md.sortDefault === "desc"}
                                                   onChange={(event) => {
                                                       setDefaultSort(md, index, "desc", event.target.checked);
                                                   }}
                                            />
                                        </div>
                                    }

                                    {md.sort === "true" &&
                                        <div className=""
                                             title="Set this ascending field as the default sort field for the UI">
                                            {'\u2190'}
                                            <input type="checkbox"
                                                   checked={md.sortDefault === "asc"}
                                                   onChange={(event) => {
                                                       setDefaultSort(md, index, "asc", event.target.checked);
                                                   }}
                                            />
                                        </div>
                                    }
                                </td>

                                <td className="pt-3 px-4 pb-0">
                                    <div className="link-button d-flex justify-content-end">
                                        <button onClick={() => deleteMetadataItem(index)} type="button"
                                                className="btn text-danger btn-sm" title="remove this metadata mapping"
                                                data-bs-dismiss="modal">Delete
                                        </button>
                                    </div>

                                    {/*<span className="delete-box" onClick={() => deleteMetadataItem(index)} title="remove this metadata item">*/}
                                    {/*    <img src={theme === 'light' ? "../images/delete.svg" : "../images/delete-dark.svg"} className="image-size" title="remove this metadata mapping" alt="remove this metadata mapping"/>*/}
                                    {/*</span>*/}

                                    {index > 0 &&
                                        <span className="up-arrow" title="move row up (change UI ordering)"
                                              onClick={() => {
                                                  move_row_up(md, index)
                                              }}>&#8679;</span>
                                    }
                                    {index + 1 < num_rows &&
                                        <span className="up-arrow" title="move row down (change UI ordering)"
                                              onClick={() => {
                                                  move_row_down(md, index)
                                              }}>&#8681;</span>
                                    }
                                </td>

                            </tr>)
                        })
                    }


                    {/* <tr>
                        <td colSpan={5} align={"right"}> */}
                            {/*<div className="image-button" onClick={() => this.addNewMetadataMapping()}><img*/}
                            {/*    className="image-size" src={theme === 'light' ? "../images/add.svg" : "../images/add-dark.svg"} title="add new metadata mapping"*/}
                            {/*    alt="add new metadata mapping"/></div>*/}

                            {/* <button onClick={addNewMetadataMapping} type="button" className="btn btn-secondary"
                                    title="add new metadata mapping"
                                    data-bs-dismiss="modal">add new metadata mapping
                            </button> */}

                        {/* </td>
                    </tr> */}


                    </tbody>

                </table>
            </div>
        )
    }


}