import React, {useEffect} from "react";
import { useSelectedSource } from './common.js';


export default function CrawlerMetadataForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const is_xml_crawler = selected_source && selected_source.crawlerType === 'xml';


    const data_type_list = [
        "none",
        "string",
        "long",
    ];

    const empty_metadata_mapper_item = {"dataType": "none", "extMetadata": "", "metadata": "", "display": ""};


    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    function get_md_list() {
        let md_list = (specific_json && specific_json.metadata_list && specific_json.metadata_list.length > 0) ?
            specific_json.metadata_list : [];
        if (typeof md_list === 'string' || md_list instanceof String) {
            try {
                md_list = JSON.parse(md_list);
            } catch (e) {
                md_list = [];
            }
        }
        if (!is_xml_crawler) {
            for (let item of md_list) {
                item.readonly = (
                    (item.metadata === "last-modified" || item.metadata === "created" || item.metadata === "document-type" || item.metadata === "{hashtag}") &&
                    !source_saved && !is_xml_crawler
                );
                if (item.metadata === "last-modified") {
                    item.dataType = "long";
                    item.extMetadata = "last-modified";
                    item.display = "last modified"
                } else if (item.metadata === "created") {
                    item.dataType = "long";
                    item.extMetadata = "created";
                    item.display = "created"
                } else if (item.metadata === "document-type") {
                    item.dataType = "string";
                    item.extMetadata = "document-type";
                    item.display = "document type"
                }
            }
        }
        return md_list;
    }


    function addNewMetadataMapping() {
        const md_list = get_md_list();
        md_list.push(JSON.parse(JSON.stringify(empty_metadata_mapper_item))); // add a copy
        setSpecificJson({...specific_json, metadata_list: md_list})
    }


    function delete_metadata_item(index) {
        const md_list = [];
        const i_index = '' + index
        const existing_md_list = get_md_list();
        for (let i in existing_md_list) {
            if (i !== i_index) {
                if (existing_md_list.hasOwnProperty(i))
                    md_list.push(existing_md_list[i]);
            }
        }
        setSpecificJson({...specific_json, metadata_list: md_list})
    }


    function check_metadata_name(event) {
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


    function setDataType(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].dataType = value;
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setMetadata(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].metadata = value;
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setExtMetadata(record, index, value) {
        const md_list = get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].extMetadata = value;
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
        <div className="px-5 py-4" style={{ maxHeight: "600px", overflow:"auto"}}>

            <div className="row mb-3">
                <div className="col-6 d-flex">
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
                    <td className="small text-black-50 px-4 metadata-column">data-type</td>
                    <td className="small text-black-50 px-4 display-column">UI Display-name (optional)</td>
                    <td className="small text-black-50 px-4 metadata-field-column">SimSage Metadata name</td>
                    <td className="small text-black-50 px-4 sort-field-column">Source metadata name</td>
                    <td className="small text-black-50 px-4 action-field-column"></td>
                </tr>
                </thead>

                <tbody>
                {
                    get_md_list().map((md, index) => {
                        const help_text = (md.readonly ? "SimSage default.  Not editable." : "");
                        return (<tr key={index} title={help_text}>

                            <td className="px-0">
                                <div className="d-flex">
                                    <div className="d-flex flex-column justify-content-center">
                                    </div>
                                </div>
                            </td>
                            <td className="pt-3 pe-0 pb-3">
                                <div className="w-100">
                                    <select className="form-select text-capitalize" onChange={(event) => {
                                        setDataType(md, index, event.target.value)
                                    }}
                                            defaultValue={md.dataType}
                                            disabled={md.readonly}
                                            aria-label="the data-type of the metadata to be mapped">
                                        {
                                            data_type_list.map((value, j) => {
                                                return (<option key={j} value={value}>{value}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                            </td>

                            <td className="pt-3 ps-4 pe-0 pb-3">
                                {
                                    <span>
                                        <input type="text"
                                               className="theme form-control"
                                               readOnly={md.readonly}
                                               disabled={md.readonly}
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
                                    <div className="">
                                        <input type="text"
                                               className="theme form-control"
                                               readOnly={md.readonly}
                                               disabled={md.readonly}
                                               placeholder="Metadata name"
                                               value={md.metadata}
                                               title="SimSage metadata names should only contain 0..9, a..z, and A..Z"
                                               onKeyDown={(event) => {
                                                   return check_metadata_name(event)
                                               }}
                                               onChange={(event) => {
                                                   setMetadata(md, index, event.target.value)
                                               }}/>
                                    </div>
                                }
                            </td>

                            <td className="pt-3 ps-4 pe-0 pb-3">
                                {
                                    <div className="">
                                        <input type="text"
                                               className="theme form-control"
                                               readOnly={md.readonly}
                                               disabled={md.readonly}
                                               placeholder="Source metadata name"
                                               value={md.extMetadata}
                                               title="the source's own metadata name to map"
                                               onChange={(event) => {
                                                   setExtMetadata(md, index, event.target.value)
                                               }}/>
                                    </div>
                                }
                            </td>

                            <td className="pt-3 ps-4 pe-0 pb-3">
                            </td>

                            <td className="pt-3 px-4 pb-0">
                                <div className="link-button d-flex justify-content-end">
                                    <button onClick={() => delete_metadata_item(index)} type="button"
                                            className="btn text-danger btn-sm" title="remove this metadata mapping"
                                            disabled={md.readonly}
                                            data-bs-dismiss="modal">Delete
                                    </button>
                                </div>
                            </td>

                        </tr>)
                    })
                }
                </tbody>
            </table>
        </div>
    )
}