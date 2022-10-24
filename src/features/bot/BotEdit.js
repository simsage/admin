import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeMemoryForm, updateMindItem} from "./botSlice";


export function BotEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const selected_memories = useSelector((state) => state.botReducer.mind_item_list)
    const show_memory_form = useSelector((state) => state.botReducer.show_memory_form);
    const memory = useSelector( (state) => state.botReducer.edit);

    //Memory details
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [created, setCreated] = useState('');
    const [id, setID] = useState(' ');
    const [imageList, setImageList] = useState([]);
    const [mid, setMId] = useState('');
    const [soundList, setSoundList] = useState('');
    const [videoList, setVideoList] = useState('');

    // Grab memory details if editing
    let selectedMemory = {}
    useEffect(()=> {
        console.log('running......')
        if (memory && selected_memories) {
            let temp_obj = selected_memories.filter((o) => {
                return o.id === memory.id
            })
            console.log('here',temp_obj)
            if (temp_obj.length > 0) {
                selectedMemory = (temp_obj[0])
                console.log('selectedMemory!', selectedMemory)
                console.log('selected KB', knowledge_base_id)
            }
        }
        //Populate form if necessary
        if(selectedMemory){
            console.log('selected memory',selectedMemory)
            setQuestions(selectedMemory.questionList)
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
        setQuestions([]);
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
        //begin updating user
        const session_id = session.id;
        const data = {
            id : id ? id : '' ,
            questionList : questions ? questions : [],
            urlList: links ? links : [],
            information:answer ? answer : '',
            imageList : imageList ? imageList : []
        }

        console.log('Saving...', data,organisation_id,knowledge_base_id);
        dispatch(updateMindItem({session_id,organisation_id, knowledge_base_id, data}));
        dispatch(closeMemoryForm());
    }

    const updateLink = index => e => {
        let newArr = [...links];
        newArr[index] = e.target.value;
        console.log('links', newArr)
        setLinks(newArr);
    }

    const updateQuestion = index => e => {
        let newArr = [...questions];
        newArr[index] = e.target.value;
        console.log('questions', newArr)
        setQuestions(newArr);
    }

    const addNewLink = e => {
        if(e.key === 'Enter') {
            e.preventDefault()
            let newArr = [...(links || [])];
            setNewLink(e.target.value)
            newArr.push(newLink)
            setLinks(newArr);
            setNewLink('')
        }
    }

    const addNewQuestion = e => {
        if(e.key === 'Enter') {
            e.preventDefault()
            let newArr = [...(questions || [])];
            setNewQuestion(e.target.value)
            newArr.push(newQuestion)
            setQuestions(newArr);
            setNewQuestion('')
        }
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

                                {
                                    questions && questions.map( (question,i) => {
                                        console.log(question)
                                        if (question === '') {return;}
                                        return (
                                            <div className="control-row" key={i}>
                                                <span className="label-2">Question </span>
                                                <span className="text">
                                                    <form>
                                                        <input type="text" className="form-control"
                                                               autoComplete="false"
                                                               placeholder="Question"
                                                               value={questions[i]}
                                                               onChange={updateQuestion(i)}
                                                        />
                                                    </form>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row">
                                    <span className="label-2">Add new question </span>
                                    <span className="text">
                                        <form>
                                            <input type="text"
                                                   className="form-control"
                                                   autoComplete="false"
                                                   placeholder="Type and press enter to submit"
                                                   value={newQuestion}
                                                   onChange={(e) => {setNewQuestion(e.target.value)}}
                                                   onKeyDown={(e) => addNewQuestion(e)}
                                            />
                                        </form>
                                    </span>
                                </div>
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
                                {
                                    links && links.map( (link,i) => {
                                        console.log(link)
                                        if (link === '') {return;}
                                        return (
                                            <div className="control-row" key={i}>
                                                <span className="label-2">Link </span>
                                                <span className="text">
                                                    <form>
                                                        <input type="text" className="form-control"
                                                               autoComplete="false"
                                                               placeholder="Links"
                                                               value={links[i]}
                                                               onChange={updateLink(i)}
                                                        />
                                                    </form>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row">
                                    <span className="label-2">Add new link </span>
                                    <span className="text">
                                        <form>
                                            <input type="text"
                                                   className="form-control"
                                                   autoComplete="false"
                                                   placeholder="Type and press enter to submit"
                                                   value={newLink}
                                                   onChange={(e) => {setNewLink(e.target.value)}}
                                                   onKeyDown={(e) => addNewLink(e)}
                                            />
                                        </form>
                                    </span>
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
