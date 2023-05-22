const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { authToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 12;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const revers = req.query.revers == "yes" ? 1 : -1;
    try {
        const search = req.query.s || "";
        let filterFind = {};
        if (search) {
            const searchExp = new RegExp(search, "i");
            filterFind = { name: searchExp }
        }

        const data = await ToyModel
            .find(filterFind)
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: revers });
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})



router.get("/price", async (req, res) => {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    try {
        const data = await ToyModel.find({ price: { $gte: min, $lte: max } });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.get("/category", async (req, res) => {
    try {
        const cat = req.query.cat;
        const catExp = new RegExp(cat, "i");
        const data = await ToyModel.find({ category: catExp });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async(req,res) => {
    try{
      const id = req.params.id
      const data = await ToyModel.findOne({_id:id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

router.post("/", authToken, async (req, res) => {
    const validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const toy = new ToyModel(req.body);
        toy.user_id = req.tokenData;
        await toy.save();
        res.json(toy)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", authToken, async (req, res) => {
    const validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const id = req.params.id;
        const data = await ToyModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", authToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ToyModel.deleteOne({ _id: id, user_id: req.tokenData._id });
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;