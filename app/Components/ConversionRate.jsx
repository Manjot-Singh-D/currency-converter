import React from "react";

// Shows the conversion rate of fromCurrency to toCurrency
const ConversionRate = ({ fromCurrency, toCurrency, getConversionRate }) => {
  return (
    <>
      <p className="conversionRate">
        1 {fromCurrency} = {getConversionRate(fromCurrency, toCurrency)}
        {"   "}
        {toCurrency}
      </p>
    </>
  );
};

export default ConversionRate;
