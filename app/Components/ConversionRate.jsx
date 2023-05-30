import React from "react";

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
