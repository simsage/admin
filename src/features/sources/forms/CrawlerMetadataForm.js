import React, {useEffect} from "react";
import {useSelectedSource} from './common.js';
import CustomSelect from "../../../components/CustomSelect";

const metadata_source_list = [
    {key: "none", value: "none"},
    {key: "title", value: "title"},
    {key: "url", value: "url / id"},
    {key: "author", value: "author"}
]

const metadata_destination_list = [
    {key: "none", value: "none"},
    {key: "title", value: "title"},
    {key: "author", value: "author"},
    {key: "body", value: "document content"}
]

const add_text_list = [
    { key: "after", value: "after" },
    { key: "before", value: "before" },
    { key: "replace", value: "replace" }
]


export default function CrawlerMetadataForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props)

    const is_xml_crawler = selected_source && selected_source.crawlerType === 'xml'
    const empty_metadata_mapper_item = {"extMetadata": "", "metadata": "", "display": ""}
    const empty_transform = {source: 'none', destination: 'none', text_action: 'after', text: '', regex: ''}

    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    function get_transform_list() {
        return (specific_json && specific_json.transform_list && specific_json.transform_list.length > 0) ?
            specific_json.transform_list : [];
    }

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
                    item.extMetadata = "last-modified";
                    item.display = "last modified"
                } else if (item.metadata === "created") {
                    item.extMetadata = "created";
                    item.display = "created"
                } else if (item.metadata === "document-type") {
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
        const validChars = /^[a-zA-Z0-9-]+$/;
        if (validChars.test(event.key)) {
            return true;
        } else {
            event.preventDefault();
            event.stopPropagation();
            return false;
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
        const md_list = get_md_list()
        if (index >= 0 && index < md_list.length) {
            md_list[index].extMetadata = value
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }


    function setDisplayName(record, index, value) {
        const md_list = get_md_list()
        if (index >= 0 && index < md_list.length) {
            md_list[index].display = value
            setSpecificJson({...specific_json, metadata_list: md_list})
        }
    }

    function setTransform(index, value) {
        const transform_list = get_transform_list()
        if (index >= 0 && index >= transform_list.length) {
            transform_list.push(empty_transform)
        }
        transform_list[index] = {...transform_list[index], ...value}
        setSpecificJson({...specific_json, transform_list: transform_list})
    }

    function getTransform(index) {
        const transform_list = get_transform_list()
        if (index >= 0 && index >= transform_list.length) {
            transform_list.push(empty_transform)
        }
        return transform_list[0]
    }

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props.set_verify])

    return (
        <div className="px-5 py-4" style={{maxHeight: "600px", overflow: "auto"}}>

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

            <div className="row mt-4">
                <div className="form-group col-12">
                    <label className="small bi-arrow-left-right">&nbsp;Metadata Transform  (optional)</label>
                </div>
            </div>
            <div className="row mt-4">
                <div className="form-group col-2">
                    <label className="small">Metadata Source</label>
                    <CustomSelect
                        options={metadata_source_list}
                        defaultValue={getTransform(0).source}
                        onChange={(value) => setTransform(0, { source: value })}
                        autoFocus={false}
                        className="form-select"
                    />
                </div>
                <div className="form-group col-2">
                    <label className="small">Metadata Destination</label>
                    <CustomSelect
                        options={metadata_destination_list}
                        defaultValue={getTransform(0).destination}
                        onChange={(event) => setTransform(0, {destination: event})}
                        autoFocus={false}
                        className="form-select"
                    />
                </div>

                <div className="form-group col-8">
                    <label className="small">Matching Regular Expression</label>
                    <input type="text"
                           className="theme form-control"
                           placeholder='regex, e.g. "http(s)?:\/\/domain.com\/(?<param>.*)\/'
                           value={getTransform(0).regex}
                           title="the regular expression to apply"
                           onChange={(event) => {
                               setTransform(0, {regex: event.target.value})
                           }}/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="form-group col-2">
                    <label className="small">Action</label>
                    <CustomSelect
                        options={add_text_list}
                        defaultValue={getTransform(0).text_action}
                        onChange={(value) => setTransform(0, { text_action: value })}
                        autoFocus={false}
                        className="form-select"
                    />
                </div>

                <div className="form-group col-10">
                    <label className="small">{"the Text (including regex <group> names in diamond brackets)"}</label>
                    <input type="text"
                           className="theme form-control"
                           placeholder='text to add (e.g. "ID <param>")'
                           value={getTransform(0).text}
                           onChange={(event) => {
                               setTransform(0, {text: event.target.value})
                           }}/>
                </div>
            </div>

        </div>
    )
}