const mongoose = require("mongoose");

const feeConfigSchema = new mongoose.Schema({
  hospitalFee: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FeeConfig', feeConfigSchema);
