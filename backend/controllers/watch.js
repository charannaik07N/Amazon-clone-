const Watch = require("../Models/watch");


exports.getAllWatches = async (req, res) => {
  const watches = await Watch.find();
  res.json(watches);
};


exports.getWatchById = async (req, res) => {
  const watch = await Watch.findOne({ id: req.params.id });
  res.json(watch);
};


exports.createWatch = async (req, res) => {
  const newWatch = new Watch(req.body);
  await newWatch.save();
  res.status(201).json(newWatch);
};

exports.updateWatch = async (req, res) => {
  const updatedWatch = await Watch.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedWatch);
};


exports.deleteWatch = async (req, res) => {
  await Watch.findOneAndDelete({ id: req.params.id });
  res.json({ message: "Watch deleted" });
};
