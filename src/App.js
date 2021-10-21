import React, { useState } from 'react';
import data from './Components/data';
import Question from './Components/question';
import './Styles/style.css';

const App = () => {
  const [questions,setQuestion]=useState(data);

  return (
    <div className="container">
      <h3>questions and answers <br/> about login</h3>
        <div className='content'>
          {questions.map((question) => {
            return (
              <Question key={question.id} {...question}></Question>
            );
          })}
        </div>
    </div>
  );
}

export default App;
