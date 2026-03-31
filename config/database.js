import mongoose from "mongoose";
const DbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected");
  } catch (error) {
    console.log(error.message);
  }
};
export default DbConnection;
