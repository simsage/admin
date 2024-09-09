import React, { useState, useRef, useEffect } from 'react';

function CustomSelect({ options, defaultValue, disabled, onChange, label }) {
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

    return (
        <div className="dropdown">
            <button className={`btn ${disabled ? 'disabled' : 'btn-light'} 
            dropdown-toggle d-flex align-items-center justify-content-between w-100`}
                    id="kb-selector"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={handleToggleDropdown}
            >
                <span>
                    {options.find(option => option.key === selectedValue)?.value ?? label ?? 'Select Knowledge Base'}
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
                        onClick={() => handleSelectOption(item.key)}
                        style={{ margin: "5px 0", paddingRight: "1rem" }}>{item.value}</li>
                ))}
            </ul>
        </div>
    )
}

export default CustomSelect;
