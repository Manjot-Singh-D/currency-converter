"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// CSS files
import "./styling/mainStyle.css";
import Loading from "./Components/Loading";
import IntroText from "./Components/IntroText";
import ConverterTextField from "./Components/ConverterTextField";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [rates, setRates] = useState(null);

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
  
  const baseURL = "http://data.fixer.io/api/";
  const apiKey = `${process.env.NEXT_PUBLIC_API_KEY}`;
  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);
  const dataFromLocalStorage = retrieveDataFromLocalStorage("currency");
  const ratesDataFromLocalStorage =
    retrieveDataFromLocalStorage("ratesDateWise");

  useEffect(() => {
    if (dataFromLocalStorage) {
      setCurrencyList(dataFromLocalStorage);
    }
    if (
      ratesDataFromLocalStorage &&
      ratesDataFromLocalStorage["date"] === todayDate
    ) {
      setRates(ratesDataFromLocalStorage.ratesData);
      setDate(todayDate);
    } else {
      axios
        .get(`${baseURL}latest?access_key=${apiKey}`)
        .then((response) => {
          try {
            const currencyListValues = Object.keys(response.data.rates);

            setCurrencyList(currencyListValues);
            storeDataInLocalStorage("ratesDateWise", {
              date: response.data.date,
              ratesData: response.data.rates,
            });
            storeDataInLocalStorage("currency", currencyListValues);
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
