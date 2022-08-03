import fs from "fs";
import csv from "csv-parser";

const lerp = (a, b, amount) => (1 - amount) * a + amount * b;

export const getPropertiesFromTemp = (temp) =>
  new Promise((resolve) => {
    let filePath = `${process.cwd()}/DataHandbookValues.csv`;

    let properties = { kv: "", k: "", pr: "" };

    let prevRow = null;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", function (data) {
        if (data.temp === temp) {
          properties.kv = data.kv;
          properties.k = data.k;
          properties.pr = data.pr;
          return;
        }

        if (data.temp > temp) {
          properties.kv = lerp(
            prevRow.kv,
            data.kv,
            (temp - prevRow.temp) / (data.temp - prevRow.temp)
          );
          properties.k = lerp(
            prevRow.k,
            data.k,
            (temp - prevRow.temp) / (data.temp - prevRow.temp)
          );
          properties.pr = lerp(
            prevRow.pr,
            data.pr,
            (temp - prevRow.temp) / (data.temp - prevRow.temp)
          );
          return;
        }

        prevRow = data;
      })
      .on("end", function () {
        //some final operation
        console.log(properties);
        resolve(properties);
      });
  });
