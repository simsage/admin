import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useSelectedSource} from './common.js';
import CustomSelect from "../../../components/CustomSelect";
import {useSelector} from "react-redux";
import {MetadataCsvImport} from "../MetadataCsvImport";
import {findCsvMetadata, showCsvImportForm} from "../sourceSlice";
import {BsFilePdf} from "react-icons/bs";

const DOCUMENTATION = {
    METADATA_SETUP_GUIDE: "resources/simsage-metadata-operations.pdf"
}

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

    const dispatch = useDispatch();

    // Fetch the selected source and calculate source_saved using a custom hook
    const {
        selected_source,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props)

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const source_type_name = selected_source && selected_source.crawlerType ? selected_source.crawlerType : "Source"
    const empty_metadata_mapper_item = {"extMetadata": "", "metadata": "", "display": ""}
    const empty_transform = {source: 'none', destination: 'none', text_action: 'after', text: '', regex: ''}
    const theme = useSelector((state) => state.homeReducer.theme);
    const busy = useSelector((state) => state.sourceReducer.busy);
    const metadata_enhancement_list = useSelector((state) => state.sourceReducer.metadata_enhancement_list) ?? [];

    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    const [menu, setMenu] = useState('mapper')
    const [primary_key, setPrimaryKey] = useState('')
    const [pk_filter, setPkFilter] = useState('');

    useEffect(() => {
        if (selected_source && selected_source.metadataPrimaryKeyPattern) {
            setPrimaryKey(selected_source.metadataPrimaryKeyPattern)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_source?.metadataPrimaryKeyPattern])

    const on_change_pk_filter = (e, filter) => {
        e.preventDefault();
        e.stopPropagation();
        setPkFilter(filter)
    }

    const check_key_down = (e) => {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    const check_key_down_find = (e) => {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        }
        if (pk_filter && pk_filter.length > 1) {
            dispatch(findCsvMetadata({
                "session_id": session_id,
                "organisation_id": organisation_id,
                "kb_id": kb_id,
                "source_id": selected_source.sourceId,
                "filter": pk_filter
            }))
        }
    }

    const on_go_find = (e, pk_filter) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(findCsvMetadata({
            "session_id": session_id,
            "organisation_id": organisation_id,
            "kb_id": kb_id,
            "source_id": selected_source.sourceId,
            "filter": pk_filter
        }))
    }

    const name_values = (map) => {
        let str = ""
        const keys = Object.keys(map)
        for (let i = 0; i < keys.length; i++) {
            if (str.length > 0) {
                str += ", "
            }
            str += keys[i] + "=" + map[keys[i]]
        }
        return str
    }

    function selectMenu(e, menu) {
        e.preventDefault();
        e.stopPropagation();
        setMenu(menu);
    }

    function importCsvMetadata(e) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(showCsvImportForm(primary_key))
    }

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
    }, [props])

    // eslint-disable-next-line
    const has_saved_source = selected_source?.sourceId != "0"

    return (
        <div className="px-5 py-4" style={{maxHeight: "600px", overflow: "auto"}}>

            <MetadataCsvImport />

            <div className="tab-content py-2 overflow-auto">
                <div className="tab">
                    <button className={"tablinks " + (menu === 'mapper' ? "active" : "")}
                            onClick={(e) => selectMenu(e, "mapper")}>
                        Metadata Mapper
                    </button>
                    <button className={"tablinks " + (menu === 'transform' ? "active" : "")}
                            onClick={(e) => selectMenu(e, "transform")}>
                        Metadata Transform
                    </button>
                    {has_saved_source &&
                    <button className={"tablinks " + (menu === 'enhancement' ? "active" : "")}
                            onClick={(e) => selectMenu(e, "enhancement")}>
                        {"Metadata Enhancements"}
                    </button>
                    }
                    {!has_saved_source &&
                        <button className={"tablinks " + (menu === 'enhancement' ? "active" : "")} disabled={true}>
                            {"Metadata Enhancements (unavailable until saved)"}
                        </button>
                    }
                </div>
            </div>

            { menu === 'mapper' &&
            <div>
                <div className="row mb-3">
                    <div className="col-6 d-flex">
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div>
                            <button onClick={addNewMetadataMapping} type="button" className="btn btn-primary btn-small"
                                    title="+ Add Metadata Mapping"
                                    data-bs-dismiss="modal">{"+ Add Metadata Mapping"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="form-group col-12">
                        <label className="small">Metadata Mappings</label>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-10 d-flex">
                        <div className="alert alert-warning small py-2" role="alert">
                            Map Metadata from a source's own metadata to a SimSage metadata name.  The source's own metadata
                            name is typically a field or property name.  The SimSage metadata name can be any field that is made
                            searchable.  Well defined SimSage metadata fields are: url (SimSage unique/primary-key), title, and author.
                        </div>
                    </div>
                </div>

                <table className="table w-100">

                    <thead>
                    <tr className='table-header'>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-0"}></td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 metadata-field-column"}>SimSage Metadata name</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 sort-field-column"}>{source_type_name} field / property</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 action-field-column"}></td>
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
                                        <div className="">
                                            <input type="text"
                                                   className="form-control"
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
                                                   className="form-control"
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
            }


            { menu === 'transform' &&
            <div>

                <div className="row mt-4">
                    <div className="form-group col-12">
                        <label className="small bi-arrow-left-right">&nbsp;Metadata Transform  (optional)</label>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-10 d-flex">
                        <div className="alert alert-warning small py-2" role="alert">
                            Metadata mappings can take urls, titles, or author fields from records and alter these
                            using regular expressions to create new metadata.
                        </div>
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
                               className="form-control"
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
                               className="form-control"
                               placeholder='text to add (e.g. "ID <param>")'
                               value={getTransform(0).text}
                               onChange={(event) => {
                                   setTransform(0, {text: event.target.value})
                               }}/>
                    </div>
                </div>

            </div>
            }


            { menu === 'enhancement' &&
                <div>

                    <div className="row mb-3">
                        <div className="col-10 d-flex">
                            <div className="alert alert-warning small py-2" role="alert">
                                Match part of a document's/record's path with a Primary Key Pattern,
                                then add metadata to any document that matches the same key inside
                                a set of records defined through a CSV database with name/value pairs.<br /><br />
                                The Primary Key pattern is case sensitive and uses <br/>
                                # (hash) to match a single digit 0..9< br/>
                                * (asterisk / star) to match single letters a..z or A..Z<br/>
                                + (plus) to match a single digit 0..9 or letter a..z, A..Z<br/>
                                e.g., MIMR-####-#### will match MIMR-2020-0128 and MIMR-2025-0125
                            </div>
                        </div>
                        <div className="col-2">
                            <a href={DOCUMENTATION.METADATA_SETUP_GUIDE} id="dlGDrive" target="_blank" rel="noreferrer"
                               title="Download the SimSage AI setup guide"
                               className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                <BsFilePdf size={25}/>
                                <span className="me-2 mt-2"></span>SimSage Metadata Enhancements<br/>Guide
                            </a>
                        </div>
                    </div>

                    <div className="row">

                        <div className="form-group col-8">
                            <label className="small">Primary Key Pattern</label>
                            <input type="text"
                                   className="form-control"
                                   placeholder='e.g. MIMR-####-####'
                                   value={primary_key}
                                   title="the regular expression to apply"
                                   onKeyDown={(e) => check_key_down(e)}
                                   onChange={(event) => {
                                       event.preventDefault();
                                       event.stopPropagation();
                                       setPrimaryKey(event.target.value)
                                   }}/>
                        </div>

                        <div className="form-group col-2">
                            <br />
                            <button className="btn btn-outline-primary text-nowrap me-2"
                                    disabled={busy || primary_key.trim() === ''}
                                    onClick={(e) => importCsvMetadata(e)}>
                                Import Csv Metadata
                            </button>
                        </div>

                    </div>

                    <div className="row mt-4 border-top">
                    </div>

                    <div className="row mt-4">
                        <div className="col-10 d-flex">
                            <div className="alert alert-warning small py-2" role="alert">
                                Find existing records by partially or fully matching the Primary Key Pattern.
                                Will only show up to five records maximum.
                            </div>
                        </div>
                    </div>

                    <div className="row mt-2">

                        <div className="col-2">
                            <label className="small">Find Existing Records</label>
                        </div>

                        <div className="role-area border rounded col-3">
                            <input className="px-2 py-2 w-100 border-0"
                                   placeholder="Find..." value={pk_filter}
                                   onKeyDown={(e) => check_key_down_find(e)}
                                   onChange={(e) => on_change_pk_filter(e, e.target.value)} />
                        </div>

                        <div className="col-2">
                            <button className="btn btn-primary text-nowrap"
                                    disabled={pk_filter.trim().length < 2}
                                    onClick={(e) => on_go_find(e, pk_filter)}>
                                Find
                            </button>
                        </div>

                    </div>

                    {
                        metadata_enhancement_list.length > 0 &&
                        <div className="row mt-3">
                            <div className="col-12 small">(showing {metadata_enhancement_list.length < 5 ?
                                metadata_enhancement_list.length + " of " + metadata_enhancement_list.length + " records)" :
                                metadata_enhancement_list.length + " of maximum 5 records)"}</div>
                        </div>
                    }

                    <div className="row mt-4">
                        {
                            metadata_enhancement_list.map((item) => {
                                return (
                                    <div key={item.primaryKey}>
                                        <div className="col-12"><b>{item.primaryKey}</b> : {name_values(item.map)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            }

        </div>
    )
}
