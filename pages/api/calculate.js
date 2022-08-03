// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calcHeatCoefficient } from "controllers/calculate";
import dbConnect from "helpers/dbConnection";

dbConnect();

export default function handler(req, res) {
  calcHeatCoefficient(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
