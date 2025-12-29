import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getDocumentByUrl} from "../document_management/documentSlice";
import Api, {convert_gmt_to_local} from "../../common/api";
import '../../css/documents.css';
import {CopyButton} from "../../components/CopyButton";

export function CheckDocument(props) {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const document = useSelector((state) => state.documentReducer.document)
    const session_id = session.id;

    const [document_url, setDocumentUrl] = useState('')
    const [document_key_list, setDocumentKeyList] = useState([])
    const [document_data, setDocumentData] = useState({})
    const [user_metadata, setUserMetadata] = useState([])

    function handleFindDocument() {
        if (document_url && document_url.trim().length > 0) {
            dispatch(getDocumentByUrl({
                session_id: session_id, organisation_id: organisation_id,
                kb_id: kb_id, document_url: document_url
            }))
        }
    }

    // set up document details and keys
    useEffect(()=> {

        // pretty print list of ACLs
        function acls_to_string(acls) {
            if (acls && acls.length > 0) {
                const sb_list = [];
                for (const acl of acls) {
                    if (sb_list.length > 0) {
                        sb_list.push(", ")
                    }
                    if (acl.isUser) {
                        sb_list.push("user: " + acl.acl + " [" + acl.access + "] ");
                    } else {
                        sb_list.push("group: " + acl.acl + " [" + acl.access + "] ");
                    }
                }
                return sb_list.join("")
            }
            return "";
        }

        if (document && props.source && props.source.sourceId === document.sourceId) {
            let key_list = [
                'url', 'url id', 'source ACLs', 'document ACLs', 'title', 'author', 'binary size',
                'inventory only', 'change hash',
                'content hash', 'uploaded', 'crawled', 'converted', 'parsed', 'indexed', 'previewed', 'created',
                'last modified', 'document type', 'filename', 'folder id', 'number of relationships',
                'number of sentences', 'number of tokens', 'parent url', 'type description', '-eod-'
            ]

            const document_key_values = {};
            document_key_values['url'] = document.url;
            document_key_values['url id'] = document.urlId;
            document_key_values['source ACLs'] = acls_to_string(props.source.acls);
            document_key_values['document ACLs'] = acls_to_string(document.acls);
            document_key_values['title'] = document.title;
            document_key_values['author'] = document.author;
            document_key_values['binary size'] = Api.formatSizeUnits(document.binarySize);
            document_key_values['inventory only'] = document.inventoryOnly ? "yes" : "no"
            document_key_values['change hash'] = document.changeHash;
            document_key_values['content hash'] = document.contentHash;

            document_key_values['uploaded'] = document.uploaded + "  (" + ((document.uploaded > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.uploaded)) : 'n/a') + ")";
            document_key_values['crawled'] = document.crawled + "  (" + ((document.crawled > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.crawled)) : 'n/a') + ")";
            document_key_values['converted'] = document.converted + "  (" + ((document.converted > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.converted)) : 'n/a') + ")";
            document_key_values['parsed'] = document.parsed + "  (" + ((document.parsed > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.parsed)) : 'n/a') + ")";
            document_key_values['indexed'] = document.indexed + "  (" + ((document.indexed > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.indexed)) : 'n/a') + ")";
            document_key_values['previewed'] = document.previewed + "  (" + ((document.previewed > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.previewed)) : 'n/a') + ")";
            document_key_values['created'] = document.created + "  (" + ((document.created > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.created)) : 'n/a') + ")";
            document_key_values['last modified'] = document.lastModified + "  (" + ((document.lastModified > 0) ? Api.unixTimeConvert(convert_gmt_to_local(document.lastModified)) : 'n/a') + ")";

            document_key_values['document type'] = document.documentType;
            document_key_values['filename'] = document.filename;
            document_key_values['folder id'] = document.folderId;
            document_key_values['number of relationships'] = document.numRelationships.toLocaleString();
            document_key_values['number of sentences'] = document.numSentences.toLocaleString();
            document_key_values['number of tokens'] = document.numWords.toLocaleString();
            document_key_values['parent url'] = document.parentUrl;
            document_key_values['type description'] = document.typeDescription;

            // metadata
            for (const key of Object.keys(document.metadata)) {
                if (document.metadata.hasOwnProperty(key)) {
                    let value = document.metadata[key];
                    if ((key === '{created}' || key === '{lastmod}') && parseInt(value) > 0) {
                        value = value + "  (" + Api.unixTimeConvert(convert_gmt_to_local(parseInt(value))) + ")";
                    }
                    // skip user defined values here
                    if (key.indexOf(Api.user_metadata_marker) === 0) continue

                    // make sure we aren't overwriting existing data (like 'url')
                    if (!document_key_values.hasOwnProperty(key)) {
                        document_key_values[key] = value;
                        key_list.push(key);
                    } else {
                        document_key_values["md-" + key] = value;
                        key_list.push("md-" + key);
                    }
                }
            }

            // user defined metadata
            const user_metadata_list = []
            for (const key of Object.keys(document.metadata)) {
                if (document.metadata.hasOwnProperty(key)) {
                    let value = document.metadata[key];
                    if (key.indexOf(Api.user_metadata_marker) === 0) {
                        user_metadata_list.push(
                            {
                                key: key,
                                value: value
                            })
                    }
                }
            }
            setUserMetadata(user_metadata_list)
            setDocumentKeyList(key_list)
            setDocumentData(document_key_values)

        } else {
            setDocumentKeyList([]);
            setDocumentData({});
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document, props.source])


    // helper for clipboard function
    function get_document_str() {

        function add_spaces(my_str, length) {
            let new_str = my_str;
            while (new_str.length < length) {
                new_str += ' ';
            }
            return new_str;
        }

        let sb = [];
        if (user_metadata && user_metadata.length > 0) {
            sb.push("-- user defined metadata --\n")
            user_metadata.map((kv) => {
                sb.push(add_spaces(kv.key, 40) + kv.value);
                return 0
            })
            sb.push("")
        }
        sb.push("-- SimSage data --\n")
        document_key_list.map((key) => {
            if (key === '-eod-') {
                sb.push("\n-- metadata --\n")
            } else {
                sb.push(add_spaces(key, 40) + document_data[key]);
            }
            return 0
        })
        sb.push("\n")
        return sb.join("\n")
    }


    return (
        <div>
            <div className="row mb-3">
                <div className="col-6 d-flex">
                    <div className="alert alert-warning small py-2" role="alert">
                        Check the existence and details of a document
                    </div>
                </div>
            </div>


            <div className="row mb-4">
                <div className="form-group col-8">
                    <label className="small">look for your document by specifying its URL (unique SimSage ID)</label>
                </div>
            </div>
            <div className="row mb-4">
                <div className="form-group col-8">
                    <input type="text" className="form-control"
                           placeholder="Document URL..."
                           autoFocus={true}
                           value={document_url}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   e.preventDefault();
                                   handleFindDocument();
                               }
                           }}
                           onChange={(event) => {
                               setDocumentUrl(event.target.value)
                           }}
                    />
                </div>
                <div className="form-group col-4">
                    <button onClick={handleFindDocument} type="button"
                            className="btn btn-primary">Find
                    </button>
                </div>
            </div>

            { document && document.urlId &&
                <>
                    <div className="scrollable-view mb-4">

                        {user_metadata && user_metadata.length > 0 &&
                            <div className="row mb-2 mt-4">
                                <div className="col-12">
                                    <label className="fw-bold small">user defined metadata</label>
                                </div>
                            </div>
                        }

                        {user_metadata && user_metadata.length > 0 &&
                            user_metadata.map((kv, i) => {
                                return (
                                <div className="row mb-2" key={i}>
                                    <div className="form-group col-2">
                                        <label className="small">{kv.key}</label>
                                    </div>
                                    <div className="form-group col-8">
                                        <label className="">{kv.value}</label>
                                    </div>
                                </div>
                                )
                            })
                        }

                        <div className="row mb-2 mt-4">
                            <div className="col-12">
                                <label className="fw-bold small">{"SimSage data" + (document.inventoryOnly ? " -- this document only exists in the inventory and is not searchable" : "")}</label>
                            </div>
                        </div>

                        {document_key_list.map((key, i) => {
                            if (key === '-eod-') {
                                return (
                                    <div className="row mb-2 mt-4" key={i}>
                                        <div className="col-12">
                                            <label className="fw-bold small">metadata</label>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div className="row mb-2" key={i}>
                                    <div className="form-group col-2">
                                        <label className="small">{key}</label>
                                    </div>
                                    <div className="form-group col-8">
                                        <label className="">{document_data[key] ? document_data[key] : ''}</label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="row mb-2">
                        <div className="form-group col-10">
                        </div>
                        <div className="form-group col-2">
                            <CopyButton reference={get_document_str} />
                        </div>
                    </div>
                </>
            }

            {
                document && document.message && document_url &&
                <div className="row mb-2">
                    <div className="form-group col-12">
                        <label className="small">document not found.</label>
                    </div>
                </div>
            }
        </div>
    )
}