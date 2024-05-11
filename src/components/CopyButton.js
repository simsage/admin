import React, { useState } from 'react';

export function CopyButton({ reference }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        let contentToCopy = '';

        // Determine the type of reference and extract content accordingly
        if (typeof reference === 'string') {
            // If the reference is a string, it's a regular text reference
            contentToCopy = reference;
        } else if (typeof reference === 'function') {
            // If the reference is a function, call it
            contentToCopy = reference();
        } else if (reference.current && typeof reference.current.value === 'string') {
            // If the reference is a ref to a textarea, extract its value
            contentToCopy = reference.current.value;
        }

        // Copy the content to the clipboard
        const tempInput = document.createElement('textarea');
        tempInput.value = contentToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Update copied state and reset after 2 seconds
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            type="button"
            className={`btn btn-secondary${copied ? ' copied' : ''}`}
            title="Copy content"
            style={{ width: '80px' }} // Adjust the width as needed
        >
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
}
