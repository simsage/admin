import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import Api from "../../common/api";
import DocumentFilter from "./DocumentFilter";
import {hasRole} from "../../common/helpers";
import {Pagination} from "../../common/pagination";
import {loadDocumentList} from "./documentSlice";


export default function DocumentsHome(props) {
    const title = "Documents";
    const maxUrlDisplayLength = 50;
    const document_list = useSelector((state) => state.documentReducer.document_list)
    const theme = '';

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const [document_page, setDocPage] = useState(0)
    const [document_page_size, setDocPageSize] = useState(useSelector((state) => state.documentReducer.document_page_size))
    const [document_count, setDocumentCount] = useState(useSelector((state) => state.documentReducer.document_page_size))
    const [document_filter, setDocFilter] = useState("")

    let crawler_map = {};

    const dispatch = useDispatch()

    const user = useSelector((state) => state.authReducer.user);

    console.log("document_page_size",document_page_size);

    useEffect(() => {
        let arg = {
            session_id: session.id, organisation_id: selected_organisation_id
        }
        dispatch(loadDocumentList({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id,
            document_filter: document_filter,
            document_page_size: document_page_size,
            document_previous:null
        }));
        console.log("useEffect")
    }, [props])


    function deleteDocumentAsk(document) {
        if (document) {
            this.props.openDialog("are you sure you want to remove \"" + document.url + "\" ?", "Remove Document", (action) => {
                deleteDocument(action)
            });
            this.setState({document: document});
        }
    }

    function deleteDocument(action) {
        if (action && Api.defined(this.state.document)) {
            this.props.deleteDocument(this.state.document.url, this.state.document.sourceId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    function handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            getDocuments();
        }
    }

    function documentUploaded() {
        this.setState({
            message_title: "done", message: "document uploaded",
            message_callback: () => {
                this.setState({message: ""})
            }
        });
    }

    function getDocuments() {
        return document_list;
    }

    function isWeb(url) {
        return (url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://"));
    }

    function adjustUrl(url) {
        if (url && url.length > maxUrlDisplayLength) {
            const half = Math.floor(maxUrlDisplayLength / 2);
            return url.substring(0, half) + " ... " + url.substring(url.length - half);
        }
        return url;
    }

    // return: 0 => to do, 1 => done, 2 => disabled
    function getActive(document, stage) {
        if (stage === "crawled") {
            if (document.crawled > 0)
                return 1;
        } else if (stage === "converted") {
            if (document.converted > 0)
                return 1;
            else if (document.converted < 0)
                return 2;
        } else if (stage === "parsed") {
            if (document.converted > 0 && document.converted <= document.parsed)
                return 1;
            else if (document.parsed < 0)
                return 2;
        } else if (stage === "indexed") {
            if (document.converted > 0 && document.parsed > 0 && document.parsed <= document.indexed)
                return 1;
            else if (document.indexed < 0)
                return 2;
        } else if (stage === "previewed") {
            if (document.previewed > 0)
                return 1;
            else if (document.previewed < 0)
                return 2;
        }
        return 0;
    }

    function getStatus(document, stage) {
        const status = getActive(document, stage);
        if (status === 1)
            return "../images/dot-green.svg";
        else if (status === 0)
            return "../images/dot-orange.svg";
        else
            return "../images/dot-grey.svg";
    }

    function getStatusText(document, stage, staging) {
        const status = getActive(document, stage);
        if (status === 1)
            return "document " + stage;
        else if (status === 0)
            return "document not " + stage;
        else
            return staging + " disabled for this document-source";
    }

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function canDeleteDocument(document) {
        return crawler_map[document.sourceId] !== 'wordpress';
    }

    const isAdmin = hasRole(user, ['admin']);

    return (

        <div className="section px-5 pt-4">

            <div className="document-display">

                {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                                <input type="text" value={document_filter} autoFocus={true}
                                       className={"filter-text-width " + theme}
                                       onKeyPress={(event) => handleSearchTextKeydown(event)}
                                       onChange={(event) => {
                                           setDocFilter(event.target.value)
                                       }}/>
                            </span>
                        <span className="filter-find-image">&nbsp;
                            <button className="btn btn-secondary"
                                    onClick={() => getDocuments()}
                                    src="../images/dark-magnifying-glass.svg" title="filter"
                                    alt="filter">filter</button>
                            </span>
                    </div>
                }


                {
                    isVisible() &&
                    <div className="table-style">
                        <table className="table">

                            <thead>
                            <tr className='table-header'>
                                <th className='table-header'>url</th>
                                <th className='table-header'>source</th>
                                <th className='table-header'>last modified</th>
                                <th className='table-header'>status</th>
                                {isAdmin &&
                                    <th className='table-header'>actions</th>
                                }
                            </tr>
                            </thead>

                            <tbody>
                            {
                                getDocuments().map((document) => {
                                    return (
                                        <tr key={document.url}>
                                            <td className="urlLabel">
                                                {
                                                    isWeb(document.url) &&
                                                    <div className="urlLabel">
                                                        <a href={document.url} title={document.url}
                                                           rel="noopener noreferrer"
                                                           target="_blank">{adjustUrl(document.url)}</a>
                                                    </div>
                                                }
                                                {
                                                    !isWeb(document.url) &&
                                                    <div className="urlLabel"
                                                         title={document.url}>{adjustUrl(document.url)}</div>
                                                }
                                            </td>
                                            <td className="sourceLabel">
                                                {document.origin}
                                            </td>
                                            <td>
                                                <div
                                                    className="timeLabel">{Api.unixTimeConvert(document.lastModified)}</div>
                                            </td>
                                            <td>
                                                <div className="status-label">
                                                    <img src={getStatus(document, "crawled")}
                                                         className="statusImage" alt="crawler"
                                                         title={getStatusText(document, "crawled", "crawling")}/>
                                                    <img src={getStatus(document, "converted")}
                                                         className="statusImage" alt="converted"
                                                         title={getStatusText(document, "converted", "converting")}/>
                                                    <img src={getStatus(document, "parsed")}
                                                         className="statusImage" alt="parsed"
                                                         title={getStatusText(document, "parsed", "parsing")}/>
                                                    <img src={getStatus(document, "indexed")}
                                                         className="statusImage" alt="indexed"
                                                         title={getStatusText(document, "indexed", "indexing")}/>
                                                    <img src={getStatus(document, "previewed")}
                                                         className="statusImage" alt="previewed"
                                                         title={getStatusText(document, "previewed", "preview generation")}/>
                                                </div>
                                            </td>
                                            {isAdmin &&
                                                <td>
                                                    <div className="linkButton"
                                                         onClick={() => deleteDocumentAsk(document)}>
                                                        <button className="btn btn-secondary" title="remove document"
                                                                alt="remove">remove
                                                        </button>
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={document_count}
                            rowsPerPage={document_page_size}
                            page={document_page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => setDocPage(page)}
                            onChangeRowsPerPage={(rows) => setDocPageSize(rows)}
                        />


                    </div>
                }

            </div>
        </div>
    )
}
