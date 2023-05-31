"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// CSS files
import "./styling/mainStyle.css";

// Components
import Loading from "./Components/Loading";
import IntroText from "./Components/IntroText";
import ConverterTextField from "./Components/ConverterTextField";

export default function Home() {
  /*
    States
    1. Loading - For Showing the Loading Screen  
    2. Date - For Getting Today's Date
    3. CurrencyList - List of all countries currency
    4. Rates - Rate List of each country's currency with respect to EUR
  */
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [rates, setRates] = useState(null);

  /*
    Local Storage Functions
    1. StoreDataInLocalStorage
      => key - key for storing the data to local storage
      => data - data to store to local storage
    
    2. retrieveDataFromLocalStorage
      => key - key for storing the data to local storage
  */
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

  /*
    baseURL - URL for currency converter API
    apiKey - API KEY for fixer currency converter
    today, todayDate - Date in the format (yyyy/mm/dd)
    dataFromLocalStorage - get currency data from local storage
    ratesDataFromLocalStorage - get rates of currency with respect to EUR datewise. 
  */
  const apiKey = `${process.env.NEXT_PUBLIC_API_KEY}`;
  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);
  const dataFromLocalStorage = retrieveDataFromLocalStorage("currency");
  const ratesDataFromLocalStorage =
    retrieveDataFromLocalStorage("ratesDateWise");

  /*
    useEffect - To be run first time when component renders
  */
  useEffect(() => {
    // Check for the currencyList data from Local Storage
    if (dataFromLocalStorage) {
      setCurrencyList(dataFromLocalStorage);
    }
    // Check for the rateList data from Local Storage
    if (
      ratesDataFromLocalStorage &&
      ratesDataFromLocalStorage["date"] === todayDate
    ) {
      setRates(ratesDataFromLocalStorage.ratesData);
      setDate(todayDate);
    }
    // If ratelist not found on local Storage
    else {
      // Axios Request for getting rateList and currencyList
      axios
        .get(`https://api.apilayer.com/fixer/${todayDate}?base=USD`, {
          headers: {
            apikey: apiKey,
          },
        })
        .then((response) => {
          try {
            const currencyListValues = Object.keys(response.data.rates);
            // Add rates data to local Storage
            storeDataInLocalStorage("ratesDateWise", {
              date: response.data.date,
              ratesData: response.data.rates,
            });
            // Add currencyList data to local storage
            storeDataInLocalStorage("currency", currencyListValues);

            // Set States
            setCurrencyList(currencyListValues);
            setDate(todayDate);
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

  return (
    <div className="app">
      {loading ? (
        <Loading text="Currency Converter" setLoading={setLoading} />
      ) : (
        <>
          <IntroText />
          <ConverterTextField
            date={date}
            currencyList={currencyList}
            rates={rates}
          />
        </>
      )}
    </div>
  );
}
