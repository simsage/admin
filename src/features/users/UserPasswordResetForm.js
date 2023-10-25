import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {closeUserForm, updateUser} from "./usersSlice";
import {useForm} from "react-hook-form";

export function UserPasswordResetForm() {
    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const show_password_reset_form = useSelector((state) => state.usersReducer.show_password_reset_form);
    const user_id = useSelector((state) => state.usersReducer.edit_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);

    const [selectedUser, setSelectedUser] = useState({})

    const {register, handleSubmit, formState: {errors}, reset, watch} = useForm();


    useEffect(() => {
        if (user_id) {
            const temp_user = (user_list.filter((user) => user.id === user_id));
            setSelectedUser(temp_user.length === 1 ? temp_user[0] : {})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id])

    function handleClose() {
        // defaultValues()
        dispatch(closeUserForm())
    }

    useEffect(() => {
        let defaultValues = {}
        defaultValues.id = selectedUser ? selectedUser.id : '';
        defaultValues.email = selectedUser ? selectedUser.email : '';
        defaultValues.firstName = selectedUser ? selectedUser.firstName : '';
        defaultValues.surname = selectedUser ? selectedUser.surname : '';
        defaultValues.roles = selectedUser ? selectedUser.roles : '';
        defaultValues.groupList = selectedUser ? selectedUser.groupList : [];
        defaultValues.password = selectedUser ? selectedUser.password : '';
        defaultValues.password_repeat = selectedUser ? selectedUser.password : '';

        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_password_reset_form, selectedUser]);


    let pwd = watch("password");

    const onSubmit = data => {
        const session_id = session.id;
        data = {
            ...data,
            id: user_id,
            email:selectedUser.email
        }

        console.log('Saving...', data);
        dispatch(updateUser({session_id, organisation_id, data}));
        handleClose();
        console.log("UserEditV2 form submit", data)
    }

    if (show_password_reset_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Reset password</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="modal-body p-0">


                            <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>

                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <p className="label-2 small"><strong>User: </strong>  {selectedUser.firstName} {selectedUser.surname}</p>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <label className="label-2 small">New Password</label>
                                        <input type="password" className="form-control"
                                               autoFocus={true}
                                               autoComplete="false"
                                               name="password"
                                               {...register('password', {
                                                   required: {
                                                       value: "true",
                                                       message: "Password is required "
                                                   }
                                                   ,
                                                   minLength: {
                                                       value: 8,
                                                       message: "Password must have at least 8 characters"
                                                   }
                                               })}
                                        />
                                        {errors.password && <span
                                            className="text-danger fst-italic small">{errors.password.message}</span>}
                                    </div>
                                    <div className="control-row col-6">
                                        <label className="label-2 small">Confirm Password</label>
                                        <input type="password" className="form-control"
                                               autoComplete="false"
                                               name="password_repeat"
                                               {...register('password_repeat', {
                                                   required: {
                                                       value: "true",
                                                       message: "Confirm your password "
                                                   }
                                                   ,
                                                   validate: {
                                                       always: (value) =>
                                                           value === pwd || "The passwords do not match"
                                                   },
                                               })}

                                        />
                                        {errors.password_repeat && <span
                                            className="text-danger fst-italic small">{errors.password_repeat.message}</span>}

                                    </div>
                                </div>
                            </div>


                        </div>


                        <div className="modal-footer px-5 pb-3">
                            <button className="btn btn-white btn-block px-4" onClick={() => handleClose()}>Cancel
                            </button>
                            {/*<button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>*/}
                            <input className="btn btn-primary btn-block px-4" type="submit" value={"Save"}/>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    )
}