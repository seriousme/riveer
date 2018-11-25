const { findTrip, FIRST, LAST } = require("../findTrip.js");
const thursday = 4;
const saturday = 6;
const sunday = 0;
const monday = 1;

function nextDay(d, dow) {
  d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7));
  return d.toISOString();
}

function showResult(params) {
  const result = findTrip(params);
  if (result) {
    const { origin, destination, timehints } = params;
    const { time, jetty, remarks } = result.begin;
    const timehintText = timehints ? `${timehints} ` : "";
    const jettyText = jetty ? `vanaf ${jetty}` : "";
    const remarksText = remarks ? `Let op: ${remarks}` : "";
    console.log(
      `De ${timehintText}pont van ${origin} naar ${destination} vertrekt om ${time} ${jettyText}`
    );
    if (remarksText) {
      console.log(remarksText);
    }
  } else {
    console.log(
      "Er is geen reguliere veerdienst beschikbaar op het door u gekozen tijdstip."
    );
  }
}

function testResult(origin, destination, day, hours, minutes, timehints) {
  const now = new Date();

  //console.log({ origin, destination, day, hours, minutes, timehints });

  showResult({
    origin,
    destination,
    date: typeof day == "number" ? nextDay(now, day) : undefined,
    time: hours
      ? new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        ).toISOString()
      : undefined,
    timehints
  });
}

function doTest() {
  testResult("Werkendam", "Hardinxveld");
  testResult(
    "Werkendam",
    "Hardinxveld",
    saturday,
    undefined,
    undefined,
    "eerste"
  );
  testResult("Werkendam", "Gorinchem", sunday);
  testResult(
    "Gorinchem",
    "Werkendam",
    thursday,
    undefined,
    undefined,
    "laatste"
  );
  testResult("Gorinchem", "Werkendam", monday, 12, 7);
  testResult("Gorinchem", "Werkendam", monday, undefined);
}

doTest();
// console.log(
//   findResult({
//     origin: "Werkendam",
//     destination: "Gorinchem",
//     timeHints: "laatste",
//     date: "2018-11-29T21:01:43+01:00",
//     time: "2018-11-25T12:00:00+01:00"
//   })
// );
