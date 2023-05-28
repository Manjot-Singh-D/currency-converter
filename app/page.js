"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// require("dotenv").config();
// Material Components
import Typography from "@mui/material/Typography";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TextField from "@mui/material/TextField";
// import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// CSS files
import "./styling/mainStyle.css";

// Assets
// import InputBg from "./assets/Images/InputBg.jsx";

export default function Home() {
  const [currencyValue, setCurrencyValue] = useState({
    toValue: 0,
    fromValue: 0,
    toCurrency: "",
    fromCurrency: "INR",
  });
  const [rates, setRates] = useState(null);
  const baseURL = "http://data.fixer.io/api/";
  const apiKey = `${process.env.NEXT_PUBLIC_API_KEY}`;
  useEffect(() => {
    const getLatestExchangeRates = async () => {
      try {
        const response = await axios.get(
          `${baseURL}latest?access_key=${apiKey}`
        );
        console.log(response);
        setRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    getLatestExchangeRates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [name]: value };
    });
  };
  return (
    <div>
      <Typography className="heading" variant="h2" gutterBottom>
        Currency Converter
      </Typography>
      <div className="inputForms">
        <div className="imageLeft">
          <div className="container">
            <TextField
              id="standard-helperText"
              label="From"
              helperText="Some important text"
              value={currencyValue.fromValue}
              name="fromValue"
              onChange={handleChange}
              variant="standard"
            />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={currencyValue.fromCurrency}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                name="fromCurrency"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <FormHelperText>Without label</FormHelperText>
            </FormControl>
          </div>
        </div>
        <SwapHorizIcon style={{ color: "#1e5ef3" }} />
        <div className="imageRight">
          <div className="container">
            <TextField
              id="standard-helperText"
              label="To"
              helperText="Some important text"
              value={currencyValue.toValue}
              name="toValue"
              onChange={handleChange}
              variant="standard"
            />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={currencyValue.toCurrency}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                name="toCurrency"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <FormHelperText>Without label</FormHelperText>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
