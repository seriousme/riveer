const prices = require("./data/priceData.json");

module.exports = {
  findPrice: params => {
    console.log("findPrice", params);
    const { origin, destination, ticket } = params;
    const priceInfo = (
      prices.find(item => {
        return (
          (origin === item.origin && destination === item.destination) ||
          (origin === item.destination && destination === item.origin)
        );
      }) || {}
    ).priceInfo;
    return priceInfo[ticket];
  }
};
