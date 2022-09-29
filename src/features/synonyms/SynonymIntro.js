import {useDispatch} from "react-redux";


export default function SynonymIntro(){

    const dispatch = useDispatch();

    // function handleAddNewMemory(){
    //     console.log("handleAddNewMemory")
    //     dispatch(showAddMemoryForm(true))
    // }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about Synonyms. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button  type="button" className="btn btn-primary" >
                    + Add
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            {/*<BotEdit />*/}
        </div>
    );
}