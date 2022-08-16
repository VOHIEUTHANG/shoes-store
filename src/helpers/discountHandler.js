const calculatePriceAfterApplyDiscount = (originPrice, percentReduction) =>
   Number(Math.round((originPrice * (100 - percentReduction)) / 100)) * 1000;

const calculateDiscountPrice = (originPrice, percentReduction) =>
   Number(Math.round((originPrice * percentReduction) / 100)) * 1000;

export { calculatePriceAfterApplyDiscount, calculateDiscountPrice };
