import React, { useState } from "react";
import "./FolderTagsInput.css";

const FolderTagsInput = ({ value, onChange }) => {
    // Initialize the tags state, filtering out any empty or whitespace-only tags
    const [inputValue, setInputValue] = useState("")
    const [tags, setTags] = useState(
        value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
    )

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = inputValue.trim()
            if (newTag && !tags.includes(newTag)) {
                const newTags = [...tags, newTag]
                setTags(newTags)
                onChange(newTags.join(","))
            }
            setInputValue("")
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            const newTags = tags.slice(0, -1)
            setTags(newTags)
            onChange(newTags.join(","))
        }
    }

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index)
        setTags(newTags)
        onChange(newTags.join(","))
    }

    return (
        <div className="tags-input-container">
            {tags.map((tag, index) => (
                <div key={index} className="tag-bubble">
                    {tag}
                    <span className="remove-tag" onClick={() => handleRemoveTag(index)}>
                        &times;
                    </span>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="tags-input"
                placeholder="Press 'enter' to add..."
            />
        </div>
    )
}

export default FolderTagsInput
