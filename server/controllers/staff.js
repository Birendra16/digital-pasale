import User from "../models/user.js";

// CREATE STAFF
export const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Create new staff member
    const staff = await User.create({
      name,
      email: emailLower,
      password,
      showPassword: password, // Store plain password for owner visibility
      role: "STAFF",
      status: "ACTIVE", 
      owner: req.user.id
    });

    const { password: _, ...safeStaff } = staff.toObject();
    res.status(201).json({
      msg: "Staff created successfully",
      staff: safeStaff
    });

  } catch (err) {
    console.error("CREATE STAFF ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET ALL STAFF FOR CURRENT OWNER
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ owner: req.user.id, role: "STAFF" });
    res.json(staff);
  } catch (err) {
    console.error("GET STAFF ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE STAFF
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if staff belongs to the owner
    const staff = await User.findOne({ _id: id, owner: req.user.id });
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found or unauthorized" });
    }

    await User.findByIdAndDelete(id);
    res.json({ msg: "Staff deleted successfully" });

  } catch (err) {
    console.error("DELETE STAFF ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE STAFF
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Check if staff belongs to the owner
    const staff = await User.findOne({ _id: id, owner: req.user.id });
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found or unauthorized" });
    }

    if (name) staff.name = name;
    if (email) staff.email = email.toLowerCase();
    
    // Only update password if provided
    if (password) {
      staff.password = password;
      staff.showPassword = password; // Update plain password too
    }

    await staff.save();

    const { password: _, ...safeStaff } = staff.toObject();
    res.json({
      msg: "Staff updated successfully",
      staff: safeStaff
    });

  } catch (err) {
    console.error("UPDATE STAFF ERROR:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already in use" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};
