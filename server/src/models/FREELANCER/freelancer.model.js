const Freelancer = require("./freelancer.mongo");
const mongoose = require("mongoose");


async function getFreelancerProfile(userId) {
  try {
    const freelancer = await Freelancer.findOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        aboutMe: 1,
        education: 1,
        yearsOfExperience: 1,
        averageRating: 1,
        services: 1, // return full services array
      }
    );

    if (!freelancer) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    return {
      success: true,
      message: "Profile fetched successfully",
      data: {
        aboutMe: freelancer.aboutMe,
        education: freelancer.education,
        yearsOfExperience: freelancer.yearsOfExperience,
        averageRating: freelancer.averageRating,
        services: freelancer.services, // Already array of embedded documents
      },
    };
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function addNameAndUser(userId) {
  try {
    const newDoc = await Freelancer.create({
      userId: userId,
    });

    return {
      success: true,
      message: "Document created successfully",
      data: newDoc,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to create document",
      error: err.message,
    };
  }
}

async function updateUserProfile(
  userId,
  { aboutMe, education, yearsOfExperience }
) {
  try {
    // Convert string userId → ObjectId (important)
    const objectId = new mongoose.Types.ObjectId(userId);

    // Build update object (only include fields that exist)
    const updateFields = {};
    if (aboutMe !== undefined) updateFields.aboutMe = aboutMe;
    if (education !== undefined) updateFields.education = education;
    if (yearsOfExperience !== undefined)
      updateFields.yearsOfExperience = Number(yearsOfExperience);

    // No fields provided
    if (Object.keys(updateFields).length === 0) {
      return {
        success: false,
        message: "No valid fields to update",
      };
    }

    // Update freelancer profile
    const updatedProfile = await Freelancer.findOneAndUpdate(
      { userId: objectId },
      { $set: updateFields },
      { new: true } // return updated doc
    );

    if (!updatedProfile) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function createFreelancerService(
  userId,
  { title, name, bio, description, category, skills, hourlyRate, profilePicture }
) {
  try {
    // Convert to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Prepare service object
    const newService = {
      title: title?.trim() || "",
      name: name?.trim() || "",
      bio: bio?.trim() || "",
      description: description?.trim() || "",
      category: category?.trim() || "",
      skills: skills || [],
      hourlyRate: hourlyRate ?? 50,
      profilePicture: profilePicture || "",
    };

    // Add service to freelancer
    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { userId: objectId },
      { $push: { services: newService } }, // push service inside array
      { new: true } // return updated document
    );

    if (!updatedFreelancer) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    // Get the last added service (the one we just pushed)
    const addedService = updatedFreelancer.services[updatedFreelancer.services.length - 1];

    return {
      success: true,
      message: "Service created successfully",
      data: addedService,
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

module.exports = { getFreelancerProfile, addNameAndUser,updateUserProfile ,createFreelancerService};
