const fetch = require("node-fetch");

const gorinchem = "15095e42-062d-11e6-8471-5254006eaa2f";
const werkendam = "fe55a6c2-062c-11e6-8471-5254006eaa2f";
const hardinxveld = "edeb018b-062c-11e6-8471-5254006eaa2f";
const thursday = 4;
const saturday = 6;
const sunday = 1;

function nextDay(d, dow) {
  d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7));
  return d.toISOString().split("T")[0];
}

function mergeTripStops(list1, list2) {
  const idx = {};
  // make idx
  list1.forEach(trip => {
    idx[trip.description] = trip;
  });

  list2.forEach(item => {
    const trip = idx[item.description];
    if (trip) {
      trip.stops = trip.stops.concat(item.stops);
    } else {
      //console.log("not in raw data", item.description);
      list1.unshift(item);
    }
  });
}

async function getData(d, dow) {
  const datum = nextDay(d, dow);
  //console.log("getting", datum);

  const options = {
    credentials: "omit",
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,nl;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "x-token": "0a27faeb-1e6e-11e6-84a2-5254006eaa2f"
    },
    referrer: "https://cc.riveer.nl/planner/index.html",
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors"
  };

  const res1 = await fetch(
    `https://api.riveer.nl/api/v1/lines/search?start=${gorinchem}&end=${werkendam}&date=${datum}`,
    options
  );
  const list1 = await res1.json();
  const res2 = await fetch(
    `https://api.riveer.nl/api/v1/lines/search?start=${hardinxveld}&end=${gorinchem}&date=${datum}`,
    options
  );
  const list2 = await res2.json();
  mergeTripStops(list1, list2);
  return list1;
}

async function makeTimeTable(d, dow) {
  const timetable = [];
  const seen = {};

  const rawdata = await getData(d, dow);

  rawdata.forEach(trip => {
    const [days, _] = trip.description.toLowerCase().split(" ");
    const newTrip = [];
    trip.stops.forEach(stop => {
      if (!seen[stop.guid]) {
        seen[stop.guid] = true;
        const nt = {
          time: stop.stop_time,
          harbor: stop.harbor.name
        };
        if (stop.jetty) {
          nt.jetty = stop.jetty.toLowerCase();
        }
        newTrip.push(nt);
      }
    });
    timetable.push({ days, stops: newTrip });
  });

  return timetable;
}

async function makeTimeTables() {
  const now = new Date();
  const thursdayTable = await makeTimeTable(now, thursday);
  const saturdayTable = await makeTimeTable(now, saturday);
  // sunday only during summer
  const sundayTable = await makeTimeTable(
    new Date(now.getFullYear() + 1, 5),
    sunday
  );
  const result = [].concat(thursdayTable, saturdayTable, sundayTable);
  console.log(JSON.stringify(result, null, 2));
}

makeTimeTables();
