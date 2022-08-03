// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calcHeatCoefficient } from "controllers/calculate";

export default function handler(req, res) {
  calcHeatCoefficient(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
