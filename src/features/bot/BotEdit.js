import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeMemoryForm, updateMindItem} from "./botSlice";


export function BotEdit(props){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const selected_memories = useSelector((state) => state.botReducer.mind_item_list)
    const show_memory_form = useSelector((state) => state.botReducer.show_memory_form);
    const memory = useSelector( (state) => state.botReducer.edit);

    //Memory details
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q3, setQ3] = useState('');
    const [q4, setQ4] = useState('');
    const [q5, setQ5] = useState('');
    const [answer, setAnswer] = useState('');
    const [links, setLinks] = useState([]);
    const [created, setCreated] = useState('');
    const [id, setID] = useState('');
    const [imageList, setImageList] = useState('');
    const [mid, setMId] = useState('');
    const [soundList, setSoundList] = useState('');
    const [videoList, setVideoList] = useState('');



    // Grab memory details if editing
    let selectedMemory = {}
    useEffect(()=> {
        if (memory && selected_memories) {
            let temp_obj = selected_memories.filter((o) => {
                return o.id === memory.id
            })
            if (temp_obj.length > 0) {
                selectedMemory = (temp_obj[0])
                console.log('selectedMemory!', selectedMemory)
                console.log('selected KB', knowledge_base_id)
            }
        }
        //Populate form if necessary
        if(selectedMemory){
            if(selectedMemory.questionList) {
                setQ1(selectedMemory.questionList[0] ? selectedMemory.questionList[0] : '')
                setQ2(selectedMemory.questionList[1] ? selectedMemory.questionList[1] : '')
                setQ3(selectedMemory.questionList[2] ? selectedMemory.questionList[2] : '')
                setQ4(selectedMemory.questionList[3] ? selectedMemory.questionList[3] : '')
                setQ5(selectedMemory.questionList[4] ? selectedMemory.questionList[4] : '')
            }
            setAnswer(selectedMemory.information)
            setLinks(selectedMemory.urlList)
            setCreated(selectedMemory.created)
            setID(selectedMemory.id)
            setImageList(selectedMemory.imageList)
            setMId(selectedMemory.mid)
            setSoundList(selectedMemory.soundList)
            setVideoList(selectedMemory.videoList)
        }
    }, [show_memory_form])

    function resetData () {
        setQ1('')
        setQ2('')
        setQ3('')
        setQ4( '')
        setQ5('')
        setAnswer('')
        setLinks([])
        setCreated('')
        setID('')
        setImageList('')
        setMId('')
        setSoundList('')
        setVideoList('')
    }

    function handleClose(e){
        dispatch(closeMemoryForm())
        resetData()
    }



    const handleSave = () => {
        let questions = [q1, q2, q3, q4, q5]
        //begin updating user
        const session_id = session.id;
        const data = {
            "created": created,
            "id": id,
            "imageList": imageList,
            "information": answer,
            "mid": mid,
            "organisationId": organisation_id,
            "questionList": questions.filter( q => q.length > 0),
            "soundList": soundList,
            "urlList": links,
            "videoList": videoList
        }
        console.log('Saving...', data);
        dispatch(updateMindItem({session_id,organisation_id, knowledge_base_id, data}));
        dispatch(closeMemoryForm());
    }


    if (show_memory_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header">{memory ? "Edit Memory" : "Add New Memory"}</div>
                    <div className="modal-body">
                            <div className="tab-content">

                                <div className="control-row">
                                    <span className="label-2">Q1</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Question 1"
                                                       value={q1}
                                                       onChange={(event) => setQ1(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>
                                <div className="control-row">
                                    <span className="label-2">Q2</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Question 2"
                                                       value={q2}
                                                       onChange={(event) => setQ2(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>
                                <div className="control-row">
                                    <span className="label-2">Q3</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Question 3"
                                                       value={q3}
                                                       onChange={(event) => setQ3(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>
                                <div className="control-row">
                                    <span className="label-2">Q4</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Question 4"
                                                       value={q4}
                                                       onChange={(event) => setQ4(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>
                                <div className="control-row">
                                    <span className="label-2">Q5</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Question 5"
                                                       value={q5}
                                                       onChange={(event) => setQ5(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">Answer</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Answer"
                                                       value={answer}
                                                       onChange={(e) => setAnswer(e.target.value)}
                                                />
                                            </form>
                                        </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">links (one per line)</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Links"
                                                       value={links}
                                                       onChange={(event) => setLinks(event.target.value)}
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
