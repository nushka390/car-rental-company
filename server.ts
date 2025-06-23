import express from 'express';
import cors from 'cors';
// Update the path below to the actual location of your service/controller file, for example:
import { createCustomerTableController, getAllcustomers, getcustomerById, updateCustomer, deletecustomer, Createcustomer } from '../../src/customer/customer.service'; // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/customers', async (req, res) => {
  try {
    const customers = await getAllcustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await getcustomerById(id);
    res.json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/customers', async (req, res) => {
  try {
    const newCustomer = await Createcustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedCustomer = await updateCustomer(id, req.body);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deletecustomer(id);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;