import React, {useState} from "react";

export default function SemanticsFilter(props) {

    const theme = null;

    // const [selectedUser, setSelectedUser] = useState(null);
    const [searchFilter,setSearchFilter] = useState('');
    const [orderFilter,setOrderFilter] = useState('');
    const [semanticsFilter,setSemanticsFilter] = useState('');

    function handleSearchTextKeydown(e) {
    }

    function handleAddNew(){
    }


    return(
        <div className="d-flex justify-content-beteween w-100 mb-4">
            <div className="d-flex w-100">
                <div className="form-group me-2">
                    <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control " + theme}
                           onKeyPress={(e) => handleSearchTextKeydown(e)}
                           onChange={(e) => setSearchFilter(e.target.value)}/>
                </div>
                <div className="form-group me-2">
                    <select  placeholder={"Filter"} autoFocus={true} className={"form-select filter-text-width " + theme}
                             onChange={(e) => setOrderFilter(e.target.value)}>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="">Join</option>
                    </select>

                </div>
                <div className="form-group me-2">
                    <select type="text" placeholder={"Filter"} value={semanticsFilter} autoFocus={true} className={"form-select filter-text-width " + theme}
                            onChange={(e) => setSemanticsFilter(e.target.value)}>
                        <option value="all-users">All Semantics</option>
                    </select>
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