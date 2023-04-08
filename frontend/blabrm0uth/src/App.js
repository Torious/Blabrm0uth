// src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [videoLink, setVideoLink] = useState("");
  const [captions, setCaptions] = useState(null);
  const [error, setError] = useState(null);

  const fetchCaptions = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/captions/", {
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
  };

  return (
    <div className="App">
      <h1>YouTube Caption Fetcher</h1>
      <input
        type="text"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        placeholder="Enter YouTube video link"
      />
      <button onClick={fetchCaptions}>Submit</button>
      {captions && (
        <div>
          <h2>Captions:</h2>
          <p>{captions}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;

