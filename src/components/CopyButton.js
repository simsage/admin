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
        <span
            onClick={handleCopy}
            title="Copy into clipboard"
            style={{ marginLeft: '10px', width: '80px', cursor: 'pointer' }} // Adjust the width as needed
        >
            {copied ? '✅' : '📋'}
        </span>
    );
}
