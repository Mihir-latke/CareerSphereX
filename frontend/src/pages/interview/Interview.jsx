import { useState, useEffect } from 'react'
import './Interview.css'

const QUESTIONS = [
  { id: 1, type: 'Behavioral', q: "Tell me about a time you had to deal with a difficult colleague. How did you handle it?" },
  { id: 2, type: 'Behavioral', q: "Describe a situation where you had to meet a tight deadline. What did you do?" },
  { id: 3, type: 'Technical', q: "Explain the difference between process and thread." },
  { id: 4, type: 'Technical', q: "What is dependency injection and why is it useful?" },
  { id: 5, type: 'Leadership', q: "Tell me about a time you took the initiative to improve a process." },
]

export default function Interview() {
  const [sessionActive, setSessionActive] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per question

  useEffect(() => {
    let timer;
    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && sessionActive) {
      handleNext()
    }
    return () => clearInterval(timer)
  }, [sessionActive, timeLeft])

  const startSession = () => {
    setSessionActive(true)
    setCurrentIdx(0)
    setAnswers({})
    setTimeLeft(120)
  }

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1)
      setTimeLeft(120)
    } else {
      setSessionActive(false)
    }
  }

  const currentQ = QUESTIONS[currentIdx]

  return (
    <div className="interview-page">
      <div className="interview-header">
        <span className="eyebrow-label">Ace the Room</span>
        <h1 className="interview-title">Interview Prep</h1>
        <p className="interview-sub">Practice common questions under time pressure.</p>
      </div>

      {!sessionActive && Object.keys(answers).length === 0 ? (
        <div className="interview-start card">
          <div className="start-icon">🎙️</div>
          <h2>Ready to practice?</h2>
          <p>You will face 5 questions. You have 2 minutes to type out your answer structure for each.</p>
          <button className="btn btn-primary" onClick={startSession}>Start Session</button>
        </div>
      ) : sessionActive ? (
        <div className="interview-active">
          <div className="active-header card">
            <div className="q-progress">Question {currentIdx + 1} of {QUESTIONS.length}</div>
            <div className={`q-timer ${timeLeft < 30 ? 'timer-danger' : ''}`}>
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="q-card card">
            <span className="q-type">{currentQ.type}</span>
            <h2 className="q-text">{currentQ.q}</h2>
            <textarea 
              className="q-textarea"
              placeholder="Type your STAR method response here..."
              value={answers[currentQ.id] || ''}
              onChange={e => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
              autoFocus
            />
            <div className="q-actions">
              <button className="btn btn-primary" onClick={handleNext}>
                {currentIdx === QUESTIONS.length - 1 ? 'Finish Session' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="interview-results">
          <h2>Session Complete! 🎉</h2>
          <p>Review your answers below to self-evaluate.</p>
          
          <div className="results-list">
            {QUESTIONS.map((q, i) => (
              <div key={q.id} className="result-card card">
                <span className="q-type">{q.type}</span>
                <h3 className="result-q">Q: {q.q}</h3>
                <div className="result-a">
                  <strong>Your Answer:</strong>
                  <p>{answers[q.id] || <span style={{color: '#666', fontStyle: 'italic'}}>No answer provided.</span>}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn btn-primary" onClick={startSession} style={{marginTop: '20px'}}>Practice Again</button>
        </div>
      )}
    </div>
  )
}
