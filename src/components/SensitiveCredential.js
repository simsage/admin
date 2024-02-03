import Api from "../common/api";
import React, { useState } from 'react';

const ApiTokenInput = ({ selected_source, specific_json, onChange, name, placeholder = "" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className={`small ${Api.hasSourceId(selected_source) ? '' : 'required'}`}>
                {name}
            </label>
            <span className="fst-italic fw-light small">
                {Api.hasSourceId(selected_source) ? ' (leave blank to keep previous)' : ''}
            </span>
            <form className="input-group" autoComplete="off">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder={placeholder}
                    value={specific_json}
                    onChange={onChange}
                    required
                />
                {showPassword ?
                    <span onClick={toggle} style={{ cursor: 'pointer' }} className="input-group-text bi bi-eye"/> :
                    <span onClick={toggle} style={{ cursor: 'pointer' }} className="input-group-text bi bi-eye-slash"/>
                }
            </form>
        </div>
    );
};

export default ApiTokenInput;