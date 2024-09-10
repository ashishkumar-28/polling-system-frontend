import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Chat from './Chat';

const Teacher = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [duration, setDuration] = useState(60);
  const [pollResults, setPollResults] = useState({});
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [pollActive, setPollActive] = useState(false);
  const [pastPolls, setPastPolls] = useState([]);
  const [showPastPolls, setShowPastPolls] = useState(false);
  const [studentIdToKick, setStudentIdToKick] = useState('');

  useEffect(() => {
    socket.on('pollResults', (results) => {
      setPollResults(results);
    });

    socket.on('pollEnded', (finalResults) => {
      setPollResults(finalResults);
      setPollActive(false);
    });

    socket.on('receivePastPolls', (polls) => {
      setPastPolls(polls);
    });

    return () => {
      socket.off('pollResults');
      socket.off('pollEnded');
      socket.off('receivePastPolls');
    };
  }, []);

  const createPoll = () => {
    if (question.trim() && options.some((option) => option.trim())) {
      socket.emit('createPoll', { question, options, duration, correctAnswer });
      setPollActive(true);
      setQuestion('');
      setOptions(['', '', '']);
      setCorrectAnswer([]);
    }
  };

  const endPoll = () => {
    socket.emit('endPoll');
  };

  const kickStudent = () => {
    socket.emit('kickStudent', studentIdToKick);
    setStudentIdToKick('');
  };

  const togglePastPolls = () => {
    setShowPastPolls((prev) => !prev);
    if (!showPastPolls) {
      socket.emit('getPastPolls');
    }
  };

  return (
    <div className="teacher-container">
      <div className="teacher-left w-1/4 bg-gray-100 p-4 shadow-lg">
        <h2 className="text-2xl mb-4">Teacher Panel</h2>

        <div className="mb-4">
          <h3 className="text-xl mb-2">Kick a Student</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={studentIdToKick}
            onChange={(e) => setStudentIdToKick(e.target.value)}
            className="p-2 border rounded-md mb-2"
          />
          <button onClick={kickStudent} className="w-full bg-red-500 text-white p-2 rounded-md">
            Kick Student
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xl mb-2">Show Past Polls</h3>
          <button onClick={togglePastPolls} className="w-full bg-blue-500 text-white p-2 rounded-md">
            {showPastPolls ? 'Hide Past Polls' : 'Show Past Polls'}
          </button>
          {showPastPolls && (
            <ul className="mt-4 list-disc pl-5">
              {pastPolls.length > 0 ? (
                pastPolls.map((poll, index) => (
                  <li key={index}>
                    {poll.question} - Correct Answer: {poll.correctAnswer.join(', ')}
                  </li>
                ))
              ) : (
                <li>No past polls available</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Right section for chat and poll creation */}
      <div className="teacher-right w-3/4 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl mb-2">Create a New Poll</h3>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          {options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full p-2 border rounded-md mb-2"
              />
              <label className="mr-2">
                <input
                  type="checkbox"
                  checked={correctAnswer.includes(option)}
                  onChange={(e) => {
                    const updatedCorrectAnswers = [...correctAnswer];
                    if (e.target.checked) {
                      updatedCorrectAnswers.push(option);
                    } else {
                      const index = updatedCorrectAnswers.indexOf(option);
                      if (index > -1) {
                        updatedCorrectAnswers.splice(index, 1);
                      }
                    }
                    setCorrectAnswer(updatedCorrectAnswers);
                  }}
                  className="mr-1"
                />
                Mark as Correct Answer
              </label>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border rounded-md mb-4"
          />
          <button onClick={createPoll} className="w-full bg-green-500 text-white p-2 rounded-md mb-2">
            Create Poll
          </button>

          {pollActive && (
            <button onClick={endPoll} className="w-full bg-red-500 text-white p-2 rounded-md">
              End Poll
            </button>
          )}
        </div>

        <div>
          <h3 className="text-xl mb-4">Poll Results:</h3>
          <ul className="list-disc pl-5">
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
        </div>

        {/* <div className="absolute right-4 bottom-4 chat-container w-80 bg-gray-800 p-4 shadow-lg rounded-md">
  <Chat username="Teacher" />
</div> */}

<Chat username="Teacher" />


      </div>
    </div>
  );
};

export default Teacher;
