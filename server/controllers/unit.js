import Unit from "../models/unit.js";

const createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ message: "Unit created", unit });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUnits = async (req, res) => {
  try {
    const units = await Unit.find({}).sort({ name: 1 });
    res.status(200).json({ message: "Units retrieved", units });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ message: "Unit retrieved", unit });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Unit updated", unit });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteUnit = async (req, res) => {
  try {
    await Unit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Unit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { createUnit, getUnits, getUnit, updateUnit, deleteUnit };
