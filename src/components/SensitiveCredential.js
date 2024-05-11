import Api from "../common/api";
import React, { useState } from 'react';

const ApiTokenInput = ({ selected_source, specific_json, onChange, name, placeholder = "" , required = true}) => {
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
            <div className="input-group">
                { required &&
                <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="off"
                    className="form-control"
                    placeholder={placeholder}
                    value={specific_json}
                    onChange={onChange}
                    required
                />
                }
                { !required &&
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="off"
                        className="form-control"
                        placeholder={placeholder}
                        value={specific_json}
                        onChange={onChange}
                    />
                }
                {showPassword ?
                    <span onClick={toggle} style={{ cursor: 'pointer' }} className="input-group-text bi bi-eye"/> :
                    <span onClick={toggle} style={{ cursor: 'pointer' }} className="input-group-text bi bi-eye-slash"/>
                }
            </div>
        </div>
    );
};

export default ApiTokenInput;