import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Chat from './Chat';

const Student = () => {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [pollResults, setPollResults] = useState({});
  const [pollActive, setPollActive] = useState(false);
  const [nameSet, setNameSet] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    socket.on('newPoll', (data) => {
      setQuestion(data.question);
      setOptions(data.options);
      setPollActive(true);
      setSelectedOption('');
      setTimeLeft(data.duration || 60);
      setFeedback('');
      setPollResults({});
    });

    socket.on('pollResults', (results) => {
      setPollResults(results);
    });

    socket.on('pollEnded', (finalResults) => {
      setPollResults(finalResults);
      setPollActive(false);
    });

    socket.on('answerFeedback', (data) => {
      setFeedback(data.isCorrect
        ? `Your answer is correct! The correct answer is: ${data.correctAnswer.join(', ')}.`
        : `Your answer is incorrect. The correct answers are: ${data.correctAnswer.join(', ')}.`
      );
    });

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    if (timeLeft === 0 && pollActive) {
      setPollActive(false);
      socket.emit('pollTimeExpired');
    }

    return () => {
      clearInterval(timer);
      socket.off('newPoll');
      socket.off('pollResults');
      socket.off('pollEnded');
      socket.off('answerFeedback');
    };
  }, [timeLeft, pollActive]);

  const submitAnswer = () => {
    if (selectedOption.trim()) {
      socket.emit('submitAnswer', { answer: selectedOption });
      setPollActive(false);
    }
  };

  const setStudentName = () => {
    if (name.trim()) {
      setNameSet(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      {!nameSet ? (
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Enter your name</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <button onClick={setStudentName} className="w-full bg-blue-500 text-white p-2 rounded-md">
            Submit
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Student: {name}</h2>

          {pollActive ? (
            <div>
              <h3 className="text-xl font-semibold mb-2">Question: {question}</h3>
              <p className="mb-2">Time left: {timeLeft} seconds</p>
              {options.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="radio"
                    id={`option${index}`}
                    name="pollOption"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`option${index}`}>{option}</label>
                </div>
              ))}
              <button onClick={submitAnswer} className="w-full bg-green-500 text-white p-2 rounded-md">
                Submit Answer
              </button>
              {feedback && <p className="mt-4">{feedback}</p>}
            </div>
          ) : (
            <div>
              <h3 className="text-xl mb-4">No active poll</h3>
            </div>
          )}

          <h3 className="text-xl font-semibold mb-2">Poll Results:</h3>
          <ul className="list-disc pl-5 max-h-24 overflow-y-auto">
            {Object.entries(pollResults).length > 0 ? (
              Object.entries(pollResults).map(([option, count]) => (
                <li key={option} className="mb-1">
                  {option}: {count}
                </li>
              ))
            ) : (
              <li>No results to display</li>
            )}
          </ul>

          <Chat username={name} />
        </div>
      )}
    </div>
  );
};

export default Student;
