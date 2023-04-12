import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeSemanticForm, updateSemantics} from "./semanticSlice";

export function SemanticEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_semantic_form = useSelector((state) => state.semanticReducer.show_semantic_form);
    const selectedSemantic = useSelector( (state) => state.semanticReducer.edit);

    //Memory details
    const [word, setWord] = useState('');
    const [semanticType, setSemanticType] = useState('');
    // Grab memory details if editing

    useEffect(()=> {
        if(selectedSemantic) {
            setWord(selectedSemantic.word);
            setSemanticType(selectedSemantic.semantic);
        }

    }, [show_semantic_form])

    function resetData () {

        setWord('');
        setSemanticType('');

    };

    function handleClose(e){
        dispatch(closeSemanticForm())
        resetData()
    }



    const handleSave = () => {
        //begin updating user
        const session_id = session.id;
        const data = {
            "word": word,
            "prevWord": selectedSemantic ? selectedSemantic.word : "",
            "semantic": semanticType

        }
         console.log('org', organisation_id, 'kb',knowledge_base_id,'Saving...', data);
        dispatch(updateSemantics({session_id, organisation_id, knowledge_base_id, data}));
        dispatch(closeSemanticForm());
    }
// dispatch(updateMindItem({session_id,organisation_id, knowledge_base_id, data}));
        // dispatch();

    if (show_semantic_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                <div className="modal-header px-5 pt-4 bg-light">
                    <h4 className="mb-0">{selectedSemantic ? "Edit Semantic" : "New Semantic"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">
                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <span className="label-2 small">Word</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                    autoFocus={true}
                                                    autoComplete="false"
                                                    placeholder="e.g. Wellington"
                                                    value={word}
                                                    onChange={(event) => setWord(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                                <div className="control-row col-6">
                                    <span className="label-2 small">Semantic</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                    autoFocus={true}
                                                    autoComplete="false"
                                                    placeholder="e.g. City"
                                                    value={semanticType}
                                                    onChange={(event) => setSemanticType(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
