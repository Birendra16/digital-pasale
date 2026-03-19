import Unit from "../models/unit.js";

/**
 * Create a new unit
 */
export const createUnit = async (req, res) => {
  try {
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name and shortName are required" });
    }

    // Check uniqueness
    const existing = await Unit.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Unit with this name already exists" });
    }

    const unit = new Unit({
      name: name.trim(),
      shortName: shortName.trim(),
    });

    await unit.save();

    res.status(201).json({ message: "Unit created successfully", unit });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get all units
 */
export const getUnits = async (req, res) => {
  try {
    const units = await Unit.find().sort({ name: 1 });
    res.json({ units });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Update a unit
 */
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name and shortName are required" });
    }

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // Check uniqueness if name changed
    if (unit.name !== name.trim()) {
      const exists = await Unit.findOne({ name: name.trim() });
      if (exists) {
        return res.status(400).json({ message: "Another unit with this name already exists" });
      }
    }

    unit.name = name.trim();
    unit.shortName = shortName.trim();

    await unit.save();

    res.json({ message: "Unit updated successfully", unit });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete a unit
 */
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    await unit.deleteOne();

    res.json({ message: "Unit deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};