import express from "express";
import { body, validationResult, param } from "express-validator";
import isAdmin from "../middlewares/isAdmin";
import { Category, Product } from "../services/mongodb/index";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const category = await Category.find({});
    return res.json({
      category,
      message: "successfully fetched category",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      category: [],
      message: "error fetching category",
    });
  }
});
router.post(
  "/add",
  // isAdmin,
  body("name").isLength({ min: 3 }),
  body("description").isLength({ min: 10 }),
  async (req,res) => {
    const data = req.body
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(403).json({ errors, message: "Bad request" });
    }
    // res.send(data)
    try {
      const category = new Category(data);
      await category.save();
      res
        .status(200)
        .json({ category, message: "Category saved successfully in DB" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        category: null,
        message: "Error saving category in DB",
      });
    }
  }
);

router.put(
  "/update/:id",
  isAdmin,
  param("id")
    .isMongoId()
    .custom((val) => Category.isValid(val)),
  async () => {
    const { id } = req.params;
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        data: null,
        success: false,
        message: errors.map((err) => err.message),
      });
    }
    try {
      const category = await Category.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(200).json({
        category,
        message: "Updated category successfully in DB",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        category: null,
        message: "Unable to update category in DB",
      });
    }
  }
);

router.delete(
  "/delete/:id",
  isAdmin,
  param("id")
    .isMongoId()
    .custom((val) => Category.isValid(val)),
  async (req, res) => {
    const { id } = req.params;
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        data: null,
        success: false,
        message: errors.map((err) => err.message),
      });
    }
    try {
      const products = await Product.find({ category: id });
      if (products.length > 0) {
        const category = await Category.findByIdAndRemove(id);
        return res.status(200).json({
          category,
          message: "Deleted category in DB",
        });
      }
      return res.status(200).json({
        category: null,
        message: "Category could not be deleted as it has products",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        category: null,
        message: "Unable to delete category in DB",
      });
    }
  }
);

export default router
