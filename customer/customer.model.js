import mongoose from "mongoose";

// set rule(schema)
const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minlength: 1,
    maxlength: 55,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 55,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 55,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "preferNotToSay"],
  },
  purchasedItems: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: false,
  },
});

// create table(model)

export const Customer = mongoose.model("Customer", customerSchema);
