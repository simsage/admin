import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../app/store";
import {showAddOrganisationForm} from "./organisationSlice";

export default function OrganisationEdit(){

    let form = {
        edit_organisation: true,
        id: '',
        name: '',
        enabled: '',

    };

    const title = "Add a new Organisation";
    const theme = null;
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(showAddOrganisationForm(false));
        // store.dispatch(showAddKnowledgeBaseForm(false))
    }

    const show_organisation_form = useSelector((state) => state.organisation.show_organisation_form)
    if (!show_organisation_form)
        return (<div />);
    return(

        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               // onChange={(event) => this.setState({name: event.target.value})}
                                               placeholder="name"
                                               value={form.name}
                                        />
                                    </span>
                                </div>


                                <div className="control-row">
                                    <span className="checkbox-only">
                                        <input type="checkbox"
                                               checked={form.enabled}
                                               // onChange={(event) => { this.setState({enabled: event.target.checked}); }}
                                               value="enable this organisation?"
                                        />
                                    </span>
                                    <span>organisation enabled?</span>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}