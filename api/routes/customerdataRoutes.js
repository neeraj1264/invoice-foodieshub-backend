const express = require("express");
const CustomerData = require("../models/customerdata");
const router = express.Router();

// Create or update customer and update totals (idempotent per order id)
router.post("/", async (req, res) => {
  try {
    const {
      id, // order id (should be unique for each order)
      timestamp,
      name,
      phone,
      address,
      email,
      paidAmount = 0, // number
      creditAmount = 0, // number
      transactions,
    } = req.body;

    const phoneStr = String(phone || "").trim();

    // Check if a customer with the same phone number already exists
    let customer = await CustomerData.findOne({ phone: phoneStr });
    
    if (customer) {
      console.log(`Customer with phone ${phone} already exists. Updating customer.`);
      
      // Update customer details if provided
      if (name) customer.name = name;
      if (address) customer.address = address;
      if (email) customer.email = email;
      
      // Increment totals
      customer.totalCash = (customer.totalCash || 0) + Number(paidAmount || 0);
      customer.totalOwed = (customer.totalOwed || 0) + Number(creditAmount || 0);
      customer.totalAmount = (customer.totalCash || 0) + (customer.totalOwed || 0);
      
      await customer.save();
      return res.status(200).json({ 
        message: "Customer updated with new order", 
        customer 
      });
    }

    // If no customer exists, create new one
    const newCustomer = new CustomerData({
      id,
      name,
      phone: phoneStr,
      address,
      email,
      timestamp: timestamp || new Date().toISOString(),
      totalCash: Number(paidAmount || 0),
      totalOwed: Number(creditAmount || 0),
      totalAmount: Number(paidAmount || 0) + Number(creditAmount || 0),
      transactions,
    });

    await newCustomer.save();
    return res.status(201).json({ 
      message: "Customer added", 
      customer: newCustomer 
    });

  } catch (error) {
    console.error("Error saving/updating customer:", error);
    return res.status(500).json({ 
      message: "Failed to save customer", 
      error: error.message 
    });
  }
});

// Fetch all CustomerData
router.get("/", async (req, res) => {
  try {
    const customers = await CustomerData.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ 
      message: "Failed to fetch customer data", 
      error: error.message 
    });
  }
});

// Update customer by ID (add transaction: received/gave)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description } = req.body;

    const customer = await CustomerData.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (type === "gave") {
      customer.youwillget += amount; // sale increased
    } else if (type === "received") {
      customer.youwillgave += amount; // payment received
    }

    customer.transactions.push({ type, amount, description });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific transaction from a customer
router.delete("/:customerId/transactions/:transactionId", async (req, res) => {
  try {
    const { customerId, transactionId } = req.params;
    const customer = await CustomerData.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const transaction = customer.transactions.id(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Adjust totals based on deleted transaction
     if (transaction.type === "gave") {
      customer.youwillget -= transaction.amount;
    } else if (transaction.type === "received") {
      customer.youwillgave -= transaction.amount;
    }

    // Remove the transaction
    transaction.deleteOne();

    await customer.save();
    res.json({ message: "Transaction deleted successfully", customer });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ 
      message: "Failed to delete transaction", 
      error: err.message 
    });
  }
});

module.exports = router;
