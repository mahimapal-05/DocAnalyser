import React, { useState } from 'react';

export default function QuizModule({ questions }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIdx: optionSelected }
  const [submitted, setSubmitted] = useState({}); // { questionIdx: true }
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div style={{ color: 'var(--text-dark)', fontSize: '0.85rem' }}>
        No quiz questions available for this document.
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  const handleSelectOption = (option) => {
    if (submitted[currentIdx]) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: option
    });
  };

  const handleSubmitAnswer = () => {
    const selectedOption = selectedAnswers[currentIdx];
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setSubmitted({
      ...submitted,
      [currentIdx]: true
    });
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setSubmitted({});
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="quiz-score-circle">
        <div className="quiz-score-val">{score} / {totalQuestions}</div>
        <div className="quiz-score-label">Questions Correct</div>
        <button 
          className="new-btn" 
          onClick={resetQuiz} 
          style={{ width: 'auto', padding: '10px 24px', marginTop: '16px' }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const hasAnswered = selectedAnswers[currentIdx] !== undefined;
  const isAnswerSubmitted = submitted[currentIdx] === true;
  const chosenAnswer = selectedAnswers[currentIdx];
  const isAnswerCorrect = chosenAnswer === currentQuestion.correct_answer;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-dark)' }}>
          <span>Question {currentIdx + 1} of {totalQuestions}</span>
          <span>Score: {score}</span>
        </div>
        <div className="quiz-question">
          {currentQuestion.question}
        </div>
        <div className="quiz-options">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "";
            if (chosenAnswer === option) {
              btnClass = "selected";
            }
            if (isAnswerSubmitted) {
              if (option === currentQuestion.correct_answer) {
                btnClass = "correct";
              } else if (chosenAnswer === option) {
                btnClass = "incorrect";
              }
            }
            return (
              <button
                key={idx}
                className={`quiz-option-btn ${btnClass}`}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswerSubmitted}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswerSubmitted && (
          <div className={`quiz-feedback ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
            {isAnswerCorrect ? (
              <span>✓ Correct! Fantastic explanation.</span>
            ) : (
              <span>✗ Incorrect. Correct answer: {currentQuestion.correct_answer}</span>
            )}
          </div>
        )}
      </div>

      <div className="quiz-nav">
        <div></div> {/* spacer */}
        {!isAnswerSubmitted ? (
          <button
            className="quiz-nav-btn"
            onClick={handleSubmitAnswer}
            disabled={!hasAnswered}
            style={{ backgroundColor: hasAnswered ? 'var(--theme-color)' : 'var(--bg-tertiary)', border: hasAnswered ? 'none' : '1px solid var(--glass-border)' }}
          >
            Submit Answer
          </button>
        ) : (
          <button className="quiz-nav-btn" onClick={handleNext} style={{ backgroundColor: 'var(--theme-color)', border: 'none' }}>
            {currentIdx < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
