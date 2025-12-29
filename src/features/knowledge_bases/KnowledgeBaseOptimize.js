import {useDispatch, useSelector} from "react-redux";
import {
    closeOptimize,
    optimizeIndexes,
    optimizeIndexesAbort,
    updateCounters,
    upgradeSimSage
} from "./knowledgeBaseSlice";
import React, {useState} from "react";

export default function KnowledgeBaseOptimize(){

    const dispatch = useDispatch();

    const show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const selected_kb = useSelector((state) => state.kbReducer.optimize_data.kb)
    const session_id = useSelector((state) => state.kbReducer.optimize_data.session_id)
    const action = useSelector((state) => state.kbReducer.optimize_data.action) // optimize or abort

    const [optimize_all, setOptimizeAll] = useState(false);
    const [counters_only, setCountersOnly] = useState(false);
    const [documents, setDocuments] = useState(true);
    const [indexes, setIndexes] = useState(true);

    //handle form close or cancel
    const handleClose = () => dispatch(closeOptimize())

    const handleOptimize = () => {
        if (counters_only) {
            const data = {
                "session_id": session_id,
                "organisation_id": selected_kb.organisationId,
                "kb_id": selected_kb.kbId,
            };
            dispatch(updateCounters(data));
        } else {
            const data = {
                "session_id": session_id,
                "organisation_id": selected_kb.organisationId,
                "kb_id": selected_kb.kbId,
                "optimize_all": optimize_all
            };
            dispatch(optimizeIndexes(data));
        }
        dispatch(closeOptimize());
    }


    const handleUpgrade = () => {
        const data = {
            "session_id": session_id,
            "organisation_id": selected_kb.organisationId,
            "kb_id": selected_kb.kbId,
            "documents": documents,
            "indexes": indexes
        };
        dispatch(upgradeSimSage(data));
        dispatch(closeOptimize());
    }


    const handleAbort = () => {
        const data = {"session_id": session_id, "organisation_id": selected_kb.organisationId, "kb_id": selected_kb.kbId};
        dispatch(optimizeIndexesAbort(data));
        dispatch(closeOptimize());
    }


    if (!show_optimize_form)
        return (<div />);
    const name = selected_kb && selected_kb.name ? '"' + selected_kb.name + '"' : "";
    return(
      <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
              <div className={"modal-dialog modal-dialog-centered"} role="document">
                  <div className="modal-content p-4">
                      <div className="modal-body text-center">
                          <div className="control-row mb-4">
                              {action === 'abort' &&
                                  <span className="label-wide">Are you sure you wish to abort optimizing </span>
                              }
                              {action === 'optimize' &&
                                  <span className="label-wide">Are you sure you wish to optimize the indexes of </span>
                              }
                              {action === 'upgrade' &&
                                  <span className="label-wide">Upgrade </span>
                              }
                              <span className="label-wide">knowledge-base {name}?</span>
                          </div>

                          {action === 'optimize' &&
                              <div className="form-check form-switch mt-2 mb-4 text-start"
                                   title="force optimization of all indexes?">
                                  <input
                                      className="form-check-input"
                                      type="checkbox"
                                      disabled={counters_only}
                                      checked={optimize_all && !counters_only}
                                      onChange={(e) => setOptimizeAll(e.target.checked)}
                                  />
                                  <label className="form-check-label small">
                                      Force Optimize ALL Indexes
                                  </label>
                              </div>
                          }

                          {action === 'optimize' &&
                              <div className="form-check form-switch mt-2 mb-4 text-start"
                                   title="update stats counters only?">
                                  <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={counters_only}
                                      onChange={(e) => setCountersOnly(e.target.checked)}
                                  />
                                  <label className="form-check-label small">
                                      Update stats counters only
                                  </label>
                              </div>
                          }

                          {action === 'upgrade' &&
                              <>
                                  <div className="form-check form-switch mt-2 mb-4 text-start"
                                       title="upgrade binary-document store?">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={documents}
                                          onChange={(e) => setDocuments(e.target.checked)}
                                      />
                                      <label className="form-check-label small">
                                          Upgrade binary-document store?
                                      </label>
                                  </div>
                                  <div className="form-check form-switch mt-2 mb-4 text-start"
                                       title="upgrade index store?">
                                      <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={indexes}
                                          onChange={(e) => setIndexes(e.target.checked)}
                                      />
                                      <label className="form-check-label small">
                                          Upgrade indexes?
                                      </label>
                                  </div>
                              </>
                          }

                          <div className="control-rowr">
                              <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                      data-bs-dismiss="modal">Cancel
                              </button>
                              {action === 'abort' &&
                                  <button onClick={handleAbort} type="button" className="btn btn-primary px-4">Abort
                                      Optimization</button>
                              }
                              {action === 'optimize' &&
                                  <button onClick={handleOptimize} type="button"
                                          className="btn btn-primary px-4">{counters_only ? "Update Counters" : "Optimize"}</button>
                              }
                              {action === 'upgrade' &&
                                  <button onClick={handleUpgrade} type="button"
                                          className="btn btn-primary px-4">Upgrade</button>
                              }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
