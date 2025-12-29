import React, { useState, useRef, useEffect } from 'react';
import {limit} from "../common/api";

function CustomSelect({ options, defaultValue, disabled, onChange, label, useKeyInHints }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.key);
    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
        if (!disabled) setIsOpen(!isOpen)
    }

    const handleSelectOption = (value) => {
        setSelectedValue(value)
        setIsOpen(false)
        if (onChange) {
            onChange(value)
        }
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setSelectedValue(defaultValue)
    }, [defaultValue])

    const select_str = 'Select Knowledge Base'
    const option_str = options.find(option => option.key === selectedValue)?.value ?? label ?? select_str

    return (
        <div className="dropdown">
            <button className={`btn ${disabled ? 'disabled' : ''} 
            dropdown-toggle d-flex align-items-center justify-content-between w-100`}
                    id="kb-selector"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={handleToggleDropdown}
            >
                <span title={option_str !== select_str ? ("Active Knowledge Base: " + option_str) : ("Select a Knowledge Base from this dropdown list")}>
                    {limit(option_str)}
                </span>
            </button>
            <ul className={`dropdown-menu w-100 ${isOpen ? 'show' : ''}`}
                aria-labelledby="kb-selector"
                ref={dropdownRef}
                style={{ maxHeight: "290px", overflowY: "auto" }}
            >
                {options.map((item) => (
                    <li key={item.key}
                        className={`dropdown-item ${item.key === selectedValue ? 'active' : ''}`}
                        title={useKeyInHints ? (item.value + " (" + item.key + ")") : item.value}
                        onClick={() => handleSelectOption(item.key)}
                        style={{ margin: "5px 0", paddingRight: "1rem" }}>{limit(item.value)}</li>
                ))}
            </ul>
        </div>
    )
}

export default CustomSelect;
