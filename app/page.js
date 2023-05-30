"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Material Components
import Typography from "@mui/material/Typography";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// CSS files
import "./styling/mainStyle.css";
import LoadingComponent from "./Components/LoadingComponent";

export default function Home() {
  const [currencyValue, setCurrencyValue] = useState({
    toValue: "",
    fromValue: "",
    toCurrency: "INR",
    fromCurrency: "USD",
  });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [currencyList, setCurrenyList] = useState([]);
  const [rates, setRates] = useState(null);

  const toggleBtn = useRef(null);

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
      setDate(todayDate);
      // setLoading(true);
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
            // setLoading(true);
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
      let newValue =
        (currentCurrencyValue * rates[currencyValue.toCurrency]) /
        rates[currencyValue.fromCurrency];
      if (newValue !== 0) newValue = newValue.toFixed(4);
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["toValue"]: newValue };
      });
    } else {
      let newValue =
        (currentCurrencyValue * rates[currencyValue.fromCurrency]) /
        rates[currencyValue.toCurrency];
      if (newValue !== 0) newValue = newValue.toFixed(4);
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
      let newValue =
        (currentCurrencyValue * rates[otherCurrency]) / rates[firstCountry];
      if (newValue !== 0) newValue = newValue.toFixed(4);
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["toValue"]: newValue };
      });
    } else {
      let newValue =
        (currentCurrencyValue * rates[otherCurrency]) / rates[firstCountry];
      if (newValue !== 0) newValue = newValue.toFixed(4);
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, ["fromValue"]: newValue };
      });
    }
  };

  const validInput = (name, value) => {
    if (name === "toValue" || name === "fromValue") {
      return !isNaN(value);
    }
    return true;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (validInput(name, value)) {
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
    }
  };
  const interchangeCurrencies = () => {
    toggleBtn.current.classList.toggle("rotate");
    setCurrencyValue((prevCurrencyValue) => {
      return {
        ...prevCurrencyValue,
        ["toValue"]: prevCurrencyValue.fromValue,
        ["fromValue"]: prevCurrencyValue.toValue,
        ["fromCurrency"]: prevCurrencyValue.toCurrency,
        ["toCurrency"]: prevCurrencyValue.fromCurrency,
      };
    });
  };
  const getConversionRate = (fromCurrency, toCurrency) => {
    let newValue = rates[toCurrency] / rates[fromCurrency];
    if (newValue !== 0) newValue = newValue.toFixed(4);
    return newValue;
  };
  return (
    <div className="app">
      {loading ? (
        <LoadingComponent text="Currency Converter" setLoading={setLoading} />
      ) : (
        <>
          <div className="leftText">
            <Typography className="heading" variant="h2" gutterBottom>
              Currency Converter
            </Typography>
            <p>
              Experience fast and accurate currency conversions with our
              user-friendly currency converter. Access real-time exchange rates
              and effortlessly convert currencies with multi-currency support.
              Simplify your financial transactions with our reliable and
              efficient tool.
            </p>
          </div>
          <div className="rightConverter">
            <p className="date">Today's Date : {date}</p>
            <div className="inputForms">
              <div className="fromCurrencyContainer">
                <div className="container">
                  <TextField
                    id="standard-helperText"
                    label="From"
                    value={currencyValue.fromValue}
                    name="fromValue"
                    onChange={handleChange}
                    variant="standard"
                    style={{ color: "#ffffff" }}
                  />
                  <FormControl>
                    <Select
                      value={currencyValue.fromCurrency}
                      onChange={handleChange}
                      displayEmpty
                      name="fromCurrency"
                    >
                      {currencyList &&
                        currencyList.map((currencyName, index) => {
                          if (currencyName !== currencyValue.toCurrency) {
                            return (
                              <MenuItem key={index} value={currencyName}>
                                {currencyName}
                              </MenuItem>
                            );
                          } else {
                          }
                        })}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <SwapHorizIcon
                onClick={interchangeCurrencies}
                ref={toggleBtn}
                style={{
                  color: "#1e5ef3",
                  position: "absolute",
                  zIndex: "10",
                  transform: "rotate(90deg)",
                  width: "25px",
                  height: "25px",
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "6px",
                  transition: "transform 100ms ease",
                  cursor: "pointer",
                }}
              />
              <div className="toCurrencyContainer">
                <div className="container">
                  <TextField
                    id="standard-helperText"
                    label="To"
                    value={currencyValue.toValue}
                    name="toValue"
                    onChange={handleChange}
                    variant="standard"
                  />
                  <FormControl>
                    <Select
                      value={currencyValue.toCurrency}
                      onChange={handleChange}
                      displayEmpty
                      name="toCurrency"
                    >
                      {currencyList &&
                        currencyList.map((currencyName, index) => {
                          if (currencyName !== currencyValue.fromCurrency) {
                            return (
                              <MenuItem key={index} value={currencyName}>
                                {currencyName}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                  <p className="conversionRate">
                    1 {currencyValue.fromCurrency} ={" "}
                    {getConversionRate(
                      currencyValue.fromCurrency,
                      currencyValue.toCurrency
                    )}
                    {"   "}
                    {currencyValue.toCurrency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
