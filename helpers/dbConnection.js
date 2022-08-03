import mongoose from "mongoose";

// if (process.env.NODE_ENV === 'development')
//   for (let model in mongoose.models) delete mongoose.models[model]

import "Models/PinFin";

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;

  return await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("Error in connecting", err);
    });
}

export default dbConnect;
