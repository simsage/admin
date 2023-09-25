import React, {useEffect, useState} from "react";

export default function CrawlerMetaMapperForm(props) {

    const selected_source = props.source;
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const num_rows = get_md_list().length;
    const l_form_data = props.form_data;
    const source_id = (props.source && props.source.sourceId) ? props.source.sourceId : 0;

    const metadata_list = [
        {"key": "none", "display": null, "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "author", "display": null, "metadata": "{author}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "created", "display": null, "metadata": "{created}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "last modified", "display": null, "metadata": "{lastmod}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "title", "display": null, "metadata": "{title}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "image from binary-blob", "display": null, "metadata": "binary-blob-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "image from base64", "display": null, "metadata": "base64-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "image from url", "display": null, "metadata": "url-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "category", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "two level category", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "number range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "monetary x 100 range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "monetary range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "star rating", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "select if true", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "created date range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "last modified date ranges", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
        {"key": "csv string", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    ];


    useEffect(()=>{
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function set_db(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db1 = value;
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }
    function set_db_extra(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db2 = value;
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }
    //functions
    function get_md_list() {
        return specific_json && specific_json.metadata_list && specific_json.metadata_list.length > 0 ? specific_json.metadata_list : [];
    }


    function addNewMetadataMapping() {
        const md_list = get_md_list();
        md_list.push(JSON.parse(JSON.stringify(metadata_list[0]))); // add a copy of item 0
        setSpecificJson({...specific_json, metadata_list: md_list})
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
        return md && md.key &&
            (   md.key === "category" ||
                md.key === "number range" ||
                md.key === "two level category" ||
                md.key === "monetary x 100 range" ||
                md.key === "monetary range" ||
                md.key === "star rating" ||
                md.key === "created date range" ||
                md.key === "last modified date ranges" ||
                md.key === "select if true" ||
                md.key === "csv string");
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


    return (
        <div className="px-5 py-4" style={{maxHeight: "600px"}}>

            <div className="row mb-3">
                <div className="col-6 d-flex">
                    <div className="alert alert-warning small py-2" role="alert">
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
                    <td className="small text-black-50 px-0"></td>
                    <th className="small text-black-50 px-4 metadata-column">data-type</th>
                    <th className="small text-black-50 px-4 db-field-column">source field</th>
                    <th className="small text-black-50 px-4 display-column">UI display-name</th>
                    <th className="small text-black-50 px-4 metadata-field-column">metadata name</th>
                    <th className="small text-black-50 px-4 sort-field-column">sortable</th>
                    <td className="small text-black-50 px-4 action-field-column"></td>
                </tr>
                </thead>

                <tbody>

                {
                    get_md_list().map(function(md, index) {
                        return (<tr key={index}>
                            <td className="px-0">
                                <div className="d-flex">
                                    <div className="d-flex flex-column justify-content-center">
                                        {index > 0 &&
                                            <button className="up-arrow btn btn-white py-0" title="move row up (change UI ordering)"
                                                    onClick={() => {
                                                        move_row_up(md, index)
                                                    }}>&#9651;</button>
                                        }
                                        {index + 1 < num_rows &&
                                            <button className="up-arrow btn btn-white py-0" title="move row down (change UI ordering)"
                                                    onClick={() => {
                                                        move_row_down(md, index)
                                                    }}>&#9661;</button>
                                        }
                                    </div>
                                </div>
                            </td>


                            <td className="pt-3 pe-0 pb-3">
                                <div className="w-100">
                                <select className="form-select metadata-field-column" onChange={(event) => { set_md_type(md, index, event.target.value) }}
                                        disabled={("" + source_id) !== "0"} aria-label="select what kind of metadata field to use"
                                        defaultValue={md.key}>
                                    {
                                        metadata_list.map((value, j) => {
                                            return (<option key={j} value={value.key}>{value.key}</option>)
                                        })
                                    }
                                </select>
                                </div>
                            </td>

                            {md.key !== "two level category" &&
                                <td className="db-field-column">
                                    <input type="text"
                                           className="theme source-field-width"
                                           placeholder="source [field-name]"
                                           title="the source-name field to use for this category"
                                           value={md.db1}
                                           onChange={(event) => {
                                               set_db(md, index, event.target.value)
                                           }}
                                    />
                                </td>
                            }

                            {md.key === "two level category" &&
                                <td className="db-field-column">
                                    <input type="text"
                                           placeholder="level 1 [field-name]"
                                           className="theme source-field-width"
                                           value={md.db1}
                                           title="the first source field to use for this double category"
                                           onChange={(event) => {
                                               set_db(md, index, event.target.value)
                                           }}
                                    />
                                    <input type="text"
                                           placeholder="level 2 [field-name]"
                                           className="theme source-field-width"
                                           value={md.db2}
                                           title="the second source field to use for this double category"
                                           onChange={(event) => {
                                               set_db_extra(md, index, event.target.value)
                                           }}
                                    />
                                </td>
                            }


                            <td className="td-display-column">
                                {
                                    md.display !== null &&
                                    <span>
                                        <input type="text"
                                               className="theme metadata-text"
                                               placeholder="UI display-name"
                                               title="name displayed in the UI for this item"
                                               value={md.display}
                                               onChange={(event) => {setDisplayName(md, index, event.target.value)}}  />
                                    </span>
                                }
                            </td>


                            <td className="td-align-top">
                                {
                                    needs_metadata_field(md) &&
                                    <div className="td-md-field-width">
                                        <input type="text"
                                               className="theme metadata-text"
                                               placeholder="metadata name"
                                               value={md.metadata}
                                               title="metadata names should only contain 0..9, a..z, and A..Z"
                                               onKeyDown={(event) => {return checkMetadataName(event)}}
                                               onChange={(event) => {setUserMetadataName1(md, index, event.target.value)}}  />
                                    </div>
                                }
                                { md.sort === "true" &&
                                    <div>
                                        <input type="text"
                                               className="theme metadata-text"
                                               placeholder="sort descending UI text"
                                               value={md.sortDescText}
                                               title="The text to display for this field if a descending sort is selected of this type"
                                               onChange={(event) => {setValue(md, index, "sortDescText", event.target.value)}}  />
                                    </div>
                                }
                                { md.sort === "true" &&
                                    <div>
                                        <input type="text"
                                               className="theme metadata-text"
                                               placeholder="sort ascending UI text"
                                               value={md.sortAscText}
                                               title="The text to display for this field if an ascending sort is selected of this type"
                                               onChange={(event) => {setValue(md, index, "sortAscText", event.target.value)}}  />
                                    </div>
                                }
                                {md.sort === "true" &&
                                    <br />
                                }
                            </td>

                            <td className="td-align-top">
                                {md.sort !== "" &&
                                    <div className="td-sort-2" title="enable this category as an item used for sorting in the UI">
                                        <input type="checkbox"
                                               checked={md.sort === "true"}
                                               onChange={(event) => {
                                                   setSort(md, index, event.target.checked);
                                               }}
                                               title="enable result sorting over this field?"
                                        />
                                    </div>
                                }
                                {md.sort === "true" &&
                                    <div className="td-sort-2" title="set this descending field as the default sort field for the UI">
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
                                    <div className="td-sort-2" title="set this ascending field as the default sort field for the UI">
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

                            {/*<td className="td-action">*/}
                            {/*    <button onClick={() => deleteMetadataItem(index)} type="button"*/}
                            {/*            className="btn btn-secondary" title="remove this metadata mapping"*/}
                            {/*            data-bs-dismiss="modal">remove*/}
                            {/*    </button>*/}
                            {/*    /!*<span className="delete-box" onClick={() => deleteMetadataItem(index)} title="remove this metadata item">*!/*/}
                            {/*    /!*    <img src={theme === 'light' ? "images/delete.svg" : "images/delete-dark.svg"} className="image-size" title="remove this metadata mapping" alt="remove this metadata mapping"/>*!/*/}
                            {/*    /!*</span>*!/*/}
                            {/*    {index > 0 &&*/}
                            {/*        <span className="up-arrow" title="move row up (change UI ordering)"*/}
                            {/*              onClick={() => {*/}
                            {/*                  move_row_up(md, index)*/}
                            {/*              }}>&#8679;</span>*/}
                            {/*    }*/}
                            {/*    {index + 1 < num_rows &&*/}
                            {/*        <span className="up-arrow" title="move row down (change UI ordering)"*/}
                            {/*              onClick={() => {*/}
                            {/*                  move_row_down(md, index)*/}
                            {/*              }}>&#8681;</span>*/}
                            {/*    }*/}
                            {/*</td>*/}

                        </tr>)
                    })
                }

                {/*<tr>*/}
                {/*    <td colSpan={6}>&nbsp;</td>*/}
                {/*</tr>*/}

                {/*<tr>*/}
                {/*    <td colSpan={6} align={"right"}>*/}
                {/*        /!*<div className="image-button" onClick={() => addNewMetadataMapping()}><img*!/*/}
                {/*        /!*    className="image-size" src={theme === 'light' ? "images/add.svg" : "images/add-dark.svg"} title="add new metadata mapping"*!/*/}
                {/*        /!*    alt="add new metadata mapping"/></div>*!/*/}
                {/*        <button onClick={addNewMetadataMapping} type="button" className="btn btn-secondary"*/}
                {/*                title="add new metadata mapping"*/}
                {/*                data-bs-dismiss="modal">add new metadata mapping*/}
                {/*        </button>*/}
                {/*    </td>*/}
                {/*</tr>*/}

                <tr>
                    <td colSpan={6}>&nbsp;</td>
                </tr>

                </tbody>

            </table>
        </div>
    )

}