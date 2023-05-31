"use client";
import React from "react";

// CSS Files
import "../styling/Error.css";

// MUI
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// Showing Error at bottom right
const Error = () => {
  return (
    <>
      <Alert severity="error" className="error">
        <AlertTitle>
          <strong>API Error</strong>
        </AlertTitle>
        Couldn't modify - Contact the admin {"(API Limit Exceed)"}
      </Alert>
    </>
  );
};

export default Error;
