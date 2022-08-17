// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { insertTemps } from "controllers/calculate";
import dbConnect from "helpers/dbConnection";

dbConnect();

export default function handler(req, res) {
  insertTemps(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
