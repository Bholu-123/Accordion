import React, { useState } from 'react';
import '../Styles/style.css';

// Controlled form used for both creating a new question and editing an existing
// one. The parent decides the mode by passing `initialValues`:
//   - null      -> create mode (empty fields, "Add" button)
//   - an object -> edit mode (pre-filled fields, "Save" button)
const QuestionForm = ({ initialValues, onSubmit, onCancel }) => {
  const isEditing = Boolean(initialValues);
  const [title, setTitle] = useState(initialValues ? initialValues.title : '');
  const [info, setInfo] = useState(initialValues ? initialValues.info : '');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedInfo = info.trim();

    // Basic validation: both fields are required.
    if (!trimmedTitle || !trimmedInfo) {
      setError('Both question and answer are required.');
      return;
    }

    setError('');
    onSubmit({ title: trimmedTitle, info: trimmedInfo });

    // Reset the fields after a successful create so the user can add another.
    if (!isEditing) {
      setTitle('');
      setInfo('');
    }
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <h4>{isEditing ? 'Edit question' : 'Add a new question'}</h4>
      <input
        type="text"
        aria-label="question title"
        placeholder="Question"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        aria-label="question answer"
        placeholder="Answer"
        rows={3}
        value={info}
        onChange={(event) => setInfo(event.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? 'Save' : 'Add'}
        </button>
        {isEditing && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
