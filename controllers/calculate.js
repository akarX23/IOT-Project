import { getPropertiesFromTemp } from "../helpers/utils.js";
import { insertOne } from "../Models/PinFin.js";

export const calcHeatCoefficient = async (pinFinData) => {
  let { voltage, current, temperatures, atmTemp, diameter, length } =
    pinFinData;

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

  // Calculate constant heat flux
  let qw = (voltage * current) / (Math.PI * diameter * length);

  // Grashoff number
  let gr = (9.81 * beta * Math.pow(length, 4) * qw) / (kv * kv * k);

  // Nusselt number
  let nu;
  let grpr = gr * pr;
  if (Math.pow(10, 5) < grpr && grpr < Math.pow(10, 11))
    nu = 0.6 * Math.pow(grpr, 0.2);
  else nu = 0.17 * Math.pow(grpr, 0.2);

  // Calculate heat coefficient
  let h = (nu * k) / length;

  let pinFinResult = insertOne({
    voltage,
    current,
    heat,
    temperatures,
    atmTemp,
    heatCoefficient: h,
    diameter,
    length,
  });

  return pinFinResult;
};
