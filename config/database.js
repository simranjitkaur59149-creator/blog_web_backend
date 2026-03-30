import mongoose from "mongoose";
const DbConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Blog-app");
    console.log("connected");
  } catch (error) {
    console.log(error.message);
  }
};
export default DbConnection;
