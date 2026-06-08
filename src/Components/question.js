import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../Styles/style.css';

// A single accordion item. Beyond expanding/collapsing the answer, it exposes
// edit and delete actions that bubble up to the parent through callbacks.
const Question = ({ title, info, onEdit, onDelete }) => {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div className="question">
            <div className="title">
                <h4>
                    {title}
                </h4>
                <div className="actions">
                    <button
                        type="button"
                        aria-label={`Edit ${title}`}
                        className="action-btn"
                        onClick={onEdit}
                    >
                        <FiEdit2 />
                    </button>
                    <button
                        type="button"
                        aria-label={`Delete ${title}`}
                        className="action-btn"
                        onClick={onDelete}
                    >
                        <FiTrash2 />
                    </button>
                    <button
                        type="button"
                        aria-label={`${showInfo ? 'Collapse' : 'Expand'} answer for ${title}`}
                        aria-expanded={showInfo}
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        {showInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
                    </button>
                </div>
            </div>
            {showInfo && <p>{info}</p>}
        </div>

    );
}

export default Question;
