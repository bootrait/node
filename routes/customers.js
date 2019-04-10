const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const debug = require('debug')('app:db');
const { Customer,validate } = require('../models/customer');

router.get('/', async (req,res) => {
    const customers = await Customer.find();
    res.send(customers);
});
 
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if (error) {
        var msg='';
        error.details.forEach(err=>msg+=' '+err.message);
        res.status(400).send(msg);
        return;
    }
    var customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    try {
        customer = await customer.save();
        res.send(customer);
    } catch (ex) {
        var msg = '';
        for (const i in ex.errors) msg += ex.errors[i].message+'  ';
        res.status(400).send(msg);
    }
});

router.put('/:id', async (req,res) => {
    const { error } = validate(req.body);
    if (error) {
        var msg ='';
        error.details.forEach(err=>msg+=' '+err.message);
        res.status(400).send(msg);
        return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Error! Customer not found');
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });
    if (!customer) return res.status(404).send('Error! Customer not found');
    res.send(customer);
});

router.delete('/:id', async (req,res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Error! Customer not found');
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Error! Customer not found');
    res.send(customer);
});

router.get('/:id', async (req,res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Error! Customer not found');
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Error! Customer not found');
    res.send(customer);
});


module.exports = router;