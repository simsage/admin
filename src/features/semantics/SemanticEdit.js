import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeSemanticForm} from "./semanticSlice";

export function SemanticEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const selected_memories = useSelector((state) => state.botReducer.mind_item_list)
    const show_semantic_form = useSelector((state) => state.semanticReducer.show_semantic_form);
    const selectedSemantic = useSelector( (state) => state.semanticReducer.edit);

    //Memory details
    const [word, setWord] = useState('');
    const [semanticType, setSemanticType] = useState('');
    // Grab memory details if editing
    console.log('Hello',selectedSemantic)
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
        // let questions = [q1, q2, q3, q4, q5]
        // //begin updating user
        // const session_id = session.id;
        // const data = {
        //     "created": created,
        //     "id": id,
        //     "imageList": imageList,
        //     "information": answer,
        //     "mid": mid,
        //     "organisationId": organisation_id,
        //     "questionList": questions.filter( q => q.length > 0),
        //     "soundList": soundList,
        //     "urlList": links,
        //     "videoList": videoList
        // }
        // console.log('Saving...', data);
        // dispatch(updateMindItem({session_id,organisation_id, knowledge_base_id, data}));
        // dispatch(closeMemoryForm());
    }


    if (show_semantic_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header">{selectedSemantic ? "Edit Semantic" : "Add New Semantic"}</div>
                    <div className="modal-body">
                        <div className="tab-content">

                            <div className="control-row">
                                <span className="label-2">Word</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Word"
                                                       value={word}
                                                       onChange={(event) => setWord(event.target.value)}
                                                />
                                                </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2">Semantics</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Semantic Words"
                                                       value={semanticType}
                                                       onChange={(event) => setSemanticType(event.target.value)}
                                                />
                                                </form>
                                        </span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
