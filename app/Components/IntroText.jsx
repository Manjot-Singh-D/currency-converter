"use client";
import React from "react";

// CSS files
import "../styling/IntroText.css";

// MUI
import Typography from "@mui/material/Typography";

// Shows IntroText with Heading
const IntroText = () => {
  return (
    <>
      <div className="IntroText">
        <Typography className="heading" variant="h2" gutterBottom>
          Currency Converter
        </Typography>
        <p>
          Experience fast and accurate currency conversions with our
          user-friendly currency converter. Access real-time exchange rates and
          effortlessly convert currencies with multi-currency support. Simplify
          your financial transactions with our reliable and efficient tool.
        </p>
      </div>
    </>
  );
};

export default IntroText;
