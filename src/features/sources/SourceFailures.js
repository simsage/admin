import {useDispatch, useSelector} from "react-redux";
import {closeForm, getFailedDocuments} from "./sourceSlice";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {limit} from "../../common/api";
import {CopyButton} from "../../components/CopyButton";
// import {data} from "msw";


export default function SourceFailures() {

    const dispatch = useDispatch();

    // load the selected source
    let selected_source = useSelector((state) => state.sourceReducer.selected_source);
    const session = useSelector((state) => state.authReducer.session);

    const documentList = useSelector((state) => state.sourceReducer.failed_documents);
    const documentTotal = useSelector((state) => state.sourceReducer.failed_document_total)
    const theme = useSelector((state) => state.homeReducer.theme);

    const [pageSize, setPageSize] = useState(5)
    const [page, setPage] = useState(0)

    const handleClose = () => dispatch(closeForm())

    useEffect(() => {
        if (session && session.id && selected_source) {
            dispatch(getFailedDocuments({
                session_id: session.id,
                organisation_id: selected_source.organisationId,
                kb_id: selected_source.kbId,
                source_id: selected_source.sourceId,
                page: page,
                pageSize: pageSize
            }))
        }
    }, [page, pageSize, selected_source, session, dispatch]);

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog"
                 style={{display: "inline", 'zIndex': 1060, background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">
                        <div className="modal-header px-5 pt-4">
                            <h4 className="mb-0" id="staticBackdropLabel">Failed documents
                                in {selected_source.name}</h4>
                        </div>
                        <div className={"failed_documents"}>
                            <table className={theme === "light" ? "table" : "table-dark"}>
                                <thead>
                                <tr>
                                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 ssi"}>Document</td>
                                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 error_message"}>Error Message</td>
                                </tr>
                                </thead>
                                <tbody>
                                {documentList.map((doc, i) => {
                                    let doc_url = doc.sourceSystemId
                                    const is_url = (doc_url.startsWith("http://") || doc_url.startsWith("https://"))
                                    const archive_offset = doc_url.indexOf(":::")
                                    if (is_url && archive_offset > 0) {
                                        doc_url = doc_url.substring(0, archive_offset)
                                    }
                                    return <tr key={i}>
                                        {doc.webUrl &&
                                            <td
                                                title={doc.webUrl}
                                                className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 ssi"}>
                                                <a href={doc.webUrl} target={"_blank"}
                                                   rel="noreferrer">{doc.webUrl}</a>
                                            </td>
                                        }
                                        {!doc.webUrl && is_url &&
                                            <td
                                                title={doc.sourceSystemId}
                                                className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 ssi"}>
                                                <a href={doc_url} target={"_blank"}
                                                   rel="noreferrer">{doc.sourceSystemId}</a>
                                            </td>
                                        }
                                        {!doc.webUrl && !is_url &&
                                            <td
                                                title={doc.sourceSystemId}
                                                className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 ssi"}>
                                                <div>{doc.sourceSystemId}</div>
                                            </td>
                                        }
                                        <td className={"small pointer-default " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 error_message"} title={doc.errorMessage}>
                                            {limit(doc.errorMessage, 200)}
                                            <CopyButton reference={doc.errorMessage} />
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>

                            <Pagination
                                rowsPerPageOptions={[5, 10]}
                                component="div"
                                count={documentTotal}
                                rowsPerPage={pageSize}
                                page={page}
                                backIconButtonProps={{'aria-label': 'Previous Page',}}
                                nextIconButtonProps={{'aria-label': 'Next Page',}}
                                onChangePage={(page) => setPage(page)}
                                onChangeRowsPerPage={(rows) => setPageSize(rows)}
                            />

                        </div>
                        <div className="modal-footer px-5 pb-3">
                            <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                    data-bs-dismiss="modal">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}