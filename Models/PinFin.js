import "../helpers/dbConnection.js";
import mongoose from "mongoose";

const PinFinSchema = mongoose.Schema({
  voltage: {
    type: Number,
  },
  current: {
    type: Number,
  },
  heat: {
    type: Number,
  },
  temperatures: [
    {
      type: Number,
    },
  ],
  atmTemp: {
    type: Number,
  },
  heatCoefficient: {
    type: Number,
  },
  diameter: {
    type: Number,
  },
  length: {
    type: Number,
  },
});

const PinFin = mongoose.models.PinFin || mongoose.model("PinFin", PinFinSchema);

const insertOne = async (data) => {
  let newPinFin = new PinFin(data);

  await newPinFin.save();
  return newPinFin;
};

const find = async () => {
  let pinFin = await PinFin.find({})
    .sort({
      _id: -1,
    })
    .lean();

  return pinFin;
};

const upsertOne = async (query, data) => {
  let pinFin = await PinFin.findOneAndUpdate(query, data, {
    new: true,
    upsert: true,
  });

  return pinFin;
};

const findById = async (id) => {
  let pinFin = await PinFin.findById(id).lean();

  return pinFin;
};

export { PinFin, insertOne, find, upsertOne, findById };
