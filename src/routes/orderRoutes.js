import express from "express";
const app = express();
const router = express.Router();
import { body, validationResult } from "express-validator";
import isAuthenticated from "../middlewares/isAuthenticated";
import { Address, Category, Order } from "../services/mongodb";

router.post(
  "/createOrder",
  isAuthenticated,
  body("address")
    .isMongoId()
    .custom((val) => Address.isValid(val)),
  async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(403).json({ errors, message: "Bad request" });
    }
    try {
        const order = new Order(req.body)
        await order.save()

        res.json(order)
    } catch (error) {
      console.log(error.message);
    }
  }
);

export default router
