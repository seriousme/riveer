const functions = require("firebase-functions");
const { dialogflow } = require("actions-on-google");
const app = dialogflow();
const { findTrip } = require("./findTrip.js");
const { findPrice } = require("./findPrice.js");

app.intent("FindTrip", (conv, params) => {
  const result = findTrip(params);
  console.log("result of findResult", result);
  if (typeof result === "object") {
    const { origin, destination, timeHints } = params;
    const { time, jetty, remarks } = result.begin;
    const timehintText = timeHints ? `${timeHints} ` : "";
    const jettyText = jetty ? ` vanaf ${jetty}` : "";
    const remarksText = remarks ? `Let op: ${remarks}` : "";
    conv.ask(
      `De ${timehintText}pont van ${origin} naar ${destination} vertrekt om ${time}${jettyText}. ${remarksText}`
    );
  } else {
    conv.ask(
      "Er is geen reguliere veerdienst beschikbaar op het door jou gekozen tijdstip."
    );
  }
});

app.intent("PricingInfo", (conv, params) => {
  const result = findPrice(params);
  if (result) {
    const { origin, destination, ticket } = params;
    conv.ask(
      `Een ${ticket} voor de pont van ${origin} naar ${destination} kost ${result}`
    );
  } else {
    conv.ask(
      "Er is op dit moment geen prijs informatie beschikbaar voor deze route."
    );
  }
});

exports.riveerBot = functions.https.onRequest(app);
