import React, {useState} from "react";

export default function BotFilter(props) {

    const theme = null;

    const [searchFilter,setSearchFilter] = useState('');

    function handleSearchTextKeydown(e) {
        console.log("handleSearchTextKeydown")
        // if (e.key === "Enter" && this.props.selected_organisation_id) {
        //     this.props.getUsers(this.props.selected_organisation_id);
        // }
    }

    function handleAddNew(){
        console.log("handleAddNew")
    }


    return(
        <div className="d-flex justify-content-beteween w-100 mb-4">
            <div className="d-flex w-100">
                <div className="form-group me-2">
                    <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control " + theme}
                           onKeyPress={(e) => handleSearchTextKeydown(e)}
                           onChange={(e) => setSearchFilter(e.target.value)}/>
                </div>

            </div>

            <div className="form-group col ms-auto">
                <button className="btn btn-primary text-nowrap" onClick={() => handleAddNew()}>
                    + Add
                </button>
            </div>
        </div>
    );
}