import React, { useState, useEffect } from "react";

// CSS files
import "../styling/Loading.css";

// Loading Screen showing Currency Converter text using letter to letter typing
function Loading(props) {
  const text = "Currency Converter";
  const [displayedText, setDisplayedText] = useState("");

  // showing the text letter to letter with interval of 70ms.
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
