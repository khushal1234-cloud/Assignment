import React, { useState, useEffect } from "react";
import './New.css';

export default function Content({ username, onLogout, onVideoPlay }) {
  const [activeTab, setActiveTab] = useState("videos");
  const [quizScores, setQuizScores] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userProgress, setUserProgress] = useState({
    videosWatched: [],
    quizzesCompleted: [],
    totalTimeSpent: 0
  });

  const videos = [
    { 
      id: "mathematics", 
      title: "Mathematics Fundamentals",
      description: "Learn the basics of algebra and calculus",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      duration: "15:30"
    },
    { 
      id: "physics", 
      title: "Physics Concepts",
      description: "Understanding motion, energy, and forces",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      duration: "12:45"
    },
    { 
      id: "chemistry", 
      title: "Chemistry Basics",
      description: "Elements, compounds, and chemical reactions",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      duration: "18:20"
    },
  ];

  const quizzes = {
    mathematics: {
      title: "Mathematics Quiz",
      questions: [
        {
          id: 1,
          question: "What is the derivative of x²?",
          options: ["2x", "x²", "2", "x"],
          correct: 0
        },
        {
          id: 2,
          question: "Solve: 2x + 5 = 15",
          options: ["5", "10", "7.5", "20"],
          correct: 0
        },
        {
          id: 3,
          question: "What is the value of π (pi) approximately?",
          options: ["3.14159", "3.16", "3.12", "3.18"],
          correct: 0
        }
      ]
    },
    physics: {
      title: "Physics Quiz",
      questions: [
        {
          id: 1,
          question: "What is Newton's first law?",
          options: ["F=ma", "Object at rest stays at rest", "Action-reaction", "Conservation of energy"],
          correct: 1
        },
        {
          id: 2,
          question: "What is the speed of light?",
          options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
          correct: 0
        }
      ]
    },
    chemistry: {
      title: "Chemistry Quiz",
      questions: [
        {
          id: 1,
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: 0
        },
        {
          id: 2,
          question: "How many electrons does carbon have?",
          options: ["4", "6", "8", "12"],
          correct: 1
        }
      ]
    }
  };

  const textContent = {
    mathematics: {
      title: "Mathematical Foundations",
      content: `
        Mathematics is the foundation of logical thinking and problem-solving. In this section, you'll explore:
        
        **Algebra Basics:**
        - Variables and expressions
        - Linear equations and inequalities
        - Quadratic functions
        
        **Calculus Introduction:**
        - Limits and continuity
        - Derivatives and their applications
        - Basic integration
        
        **Key Concepts:**
        Understanding mathematical relationships helps in analyzing patterns, making predictions, and solving complex problems across various fields.
      `
    },
    physics: {
      title: "Physics Fundamentals",
      content: `
        Physics explains how the universe works through fundamental laws and principles:
        
        **Mechanics:**
        - Motion in one and two dimensions
        - Forces and Newton's laws
        - Energy and momentum conservation
        
        **Thermodynamics:**
        - Heat and temperature
        - Laws of thermodynamics
        - Entropy and energy transfer
        
        **Applications:**
        Physics principles are applied in engineering, technology, and understanding natural phenomena.
      `
    },
    chemistry: {
      title: "Chemistry Essentials",
      content: `
        Chemistry studies matter and its interactions at the molecular level:
        
        **Atomic Structure:**
        - Electrons, protons, and neutrons
        - Electron configuration
        - Periodic table organization
        
        **Chemical Bonding:**
        - Ionic and covalent bonds
        - Molecular geometry
        - Intermolecular forces
        
        **Real-world Applications:**
        Chemistry is essential in medicine, materials science, and environmental protection.
      `
    }
  };

  // Log activity function
  const logActivity = async (activityType, details) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          event_type: activityType,
          details: JSON.stringify(details),
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await logActivity("tab_change", { tab, previous_tab: activeTab });
  };

  const handleVideoPlay = async (videoId) => {
    onVideoPlay(videoId);
    setUserProgress(prev => ({
      ...prev,
      videosWatched: [...new Set([...prev.videosWatched, videoId])]
    }));
    await logActivity("video_interaction", { video_id: videoId, action: "play" });
  };

  const handleVideoEnd = async (videoId) => {
    await logActivity("video_interaction", { video_id: videoId, action: "completed" });
  };

  const startQuiz = async (subject) => {
    setCurrentQuiz(subject);
    setSelectedAnswers({});
    await logActivity("quiz_start", { quiz_subject: subject });
  };

  const handleQuizAnswer = async (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    await logActivity("quiz_answer", { 
      quiz_subject: currentQuiz, 
      question_id: questionId, 
      answer_index: answerIndex 
    });
  };

  const submitQuiz = async () => {
    const quiz = quizzes[currentQuiz];
    let score = 0;
    
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score++;
      }
    });
    
    const percentage = Math.round((score / quiz.questions.length) * 100);
    setQuizScores(prev => ({ ...prev, [currentQuiz]: percentage }));
    setUserProgress(prev => ({
      ...prev,
      quizzesCompleted: [...new Set([...prev.quizzesCompleted, currentQuiz])]
    }));
    
    await logActivity("quiz_submit", { 
      quiz_subject: currentQuiz, 
      score: score, 
      total_questions: quiz.questions.length,
      percentage: percentage 
    });
    
    setCurrentQuiz(null);
    setSelectedAnswers({});
  };

  const handleTextRead = async (subject) => {
    await logActivity("text_content_view", { subject: subject });
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner container">
          <div className="nav-left">
            <strong>Welcome</strong> {username}
            <div className="progress-indicator">
              Progress: {userProgress.videosWatched.length}/3 videos, {userProgress.quizzesCompleted.length}/3 quizzes
            </div>
          </div>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => handleTabChange('videos')}
          >
            📹 Videos
          </button>
          <button 
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => handleTabChange('content')}
          >
            📚 Reading Material
          </button>
          <button 
            className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => handleTabChange('quizzes')}
          >
            🧠 Quizzes
          </button>
          <button 
            className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => handleTabChange('progress')}
          >
            📊 Progress
          </button>
        </div>

        {activeTab === 'videos' && (
          <div className="content-section">
            <h3 className="section-title">Educational Videos</h3>
            <div className="video-grid">
              {videos.map((video) => (
                <div className="video-card" key={video.id}>
                  <div className="video-header">
                    <h4>{video.title}</h4>
                    <span className="duration">{video.duration}</span>
                  </div>
                  <video
                    className="video"
                    controls
                    onPlay={() => handleVideoPlay(video.id)}
                    onEnded={() => handleVideoEnd(video.id)}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <div className="video-description">
                    <p>{video.description}</p>
                    {userProgress.videosWatched.includes(video.id) && 
                      <span className="completed-badge">✅ Watched</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-section">
            <h3 className="section-title">Reading Materials</h3>
            <div className="text-content-grid">
              {Object.entries(textContent).map(([subject, content]) => (
                <div key={subject} className="text-card" onClick={() => handleTextRead(subject)}>
                  <h4>{content.title}</h4>
                  <div className="text-content">
                    {content.content.split('\n').map((line, index) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h5 key={index}>{line.slice(2, -2)}</h5>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={index}>{line.slice(2)}</li>;
                      }
                      return line.trim() ? <p key={index}>{line}</p> : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="content-section">
            <h3 className="section-title">Knowledge Quizzes</h3>
            {!currentQuiz ? (
              <div className="quiz-selection">
                {Object.entries(quizzes).map(([subject, quiz]) => (
                  <div key={subject} className="quiz-card">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.questions.length} questions</p>
                    {quizScores[subject] && (
                      <div className="quiz-score">
                        Last Score: {quizScores[subject]}%
                      </div>
                    )}
                    <button 
                      className="btn btn-primary"
                      onClick={() => startQuiz(subject)}
                    >
                      {quizScores[subject] ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="quiz-container">
                <h4>{quizzes[currentQuiz].title}</h4>
                {quizzes[currentQuiz].questions.map((question, qIndex) => (
                  <div key={question.id} className="question-card">
                    <h5>Question {qIndex + 1}: {question.question}</h5>
                    <div className="options">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={selectedAnswers[question.id] === optIndex}
                            onChange={() => handleQuizAnswer(question.id, optIndex)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="quiz-actions">
                  <button 
                    className="btn btn-success"
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedAnswers).length !== quizzes[currentQuiz].questions.length}
                  >
                    Submit Quiz
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentQuiz(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="content-section">
            <h3 className="section-title">Your Learning Progress</h3>
            <div className="progress-dashboard">
              <div className="progress-card">
                <h4>Videos Watched</h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(userProgress.videosWatched.length / 3) * 100}%` }}
                  ></div>
                </div>
                <p>{userProgress.videosWatched.length} of 3 completed</p>
              </div>
              
              <div className="progress-card">
                <h4>Quizzes Completed</h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(userProgress.quizzesCompleted.length / 3) * 100}%` }}
                  ></div>
                </div>
                <p>{userProgress.quizzesCompleted.length} of 3 completed</p>
              </div>

              <div className="progress-card">
                <h4>Quiz Scores</h4>
                {Object.entries(quizScores).map(([subject, score]) => (
                  <div key={subject} className="score-item">
                    <span>{subject.charAt(0).toUpperCase() + subject.slice(1)}: </span>
                    <span className={`score ${score >= 70 ? 'good' : 'needs-improvement'}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="spacer" />
      </div>
    </>
  );
}
