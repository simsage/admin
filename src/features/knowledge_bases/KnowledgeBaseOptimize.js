import {useDispatch, useSelector} from "react-redux";
import {closeOptimize, optimizeIndexes, optimizeIndexesAbort} from "./knowledgeBaseSlice";

export default function KnowledgeBaseOptimize(){

    const dispatch = useDispatch();

    const show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const selected_kb = useSelector((state) => state.kbReducer.optimize_data.kb)
    const session_id = useSelector((state) => state.kbReducer.optimize_data.session_id)
    const action = useSelector((state) => state.kbReducer.optimize_data.action) // optimize or abort

    //handle form close or cancel
    const handleClose = () => dispatch(closeOptimize())

    const handleOptimize = () => {
        const data = {"session_id": session_id, "organisation_id": selected_kb.organisationId, "kb_id": selected_kb.kbId};
        dispatch(optimizeIndexes(data));
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
                              { action === 'abort' &&
                                <span className="label-wide">Are you sure you wish to abort optimizing </span>
                              }
                              { action !== 'abort' &&
                                  <span className="label-wide">Are you sure you wish to optimize the indexes of </span>
                              }
                              <span className="label-wide">knowledge-base {name}?</span>
                          </div>

                        <div className="control-rowr">
                            <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Cancel</button>
                            { action === 'abort' &&
                                <button onClick={ handleAbort } type="button" className="btn btn-primary px-4">Abort Optimization</button>
                            }
                            { action !== 'abort' &&
                                <button onClick={ handleOptimize } type="button" className="btn btn-primary px-4">Optimize</button>
                            }
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
