import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

const questionText = 'Do I have to allow the use of cookies?';
const answerText = 'Unicorn vinyl poutine brooklyn, next level direct trade iceland';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders questions and toggles an answer', () => {
  act(() => {
    ReactDOM.render(<App />, container);
  });

  expect(container.textContent).toContain('questions and answers');
  expect(container.textContent).toContain('about login');

  const question = Array.from(container.querySelectorAll('.question')).find((item) =>
    item.textContent.includes(questionText)
  );

  expect(question).not.toBeNull();
  expect(question.textContent).not.toContain(answerText);

  const toggle = question.querySelector('button');

  act(() => {
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(question.textContent).toContain(answerText);

  act(() => {
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(question.textContent).not.toContain(answerText);
});
