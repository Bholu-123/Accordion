import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question from './question';

it('reveals the answer when the question is expanded', () => {
  const title = 'Do I have to allow the use of cookies?';
  const info = 'Unicorn vinyl poutine brooklyn, next level direct trade iceland.';

  render(<Question title={title} info={info} />);

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.queryByText(info)).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button'));

  expect(screen.getByText(info)).toBeInTheDocument();
});
