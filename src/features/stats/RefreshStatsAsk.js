import {useDispatch, useSelector} from "react-redux";
import {calculateDocumentStats, closeUpdateStatsForm} from "../document_management/documentSlice";

export default function RefreshStatsAsk(){

    const dispatch = useDispatch();

    const show_update_stats = useSelector((state) => state.documentReducer.show_update_stats)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session?.id;
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeUpdateStatsForm());
    }

    const handleRefresh = () => {
        if (session_id) {
            dispatch(calculateDocumentStats({
                session_id: session_id,
                organisation_id: organisation_id,
                kb_id: kb_id
            }));
        }
        dispatch(closeUpdateStatsForm());
    }


    if (!show_update_stats)
        return (<div />);

    return(
      <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
              <div className={"modal-dialog modal-dialog-centered"} role="document">
                  <div className="modal-content p-4">

                      <div className="modal-body text-center">
                          <div className="control-row mb-4">
                              <span className="label-wide">Are you sure you wish to refresh your Document Statistics Data?</span>
                              <br/>
                              <span className="label-wide">this might take some time.</span>
                          </div>

                          <div className="control-rowr">
                              <button onClick={handleClose} type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Cancel</button>
                            <button onClick={ handleRefresh } type="button" className="btn btn-primary px-4">Refresh</button>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
