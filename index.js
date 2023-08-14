import express from "express";
import { dbConnect } from "./db.connect.js";
import productRoutes from "./product/product.route.js";

const app = express();
// to make app understand json
app.use(express.json());

// db connection
dbConnect();

// register routes
app.use(productRoutes);

const port = 8000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
