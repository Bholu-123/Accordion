import React, { useEffect, useState } from 'react';
import data from './Components/data';
import Question from './Components/question';
import QuestionForm from './Components/QuestionForm';
import './Styles/style.css';

// Key used to persist the accordion questions in the browser's localStorage so
// that CRUD changes survive a page reload.
const STORAGE_KEY = 'accordion.questions';

// Read the initial list of questions. We prefer anything the user has already
// saved in localStorage and fall back to the bundled seed data on first load.
const getInitialQuestions = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    // Corrupted/blocked storage should never break the app; fall back to seed.
    console.error('Failed to read questions from storage', error);
  }
  return data;
};

// Generate a unique id for a freshly created question. Date.now() is good enough
// for a single-user client side app and keeps ids monotonically increasing.
const createId = () => Date.now();

const App = () => {
  const [questions, setQuestions] = useState(getInitialQuestions);
  // When `editingId` is null the form is in "create" mode; otherwise it holds the
  // id of the question currently being edited.
  const [editingId, setEditingId] = useState(null);

  // Persist every change to localStorage so CRUD operations are durable.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
      console.error('Failed to save questions to storage', error);
    }
  }, [questions]);

  // CREATE: append a brand new question to the list.
  const addQuestion = ({ title, info }) => {
    setQuestions((prev) => [...prev, { id: createId(), title, info }]);
  };

  // UPDATE: replace the matching question with the edited values.
  const updateQuestion = ({ title, info }) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === editingId ? { ...question, title, info } : question
      )
    );
    setEditingId(null);
  };

  // DELETE: remove a question by id. If we were editing it, exit edit mode.
  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  // Submit handler shared by the form: routes to create or update based on mode.
  const handleSubmit = (values) => {
    if (editingId === null) {
      addQuestion(values);
    } else {
      updateQuestion(values);
    }
  };

  const editingQuestion =
    editingId === null
      ? null
      : questions.find((question) => question.id === editingId) || null;

  return (
    <div className="container">
      <h3>
        questions and answers <br /> about login
      </h3>
      <div className="content">
        <QuestionForm
          key={editingId || 'new'}
          initialValues={editingQuestion}
          onSubmit={handleSubmit}
          onCancel={() => setEditingId(null)}
        />
        {questions.length === 0 ? (
          <p className="empty">No questions yet. Add one above.</p>
        ) : (
          questions.map((question) => (
            <Question
              key={question.id}
              {...question}
              onEdit={() => setEditingId(question.id)}
              onDelete={() => deleteQuestion(question.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
