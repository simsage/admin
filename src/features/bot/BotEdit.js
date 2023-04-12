import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeMemoryForm, updateMindItem} from "./botSlice";
import Button from "bootstrap/js/src/button";


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
    const [created, setCreated] = useState('0');
    const [id, setID] = useState(' ');
    const [imageList, setImageList] = useState([]);
    const [mId, setMId] = useState('');
    const [soundList, setSoundList] = useState([]);
    const [videoList, setVideoList] = useState([]);

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
        setCreated(0)
        setID('')
        setImageList([])
        setMId('')
        setSoundList([])
        setVideoList([])
    }

    function handleClose(e){
        dispatch(closeMemoryForm())
        resetData()
    }



    const handleSave = () => {
        //begin updating user
        const session_id = session.id;
        const data = {
            created: 0,
            id : id ? id : "" ,
            imageList : imageList ? imageList : [],
            information:answer ? answer : '',
            mid: mId,
            organisationId: organisation_id,
            questionList : questions ? questions : [],
            soundList:soundList,
            urlList: links ? links : [],
            videoList:videoList
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
            newArr.push(newLink)
            setLinks(newArr);
            setNewLink('')
        }
    }

    const addNewQuestion = e => {
        if(e.key === 'Enter') {
            e.preventDefault()
            let newArr = [...(questions || [])];
            newArr.push(newQuestion)
            setQuestions(newArr);
            setNewQuestion('')
        }
    }

    const addNewQuestionBtn = () => {
        let newArr = [...(questions || [])];
        // setNewQuestion(e.target.value)
        newArr.push(newQuestion)
        setQuestions(newArr);
        setNewQuestion('')
    }

    const removeQuestionBtn = (q, index) => {
        let newArr = [...questions];
        newArr.splice(index,1)
        console.log('questions', newArr)
        setQuestions(newArr);

    }

    const removeLinkBtn = (l, index) => {
        let newArr = [...links];
        newArr.splice(index,1)
        console.log('links', newArr)
        setLinks(newArr);
    }

    const addNewLinkBtn = () => {
        let newArr = [...(links || [])];
        // setNewQuestion(e.target.value)
        newArr.push(newLink)
        setLinks(newArr);
        setNewLink('')
    }


    if (show_memory_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{memory ? "Edit Memory" : "New Memory"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
                            <div className="row">

                                <div className="d-flex justify-content-between small">
                                    <label className="label-2">Question</label>
                                    <span className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                </div>
                                {
                                    questions && questions.map( (question,i) => {
                                        console.log(question)
                                        if (question === '') {return;}
                                        return (
                                            <div className="control-row col-12 mb-2" key={i}>

                                                <span className="text">
                                                    <form>
                                                        <div className="form-control d-flex p-0 overflow-hidden">
                                                            <input type="text" className="border-0 w-100 me-2" style={{padding: "0.375rem 0.75rem"}}
                                                                autoComplete="false"
                                                                placeholder="Question..."
                                                                value={questions[i]}
                                                                onChange={updateQuestion(i)}
                                                            />
                                                            <button className="btn pointer-cursor mb-0 px-3 py-0" onClick={() => removeQuestionBtn(question, i)}>&times;</button>
                                                        </div>
                                                    </form>
                                                </span>
                                                
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row col-12 mb-3">
                                    <span className="text d-flex">
                                            <form className="w-100 me-2">
                                                <input type="text"
                                                    className="form-control"
                                                    autoComplete="false"
                                                    placeholder="Question..."
                                                    value={newQuestion}
                                                    onChange={(e) => {setNewQuestion(e.target.value)}}
                                                    onKeyDown={(e) => addNewQuestion(e)}
                                                />
                                            </form>
                                            <button className="btn-secondary btn pointer-cursor px-3" onClick={(e) => addNewQuestionBtn(e, newQuestion)}>+</button>
                                        </span>
                                </div>
                                <div className="control-row col-12 mb-4">
                                    <label className="label-2 small">Answer</label>
                                    <span className="text">
                                                <form>
                                                    <textarea type="text" className="form-control"
                                                        autoComplete="false"
                                                        placeholder="Answer..."
                                                        value={answer}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                    />
                                                </form>
                                            </span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <label className="label-2">Link</label>
                                    <span className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                </div>
                                {
                                    links && links.map( (link,i) => {
                                        console.log(link)
                                        if (link === '') {return;}
                                        return (
                                            <div className="control-row col-12 mb-2" key={i}>

                                                <span className="text">
                                                    <form>
                                                        <div className="form-control d-flex p-0 me-2 overflow-hidden">
                                                            <input type="text" className="border-0 w-100" style={{padding: "0.375rem 0.75rem"}}
                                                                autoComplete="false"
                                                                placeholder="URL..."
                                                                value={links[i]}
                                                                onChange={updateLink(i)}
                                                            />
                                                            <button className="btn pointer-cursor mb-0 px-3 py-0" onClick={() => removeLinkBtn(link, i)}>&times;</button>
                                                        </div>
                                                    </form>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row col-12 mb-4">
                                    <span className="text d-flex">
                                        <form className="w-100 me-2">
                                            <input type="text"
                                                className="form-control"
                                                autoComplete="false"
                                                placeholder="URL..."
                                                value={newLink}
                                                onChange={(e) => {setNewLink(e.target.value)}}
                                                onKeyDown={(e) => addNewLink(e)}
                                            />
                                        </form>

                                        <button className="btn-secondary btn pointer-cursor px-3" onClick={(e) => addNewLinkBtn(e, newQuestion)}>+</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
