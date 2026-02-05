import React, { useState } from "react";

const CreateLogbooks = ({ onCreate }) => {
    const [logbook, setLogbook] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLogbook(e.target.value);
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!logbook.trim()) {
            setError("Logbook name cannot be empty.");
            return;
        }
        if (onCreate) {
            onCreate(logbook.trim());
        }
        setLogbook("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
            <input
                type="text"
                value={logbook}
                onChange={handleChange}
                placeholder="Enter new logbook"
                aria-label="New logbook"
            />
            <button type="submit">Add Logbook</button>
            {error && (
                <span style={{ color: "red", marginLeft: "8px" }}>{error}</span>
            )}
        </form>
    );
};

export default CreateLogbooks;
