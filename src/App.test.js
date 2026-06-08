import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

// Ensure each test starts from a clean slate so localStorage from one test does
// not leak into the next.
beforeEach(() => {
  window.localStorage.clear();
});

const fillForm = (title, info) => {
  fireEvent.change(screen.getByLabelText('question title'), {
    target: { value: title },
  });
  fireEvent.change(screen.getByLabelText('question answer'), {
    target: { value: info },
  });
};

test('renders the seed questions on first load', () => {
  render(<App />);
  expect(
    screen.getByText('Do I have to allow the use of cookies?')
  ).toBeInTheDocument();
});

test('CREATE: adds a new question to the list', () => {
  render(<App />);
  fillForm('New question?', 'New answer.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(screen.getByText('New question?')).toBeInTheDocument();
});

test('CREATE: validation blocks empty submissions', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(
    screen.getByText('Both question and answer are required.')
  ).toBeInTheDocument();
});

test('DELETE: removes a question from the list', () => {
  render(<App />);
  const title = 'What is BankID?';
  const card = screen.getByText(title).closest('.question');
  fireEvent.click(within(card).getByLabelText(`Delete ${title}`));

  expect(screen.queryByText(title)).not.toBeInTheDocument();
});

test('UPDATE: edits an existing question', () => {
  render(<App />);
  const title = 'What is BankID?';
  const card = screen.getByText(title).closest('.question');
  fireEvent.click(within(card).getByLabelText(`Edit ${title}`));

  // Form switches to edit mode and is pre-filled.
  expect(screen.getByText('Edit question')).toBeInTheDocument();
  fillForm('What is BankID (updated)?', 'An updated answer.');
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

  expect(screen.getByText('What is BankID (updated)?')).toBeInTheDocument();
  expect(screen.queryByText(title)).not.toBeInTheDocument();
});

test('PERSIST: questions survive a remount via localStorage', () => {
  const { unmount } = render(<App />);
  fillForm('Persisted question?', 'Persisted answer.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  unmount();

  render(<App />);
  expect(screen.getByText('Persisted question?')).toBeInTheDocument();
});
