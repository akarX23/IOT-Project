import { getPropertiesFromTemp } from "../helpers/utils.js";
import { findById, insertOne, upsertOne } from "../Models/PinFin.js";

export const calcHeatCoefficient = async (pinFinData, id) => {
  let { voltage, current, atmTemp, diameter, length } = pinFinData;

  let pinFin = await findById(id);

  let temperatures = pinFin.temperatures;

  // Calculate Q
  let heat = voltage * current;

  // Calculate Tf
  const avgTemp =
    temperatures.reduce((a, b) => a + b, 0) / temperatures.length || 0;
  let filmTemp = (avgTemp + atmTemp) / 2;

  // Get properties of air from Tf
  let { kv, k, pr } = await getPropertiesFromTemp(filmTemp);

  // Calculate volume coeffecient
  let beta = 1 / (filmTemp + 273.15);

  // delta T
  let deltaT = avgTemp - atmTemp + 273.15;

  // Grashoff number
  let gr = (9.81 * beta * deltaT * Math.pow(diameter, 3)) / (kv * kv);

  // Nusselt number
  let nu;
  let grpr = gr * pr;
  let c, m;
  if (grpr < Math.pow(10, -2)) {
    c = 0.675;
    m = 0.058;
  } else if (grpr < Math.pow(10, 2)) {
    c = 1.02;
    m = 0.148;
  } else if (grpr < Math.pow(10, 4)) {
    c = 0.85;
    m = 0.188;
  } else if (grpr < Math.pow(10, 7)) {
    c = 0.48;
    m = 0.25;
  } else {
    c = 0.125;
    m = 0.35;
  }
  nu = c * Math.pow(grpr, m);

  // Calculate heat coefficient
  let h = (nu * k) / diameter;

  let pinFinResult = await upsertOne(
    { _id: id },
    {
      voltage,
      current,
      heat,
      temperatures,
      atmTemp,
      heatCoefficient: h,
      diameter,
      length,
    }
  );

  return pinFinResult;
};

export const insertTemps = async (data) => {
  let { temperatures } = data;

  let pinFinResult = await insertOne({
    temperatures,
  });

  return pinFinResult;
};
