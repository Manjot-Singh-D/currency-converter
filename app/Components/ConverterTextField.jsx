"use client";
import React, { useState, useRef } from "react";
import {
  getAmountByRate,
  getConversionRate,
  validInput,
} from "./Action/ActionFunctions";
// Material Components
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import "../styling/mainStyle.css";
import InputText from "./InputText";
import ConversionRate from "./ConversionRate";

const ConverterTextField = ({ date, currencyList, rates }) => {
  const [currencyValue, setCurrencyValue] = useState({
    toValue: "",
    fromValue: "",
    toCurrency: "INR",
    fromCurrency: "USD",
  });
  const toggleBtn = useRef(null);

  const getAmountByRate = (currencyValue, currency1, currency2, rates) => {
    let newValue = (currencyValue * rates[currency1]) / rates[currency2];
    if (newValue !== 0) newValue = newValue.toFixed(4);

    return newValue;
  };
  const getConversionRate = (fromCurrency, toCurrency, rates) => {
    return getAmountByRate(1, toCurrency, fromCurrency, rates);
  };
  const handleAmountChange = (
    currency1,
    currency2,
    currentCurrencyUsedLabel,
    currentCurrencyValue
  ) => {
    let otherLabel;
    if (currentCurrencyUsedLabel === "fromValue") {
      otherLabel = "toValue";
    } else {
      otherLabel = "fromValue";
    }
    let newValue = getAmountByRate(
      currentCurrencyValue,
      currency1,
      currency2,
      rates
    );
    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [otherLabel]: newValue };
    });
  };
  const handleCurrencyChange = (
    currentCurrencyUsedLabel,
    currentCurrencyValue,
    currency1,
    currency2
  ) => {
    let otherLabel;
    if (currentCurrencyUsedLabel === "fromValue") {
      otherLabel = "toValue";
    } else {
      otherLabel = "fromValue";
    }
    let newValue = getAmountByRate(
      currentCurrencyValue,
      currency1,
      currency2,
      rates
    );
    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [otherLabel]: newValue };
    });
  };
  const validInput = (label, value) => {
    if (label === "toValue" || label === "fromValue") {
      return !isNaN(value);
    }
    return true;
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
  const changeCurrencyValue = (label, value) => {
    if (label === "fromValue") {
      handleAmountChange(
        currencyValue.toCurrency,
        currencyValue.fromCurrency,
        label,
        value
      );
    } else if (label === "toValue") {
      handleAmountChange(
        currencyValue.fromCurrency,
        currencyValue.toCurrency,
        label,
        value
      );
    }
  };
  const changeCurrencyName = (label, value) => {
    if (label === "toCurrency") {
      handleCurrencyChange(
        "fromValue",
        currencyValue.fromValue,
        value,
        currencyValue.fromCurrency
      );
    } else if (label === "fromCurrency") {
      handleCurrencyChange(
        "toValue",
        currencyValue.toValue,
        value,
        currencyValue.toCurrency
      );
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    let label = name;
    if (validInput(label, value)) {
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, [label]: value };
      });

      changeCurrencyValue(label, value);
      changeCurrencyName(label, value);
    }
  };
  return (
    <div className="ConverterTextField">
      <p className="date">Today's Date : {date}</p>
      <div className="inputForms">
        <div className="fromCurrencyContainer">
          <div className="container">
            <InputText
              label={"From"}
              value={currencyValue.fromValue}
              valueLabel={"fromValue"}
              handleChange={handleChange}
              currency={currencyValue.fromCurrency}
              currencyLabel={"fromCurrency"}
              currencyList={currencyList}
              otherCurrencyName={currencyValue.toCurrency}
            />
          </div>
        </div>
        <SwapHorizIcon
          onClick={interchangeCurrencies}
          ref={toggleBtn}
          className="swappingIcon"
        />
        <div className="toCurrencyContainer">
          <div className="container">
            <InputText
              label={"To"}
              value={currencyValue.toValue}
              valueLabel={"toValue"}
              handleChange={handleChange}
              currency={currencyValue.toCurrency}
              currencyLabel={"toCurrency"}
              currencyList={currencyList}
              otherCurrencyName={currencyValue.fromCurrency}
            />
            {rates && (
              <ConversionRate
                fromCurrency={currencyValue.fromCurrency}
                toCurrency={currencyValue.toCurrency}
                getConversionRate={getConversionRate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterTextField;
