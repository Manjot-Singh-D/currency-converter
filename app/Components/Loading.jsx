import React, { useState, useEffect } from "react";

import "../styling/Loading.css";

function Loading(props) {
  const text = "Currency Converter";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const typingTimer = setInterval(() => {
      setDisplayedText((prevText) => {
        if (currentIndex === text.length - 1) {
          clearInterval(typingTimer);
          setInterval(() => {
            props.setLoading(false);
          }, 300);
        }
        currentIndex++;
        return prevText + text[currentIndex - 1];
      });
    }, 70);

    return () => {
      clearInterval(typingTimer);
    };
  }, []);

  return (
    <div className="loading-container">
      <h1 className="loading-text">{displayedText}</h1>
    </div>
  );
}

export default Loading;
