"use client";
import React, { useState, useRef } from "react";

// CSS files
import "../styling/mainStyle.css";

// Components
import InputText from "./InputText";
import ConversionRate from "./ConversionRate";

// MUI
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const ConverterTextField = ({ date, currencyList, rates, error }) => {
  /*
    States
    currencyValue
      1. toValue - "to" field amount
      2. fromValue - "from" field amount
      3. toCurrency - "to" field currency name
      4. fromCurrency - "from" field currency name
  */
  const [currencyValue, setCurrencyValue] = useState({
    toValue: "",
    fromValue: "",
    toCurrency: "INR",
    fromCurrency: "USD",
  });

  // Toggle Button of Swapping Currency Ref
  const toggleBtn = useRef(null);

  /*
    getAmountByRate function
    ARGUMENTS
    1. currencyValue - given currency value
    2. currency1 - currency of user's current interaction
    3. currency2 - other currency

    RETURN 
    returns the amount by getting the rate of 2 currencies.
  */
  const getAmountByRate = (currencyValue, currency1, currency2) => {
    // Get Amount using rate and set precision to 4 decimal points
    let newValue = (currencyValue * rates[currency1]) / rates[currency2];
    if (newValue !== 0) newValue = newValue.toFixed(4);

    return newValue;
  };
  /*
    getConversionRate function
    ARGUMENTS
      1. fromCurrency - "from" field currency name
      2. toCurrency - "to" field currency name
    RETURN 
    returns the conversion rate from fromCurrency to toCurrency
  */
  const getConversionRate = (fromCurrency, toCurrency) => {
    // Return the conversion Rate by getting amount
    return getAmountByRate(1, toCurrency, fromCurrency, rates);
  };

  /*
    handleAmountChange function
      - Change the Amount of the other field when change the amount of current field.
    ARGUMENTS
      1. currencyName1 - name of current interacted currency.
      2. currencyName2 - name of other currency
      3. currentCurrencyUsedLabel - label of current currency used - toCurrency/fromCurrency
      4. currentCurrencyValue - value of current currency
    RETURN
      N/A
  */
  const handleAmountChange = (
    currencyName1,
    currencyName2,
    currentCurrencyUsedLabel,
    currentCurrencyValue
  ) => {
    let otherLabel;
    if (currentCurrencyUsedLabel === "fromValue") {
      otherLabel = "toValue";
    } else {
      otherLabel = "fromValue";
    }
    // Get the new Value
    let newValue = getAmountByRate(
      currentCurrencyValue,
      currencyName1,
      currencyName2
    );
    // Set the curreny value
    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [otherLabel]: newValue };
    });
  };

  /*
    handleCurrencyChange function
      - Triggers when changes the Currency from Dropdown
    ARGUMENTS
      1. currentCurrencyUsedLabel - label of current currency used - toCurrency/fromCurrency
      2. currentCurrencyValue - value of current currency
      3. currencyName1 - name of current interacted currency.
      4. currencyName2 - name of other currency
    RETURN
      N/A
  */
  const handleCurrencyChange = (
    currentCurrencyUsedLabel,
    currentCurrencyValue,
    currencyName1,
    currencyName2
  ) => {
    let otherLabel;
    if (currentCurrencyUsedLabel === "fromValue") {
      otherLabel = "toValue";
    } else {
      otherLabel = "fromValue";
    }
    // Get the newValue
    let newValue = getAmountByRate(
      currentCurrencyValue,
      currencyName1,
      currencyName2,
      rates
    );
    // Set the currency value states
    setCurrencyValue((prevCurrencyValue) => {
      return { ...prevCurrencyValue, [otherLabel]: newValue };
    });
  };

  /*
    validInput function
      - Check if the input is valid number or not only when amount changes
    ARGUMENTS
      1. label - toValue/fromValue text
      2. value - currency amount
    RETURN
      True/False by checking if the input is valid or not
  */
  const validInput = (label, value) => {
    // Check if input is number or not
    if (label === "toValue" || label === "fromValue") {
      return !isNaN(value);
    }
    return true;
  };

  /*
    interchangeCurrencies function
      - Interchange the currencies and amounts on clicking the Swapping Button.
      ARGUMENTS
        N/A 
      RETURN 
        N/A
  */
  const interchangeCurrencies = () => {
    // Rotate the swapping button when clicked.
    toggleBtn.current.classList.toggle("rotate");
    // Interchange the currency values
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

  /*
    changeCurrencyValue function
      - On Changing the current interacted input amount. Handle the other amount value by 
        calculating amount from first currency. 
    ARGUMENTS
      1. label - toValue/fromValue text
      2. value - currency amount
    RETURN
      N/A
  */
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

  /*
    changeCurrencyName function
      - On Changing the current interacted currency name from dropdown. Handle the 
        other's currency amount value by calculating amount from first currency. 
    ARGUMENTS
      1. label - toCurrency/fromCurrency text
      2. value - currency amount
    RETURN
      N/A
  */
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

  /*
    handleChange function
      - Change the input values and dropdown values using event.target.name, event.target.value.
    ARGUMENTS
      1. event - event of eventHandler
    RETURN
      N/A
  */
  const handleChange = (event) => {
    let { name, value } = event.target;
    let label = name;
    // If valid input then set the state values
    if (validInput(label, value)) {
      setCurrencyValue((prevCurrencyValue) => {
        return { ...prevCurrencyValue, [label]: value };
      });
      // On Each input change
      // Change the currency Value if given in the label
      changeCurrencyValue(label, value);
      // Change the currency name if given in the label
      changeCurrencyName(label, value);
    }
  };
  // Rendering the UI
  return (
    <div className="ConverterTextField">
      <p className="date">Today&apos;s Date: {date}</p>
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
              error={error}
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
              error={error}
            />
            {rates && !error && (
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
