import React from "react";
import axios from "axios";

// CSS files
import "./styling/mainStyle.css";

// Components
import IntroText from "./Components/IntroText";
import ConverterTextField from "./Components/ConverterTextField";
import Error from "./Components/Error";

/*
  today, todayDate - Date in the format (yyyy-mm-dd)
*/
const today = new Date();
const todayDate = today.toISOString().slice(0, 10);

/*
  getData function
    - This function get the conversion rate of currencies with respect to USD
    - By using Axios and exchangerates_data API by considering the date.

  ARGUMENTS
    N/A
  RETURN
    - currencyList = List of all the countries currency
    - date = Today's Date
    - rates = Rate of each country's currency with respect to USD.
*/
const getData = async () => {
  // API Key retrieved from env
  const apiKey = `${process.env.NEXT_PUBLIC_API_KEY}`;
  // Axios request to API
  try {
    const response = await axios.get(
      `https://api.apilayer.com/exchangerates_data/${todayDate}?base=USD`,
      {
        headers: {
          apikey: apiKey,
        },
      }
    );
    // Get the currencyList
    const currencyListValues = Object.keys(response.data.rates);
    // Return the object
    return {
      currencyList: currencyListValues,
      date: response.data.date,
      rates: response.data.rates,
    };
  } catch (error) {
    // Error Handling
    console.error("Error fetching exchange rates!");

    return {
      currencyList: [],
      date: "",
      rates: null,
    };
  }
};

// Data required - currencyList,date,rates
let currencyList,
  date,
  rates,
  error = false;

// Home Component for rendering UI
const Home = async () => {
  /*
    Check if all data is available or not
  */
  if (!currencyList || !date || !rates) {
    const res = await getData();
    // Set the data from response.
    currencyList = res.currencyList;
    date = res.date;
    rates = res.rates;

    if (rates === null) {
      error = true;
    } else {
      error = false;
    }
  }
  return (
    <div className="app">
      {error && <Error />}
      <IntroText />
      <ConverterTextField
        date={date}
        currencyList={currencyList}
        rates={rates}
        error={error}
      />
    </div>
  );
};

export default Home;
