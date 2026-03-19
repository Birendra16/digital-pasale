import SubUnit from "../models/subunit.js";


 // GET all subunits
export const getSubUnits = async (req, res) => {
  try {
    const subUnits = await SubUnit.find().sort({ createdAt: -1 });
    res.json({ subUnits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


 // CREATE subunit
export const createSubUnit = async (req, res) => {
  try {
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name and shortName are required" });
    }

    const exists = await SubUnit.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "SubUnit with this name already exists" });
    }

    const subUnit = new SubUnit({ name, shortName });
    await subUnit.save();

    res.status(201).json({ message: "SubUnit created successfully", subUnit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


 // UPDATE subunit
export const updateSubUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName } = req.body;

    const subUnit = await SubUnit.findById(id);
    if (!subUnit) return res.status(404).json({ message: "SubUnit not found" });

    subUnit.name = name || subUnit.name;
    subUnit.shortName = shortName || subUnit.shortName;

    await subUnit.save();

    res.json({ message: "SubUnit updated successfully", subUnit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


 // DELETE subunit
export const deleteSubUnit = async (req, res) => {
  try {
    const { id } = req.params;
    await SubUnit.findByIdAndDelete(id);
    res.json({ message: "SubUnit deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};