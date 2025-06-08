import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  // Make sure to await and return this promise
  return mongoose.connect(`${process.env.MONGODB_URI}/attendence`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
