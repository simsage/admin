import React, {useState} from 'react';
import {resetSourceDelta} from "../features/sources/sourceSlice";
import {useDispatch, useSelector} from "react-redux";
import ConfirmMessage from "./ConfirmMessage";

/**
 * helper for delta crawlers
 *
 * reset the delta token, with warning
 *
 * @returns {Element}
 */
export default function ResetDeltaControl() {
    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const selected_source = useSelector((state) => state.sourceReducer.selected_source);

    const [message, setMessage] = useState('')

    if (!selected_source) {
        return <div />
    }

    const confirm_reset_delta = (apply) => {
        if (apply) {
            dispatch(resetSourceDelta({
                session_id: session_id,
                organisation_id: selected_organisation_id,
                knowledgeBase_id: selected_knowledge_base_id,
                source_id: selected_source.sourceId
            }));
        }
        setMessage('')
    }

    const reset_delta_confirm = () => {
        setMessage('Apply Reset Delta')
    }


    return (
        <div>
            <ConfirmMessage message={message}
                            close={(apply) => confirm_reset_delta(apply)} />

            <div className="row pt-4">
                <div className="col-8">
                    <div className="alert alert-warning small py-2" role="alert">
                        Take Care: the Reset Delta button can only be used if you have set
                        Expected File Count (in the General tab) to a value greater than zero and
                        saved your crawler.  Only use this button if you're changing
                        Site/Drive/Folder information after you've done a Crawl.
                    </div>
                </div>
                <div className="col-4">
                    <button onClick={reset_delta_confirm} type="button" title='Reset Source Delta'
                            className='btn btn-primary px-4'
                            data-bs-dismiss="modal">Reset Delta
                    </button>
                </div>
            </div>
        </div>
    )
}
