const moment = require("moment-timezone");
const schedule = require("./data/tripData.json");
const FIRST = "eerste";
const LAST = "laatste";
const TZ = "Europe/Amsterdam";

const daysMap = {
  zo: [0],
  "ma-vr": [1, 2, 3, 4, 5],
  do: [4],
  za: [6]
};

function findTrips(origin, destination, day) {
  console.log("findTrips", { origin, destination, day });
  const results = [];
  for (let i = 0; i < schedule.length; i++) {
    const trip = schedule[i];
    if (!daysMap[trip.days].includes(day)) {
      continue;
    }

    let begin = null;
    for (let j = 0; j < trip.stops.length; j++) {
      const stop = trip.stops[j];
      if (stop.harbor == origin) {
        begin = stop;
      }
      if (begin && stop.harbor == destination) {
        results.push({ begin, end: stop });
        break;
      }
    }
  }
  return results;
}

function makeTimeString(time) {
  const date = time ? moment(time) : moment();
  const timestr = date.tz(TZ).format("kk:mm");
  console.log({ timestr });
  return timestr;
}

function makeTripDay(date) {
  //const tripDate = date ? moment(date) : moment();
  //const tripDay = tripDate.getDay();
  const tripDay = Number(
    moment(date)
      .tz(TZ)
      .format("d")
  );
  // sundays only from may till september
  if (tripDay === 0) {
    const tripMonth = Number(moment.tz(TZ).format("M"));

    if (tripMonth < 5 || tripMonth > 9) {
      return -1;
    }
  }
  console.log({ tripDay });
  return tripDay;
}

module.exports = {
  findTrip: params => {
    console.log("findResult", params);
    const { origin, destination, date, time, timeHints } = params;
    const day = makeTripDay(date);
    const departure = makeTimeString(time);

    const trips = findTrips(origin, destination, day);
    if (timeHints === FIRST) {
      return trips.shift();
    }
    if (timeHints === LAST) {
      return trips.pop();
    }
    return trips.find(item => item.begin.time >= departure);
  },
  FIRST,
  LAST
};
