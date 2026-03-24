import Customer from "../models/customer.js";

// Create Customer
export const createCustomer = async (req, res) => {
  try {
    const { phone, panNumber } = req.body;

    // Check duplicate phone or PAN
    const existing = await Customer.findOne({
      $or: [{ phone }, { panNumber }]
    });

    if (existing) {
      return res.status(400).json({
        message: "Customer with phone or PAN already exists"
      });
    }

    const customer = await Customer.create(req.body);

    res.status(201).json({
      message: "Customer created successfully",
      data: customer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Customers (with search + pagination)
export const getCustomers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const query = {
      isActive: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { shopName: { $regex: search, $options: "i" } }
      ]
    };

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(query);

    res.json({
      data: customers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Customer
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer || !customer.isActive) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Customer updated successfully",
      data: customer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete Customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deactivated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Credit Limit
export const updateCreditLimit = async (req, res) => {
  try {
    const { creditLimit } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { creditLimit },
      { new: true }
    );

    res.json({
      message: "Credit limit updated",
      data: customer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};