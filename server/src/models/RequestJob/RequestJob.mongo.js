const mongoose = require("mongoose");

const projectRequestSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service", // even if you don't have service model, keep this for clarity
            required: true,
            index: true,
        },

        projectTitle: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },

        projectDescription: {
            type: String,
            required: true,
            trim: true,
            minlength: 50,
            maxlength: 5000,
        },

        budget: {
            type: Number,
            required: true,
            min: 1,
        },

        deadline: {
            type: Date,
            required: true,
        },

        additionalRequirements: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2000,
        },

        // Order status
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },

    },

    { timestamps: true }
);

module.exports = mongoose.model("ProjectRequest", projectRequestSchema);
