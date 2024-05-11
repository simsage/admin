import {useDispatch, useSelector} from "react-redux";
import {closeForm, getFailedDocuments} from "./sourceSlice";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
// import {data} from "msw";


export default function SourceFailures() {


    const dispatch = useDispatch();


    // load the selected source
    let selected_source = useSelector((state) => state.sourceReducer.selected_source);
    const session = useSelector((state) => state.authReducer.session);


    const documentList = useSelector((state) => state.sourceReducer.failed_documents);
    const documentTotal = useSelector((state) => state.sourceReducer.failed_document_total)

    const [pageSize, setPageSize] = useState(5)
    const [page, setPage] = useState(0)

    const handleClose = () => {
        dispatch(closeForm());
    }

    useEffect(() => {
        dispatch(getFailedDocuments({
            session_id: session.id,
            organisation_id: selected_source.organisationId,
            kb_id: selected_source.kbId,
            source_id: selected_source.sourceId,
            page: page,
            pageSize: pageSize
        }))

    }, [page, pageSize, selected_source, session?.id, dispatch]);

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog"
                 style={{display: "inline", 'zIndex': 1060, background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">
                        <div className="modal-header px-5 pt-4 bg-light">
                            <h4 className="mb-0" id="staticBackdropLabel">Failed documents
                                in {selected_source.name}</h4>
                        </div>
                        <div className={"failed_documents"}>
                            <table className="table">
                                <thead>
                                <tr>
                                    <td className="small text-black-50 px-4 ssi">Source System Identifier</td>
                                    <td className="small text-black-50 px-4 error_message">Error Message</td>
                                </tr>
                                </thead>
                                <tbody>
                                {documentList.map((doc, i) => {
                                    return <tr key={i}>
                                        <td
                                            title={doc.sourceSystemId}
                                            className="small text-black-50 px-4 ssi">
                                            <a href={doc.webUrl} target={"_blank"} rel="noreferrer">{doc.sourceSystemId}</a>
                                        </td>
                                        <td className="small text-black-50 px-4 error_message">{doc.errorMessage}</td>
                                    </tr>
                                })}
                                </tbody>
                            </table>

                            <Pagination
                                rowsPerPageOptions={[5, 10]}
                                component="div"
                                count={documentTotal}
                                theme={null}
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