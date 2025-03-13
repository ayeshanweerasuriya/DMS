const Patient = require("../models/dental/Patient.js");
const FeeConfig = require("../models/dental/FeeConfig.js");

const getIncomeStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayIncomeData = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalTreatmentFee: { $sum: "$treatmentFee" },
          totalMedicationFee: { $sum: "$medicationFee" },
          totalHospitalFee: { $sum: "$hospitalFee" },
        },
      },
    ]);

    const todayIncome =
      todayIncomeData.length > 0
        ? todayIncomeData[0].totalTreatmentFee +
          todayIncomeData[0].totalMedicationFee +
          todayIncomeData[0].totalHospitalFee
        : 0;

    const totalIncomeData = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalTreatmentFee: { $sum: "$treatmentFee" },
          totalMedicationFee: { $sum: "$medicationFee" },
          totalHospitalFee: { $sum: "$hospitalFee" },
        },
      },
    ]);

    const totalIncome =
      totalIncomeData.length > 0
        ? totalIncomeData[0].totalTreatmentFee +
          totalIncomeData[0].totalMedicationFee +
          totalIncomeData[0].totalHospitalFee
        : 0;

    const eachPatientIncomeData = await Patient.aggregate([
      {
        $project: {
          name: 1,
          treatmentFee: 1,
          medicationFee: 1,
          hospitalFee: 1,
          createdAt: 1,
          totalFee: {
            $add: ["$treatmentFee", "$medicationFee", "$hospitalFee"],
          },
        },
      },
    ]);

    const eachPatientFee = eachPatientIncomeData.map((patient) => ({
      name: patient.name,
      totalFee: patient.totalFee,
      treatmentFee: patient.treatmentFee,
      medicationFee: patient.medicationFee,
      hospitalFee: patient.hospitalFee,
      createdAt: patient.createdAt,
    }));

    return res.status(200).json({
      message: "Income statistics retrieved successfully",
      data: {
        todayIncome,
        totalIncome,
        eachPatientFee,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateHospitalFee = async (req, res) => {
  try {
    const newHospitalFee = req.body.newHospitalFee;

    if (!newHospitalFee || typeof newHospitalFee !== "number") {
      return res.status(400).json({
        message: "Invalid hospital fee provided. Ensure it's a valid number.",
      });
    }

    const feeConfig = await FeeConfig.findOne();

    if (!feeConfig) {
      return res.status(404).json({
        message: "Fee configuration not found. Please set up fee configuration first.",
      });
    }

    feeConfig.hospitalFee = newHospitalFee;
    feeConfig.updatedAt = new Date();
    await feeConfig.save();

    const result = await Patient.updateMany(
      {},
      { $set: { hospitalFee: newHospitalFee } }
    );

    if (result.nModified > 0) {
      return res.status(200).json({
        message: `${result.nModified} patients' hospital fees updated successfully.`,
        updatedCount: result.nModified,
      });
    } else {
      return res.status(200).json({
        message: `Hospital fee updated, but the value was the same for all patients.`,
      });
    }
  } catch (error) {
    console.error("Error updating hospital fee:", error);
    return res.status(500).json({
      message: "An error occurred while updating hospital fees.",
    });
  }
};

const getHospitalFee = async (req, res) => {
  try {
    const feeConfig = await FeeConfig.findOne();

    if (!feeConfig) {
      return res.status(404).json({
        message: "Fee configuration not found. Please set up fee configuration first.",
      });
    }

    return res.status(200).json({
      hospitalFee: feeConfig.hospitalFee,
      updatedAt: feeConfig.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching hospital fee:", error);
    return res.status(500).json({
      message: "An error occurred while fetching hospital fees.",
    });
  }
}

module.exports = { getIncomeStats, updateHospitalFee, getHospitalFee };
