import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://arun:arun1nly1@school.b6qkdnb.mongodb.net/clothing-store?retryWrites=true&w=majority"
    );
    console.log("DB connection: OK");
  } catch (error) {
    console.log("DB connection :Failed");
    console.log(error.message);
  }
};
