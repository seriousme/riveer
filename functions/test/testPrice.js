const { findPrice } = require("../findPrice.js");

function showResult(params) {
  const result = findPrice(params);
  if (result) {
    const { origin, destination, ticket } = params;

    console.log(
      `Een ${ticket} voor de pont van ${origin} naar ${destination} kost ${result}`
    );
  } else {
    console.log(
      "Er is op dit moment geen prijs informatie beschikbaar voor deze route."
    );
  }
}

function testResult(origin, destination, ticket) {
  showResult({
    origin,
    destination,
    ticket
  });
}

function doTest() {
  testResult("Hardinxveld", "Werkendam", "enkele reis");
  testResult("Werkendam", "Hardinxveld", "enkele reis");
  testResult("Werkendam", "Hardinxveld", "retour");
  testResult("Werkendam", "Hardinxveld", "10-ritten kaart");
  testResult("Werkendam", "Gorinchem", "enkele reis");
  testResult("Werkendam", "Gorinchem", "retour");
  testResult("Werkendam", "Gorinchem", "10-ritten kaart");
}

doTest();
