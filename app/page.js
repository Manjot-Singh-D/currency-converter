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
import { CleaningServices } from "@mui/icons-material";

// Assets
// import InputBg from "./assets/Images/InputBg.jsx";

export default function Home() {
  const [currencyValue, setCurrencyValue] = useState({
    toValue: 0,
    fromValue: 0,
    toCurrency: "INR",
    fromCurrency: "USD",
  });
  const [currencyList, setCurrenyList] = useState([]);
  const [rates, setRates] = useState(null);
  const baseURL = "http://data.fixer.io/api/";
  const apiKey = `${process.env.NEXT_PUBLIC_API_KEY}`;

  useEffect(() => {
    const storeDataInLocalStorage = (key, data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
      }
    };
    const retrieveDataFromLocalStorage = (key) => {
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
      }
      return null;
    };

    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);

    const dataFromLocalStorage = retrieveDataFromLocalStorage("currency");
    const ratesDataFromLocalStorage =
      retrieveDataFromLocalStorage("ratesDateWise");
    if (dataFromLocalStorage) {
      setCurrenyList(dataFromLocalStorage);
    }
    if (
      ratesDataFromLocalStorage &&
      ratesDataFromLocalStorage["date"] === todayDate
    ) {
      setRates(ratesDataFromLocalStorage.ratesData);
    } else {
      axios
        .get(`${baseURL}latest?access_key=${apiKey}`)
        .then((response) => {
          try {
            const currencyListValues = Object.keys(response.data.rates);

            if (currencyListValues.length === 0) {
              setCurrenyList(currencyListValues);
            }
            storeDataInLocalStorage("ratesDateWise", {
              date: response.data.date,
              ratesData: response.data.rates,
            });
            storeDataInLocalStorage("currency", currencyListValues);

            setRates(response.data.rates);
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.error("Error fetching exchange rates:", err);
        });
    }
  }, []);

  const handleAmountChange = (currentCurrencyUsed, currentCurrencyValue) => {
    if (currentCurrencyUsed === "fromValue") {
      const newValue =
        (currentCurrencyValue * rates[currencyValue.toCurrency]) /
        rates[currencyValue.fromCurrency];
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["toValue"]: newValue };
      });
    } else {
      const newValue =
        (currentCurrencyValue * rates[currencyValue.fromCurrency]) /
        rates[currencyValue.toCurrency];
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["fromValue"]: newValue };
      });
    }
  };
  const handleCurrencyChange = (
    currentCurrencyUsed,
    currentCurrencyValue,
    firstCountry,
    otherCurrency
  ) => {
    if (currentCurrencyUsed === "fromValue") {
      const newValue =
        (currentCurrencyValue * rates[otherCurrency]) / rates[firstCountry];
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["toValue"]: newValue };
      });
    } else {
      const newValue =
        (currentCurrencyValue * rates[otherCurrency]) / rates[firstCountry];
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["fromValue"]: newValue };
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [name]: value };
    });
    if (name === "toValue" || name === "fromValue") {
      handleAmountChange(name, value);
    } else {
      if (name === "toCurrency") {
        handleCurrencyChange(
          "fromValue",
          currencyValue.fromValue,
          currencyValue.fromCurrency,
          value
        );
      } else {
        handleCurrencyChange(
          "toValue",
          currencyValue.toValue,
          currencyValue.toCurrency,
          value
        );
      }
    }
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
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                {currencyList &&
                  currencyList.map((currencyName, index) => {
                    return (
                      <MenuItem key={index} value={currencyName}>
                        {currencyName}
                      </MenuItem>
                    );
                  })}
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
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                {currencyList &&
                  currencyList.map((currencyName, index) => {
                    return (
                      <MenuItem key={index} value={currencyName}>
                        {currencyName}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText>Without label</FormHelperText>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
