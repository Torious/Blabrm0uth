// src/App.js
import React, { useState } from "react";
import "./App.css";
import blabrm0uth from "./blabrm0uth.png";
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [videoLink, setVideoLink] = useState("");
  const [captions, setCaptions] = useState(null);
  const [error, setError] = useState(null);
  const [option, setOption] = useState("full_captions");
  const [numWords, setNumWords] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fetchFullCaptions = async () => {
    try {
      const response = await fetch("https://blabrm0uth.herokuapp.com/captions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_link: videoLink }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaptions(data.captions);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while fetching captions.");
    }
    setLoading(false);
    setShowResults(true);
  };

  const fetchSummarizedCaptions = async () => {
    try {
      const response = await fetch("https://blabrm0uth.herokuapp.com/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_link: videoLink, words: numWords }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaptions(data.generated_text);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while fetching captions.");
    }
    setLoading(false);
    setShowResults(true);
  };

  const fetchQuestion = async () => {
    try {
      const response = await fetch("https://blabrm0uth.herokuapp.com/question/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_link: videoLink, question: question }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaptions(data.generated_text);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred while fetching captions.");
    }
    setLoading(false);
    setShowResults(true);
  };

  const fetchCaptions = () => {
    setLoading(true);
    setError(null);
    if (option === "full_captions") {
      fetchFullCaptions();
    } else if (option === "summarize") {
      fetchSummarizedCaptions();
    } else if (option === "question") {
      fetchQuestion();
    }
  };

  const handleDone = () => {
    setCaptions(null);
    setOption("full_captions");
    setVideoLink("");
    setQuestion("");
    setNumWords("");
    setShowResults(false);
  };

  const handleRegenerate = () => {
    setLoading(true);
    fetchCaptions();
  };

  const handleEdit = () => {
    setCaptions(null);
    setShowResults(false);
  };

  return (
    <div className="body">
      <nav className="navbar">
        <a href="https://github.com/Torious/Blabrm0uth" target="_blank" rel="noopener noreferrer">
          <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </nav>
      <div className="App">
        <img src={blabrm0uth} alt="blabrm0uth" />

        {!showResults && (
          <>
            <div className="tab-container">
              <button
                className={`tab ${option === "full_captions" ? "selected" : ""}`}
                onClick={() => setOption("full_captions")}
              >
                Transcript
              </button>
              <button
                className={`tab ${option === "summarize" ? "selected" : ""}`}
                onClick={() => setOption("summarize")}
              >
                Summary
              </button>
              <button
                className={`tab ${option === "question" ? "selected" : ""}`}
                onClick={() => setOption("question")}
              >
                Question
              </button>
            </div>

            <input
              type="text"
              value={videoLink}
              className="inputx"
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Enter YouTube video link"
            />

            {option === "summarize" && (
              <input
                type="number"
                className="inputx"
                value={numWords}
                onChange={(e) => setNumWords(e.target.value)}
                placeholder="Enter summary size"
              />
            )}
            {option === "question" && (
              <input
                type="text"
                className="inputx"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the video"
              />
            )}
            {loading ? (
              <div className="spinner" />
            ) : (
              <button onClick={fetchCaptions}>Submit</button>
            )}
          </>
        )}

        {captions && showResults && (
          <>
            <div className="caption-container">
              <p>{captions}</p>
            </div>
            {loading ? (
              <div className="spinner" />
            ) : (
              <div className="tab-container">
                <button onClick={handleDone}>Done</button>
                <button onClick={handleRegenerate}>Regenerate</button>
                <button onClick={handleEdit}>Edit</button>
              </div>
            )}
          </>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default App;