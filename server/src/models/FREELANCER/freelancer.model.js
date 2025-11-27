const Freelancer = require("./freelancer.mongo");
const mongoose = require("mongoose");
const FreelancerServiceMap = require("../FreelancerServiceMap/FreelancerServiceMap.mongo");

async function getFreelancerProfile(userId) {
  try {
    const freelancer = await Freelancer.findOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        aboutMe: 1,
        education: 1,
        yearsOfExperience: 1,
        averageRating: 1,
        services: 1,
        completedJobs: 1,
        activeJobs: 1,
        successRate: 1,
        profileCompleted: 1,
        profileCompletionPercentage: 1,
        isVerified: 1,
        verificationBadges: 1,
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
        services: freelancer.services,

        completedJobs: freelancer.completedJobs,
        activeJobs: freelancer.activeJobs,
        successRate: freelancer.successRate,
        profileCompleted: freelancer.profileCompleted,
        profileCompletionPercentage: freelancer.profileCompletionPercentage,
        isVerified: freelancer.isVerified,
        verificationBadges: freelancer.verificationBadges,
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
  {
    aboutMe,
    education,
    yearsOfExperience,
    successRate,
    profileCompleted,
    profileCompletionPercentage,
  }
) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const updateFields = {};

    if (aboutMe !== undefined) updateFields.aboutMe = aboutMe;
    if (education !== undefined) updateFields.education = education;
    if (yearsOfExperience !== undefined)
      updateFields.yearsOfExperience = Number(yearsOfExperience);
    if (successRate !== undefined)
      updateFields.successRate = Number(successRate);
    if (profileCompleted !== undefined)
      updateFields.profileCompleted = Boolean(profileCompleted);
    if (profileCompletionPercentage !== undefined)
      updateFields.profileCompletionPercentage = Number(
        profileCompletionPercentage
      );

    if (Object.keys(updateFields).length === 0) {
      return {
        success: false,
        message: "No valid fields to update",
      };
    }

    const updatedProfile = await Freelancer.findOneAndUpdate(
      { userId: objectId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProfile) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    // --------------------------------------
    // Remove unnecessary fields from response
    // --------------------------------------
    const safeProfile = updatedProfile.toObject();
    delete safeProfile._id;
    delete safeProfile.userId;
    delete safeProfile.__v;
    delete safeProfile.createdAt;
    delete safeProfile.updatedAt;

    return {
      success: true,
      message: "Profile updated successfully",
      data: safeProfile,
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
  { title, bio, description, category, skills, hourlyRate, profilePicture }
) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // -------------------------------------
    // 1️⃣ CHECK IF SERVICE TITLE ALREADY EXISTS
    // -------------------------------------
    const exists = await Freelancer.findOne({
      userId: objectId,
      "services.title": title.trim(),
    });

    if (exists) {
      return {
        success: false,
        message:
          "A service with this title already exists. Please choose a different title.",
      };
    }

    // -------------------------------------
    // 2️⃣ BUILD NEW SERVICE OBJECT
    // -------------------------------------
    const newService = {
      title: title?.trim(),
      bio: bio?.trim(),
      description: description?.trim(),
      category: category?.trim(),
      skills: skills || [],
      hourlyRate: Number(hourlyRate),
      profilePicture: profilePicture?.trim(),
    };

    // -------------------------------------
    // 3️⃣ PUSH SERVICE INSIDE SERVICES ARRAY
    // -------------------------------------
    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { userId: objectId },
      { $push: { services: newService } },
      { new: true }
    );

    if (!updatedFreelancer) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    // Last added service
    const addedService =
      updatedFreelancer.services[updatedFreelancer.services.length - 1];

    // -------------------------------------
    // 4️⃣ INSERT INTO MAPPING COLLECTION
    // -------------------------------------
    await FreelancerServiceMap.create({
      userId: objectId,
      serviceId: addedService._id,
    });

    // -------------------------------------
    // 5️⃣ CLEAN OUTPUT
    // -------------------------------------
    const safeService = addedService.toObject();
    delete safeService._id;
    delete safeService.createdAt;
    delete safeService.updatedAt;
    delete safeService.__v;

    return {
      success: true,
      message: "Service created successfully",
      data: safeService,
    };
  } catch (err) {
    console.error("SERVICE ERROR:", err);
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function updateFreelancerService(userId, title, updates) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Find freelancer
    const freelancer = await Freelancer.findOne({ userId: objectId });

    if (!freelancer) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    // 2️⃣ Find service by title
    const service = freelancer.services.find(
      (s) => s.title.toLowerCase() === title.toLowerCase()
    );

    if (!service) {
      return {
        success: false,
        message: "Service with this title not found",
      };
    }

    // Allowed update fields
    const allowedFields = [
      "title",
      "bio",
      "description",
      "category",
      "skills",
      "hourlyRate",
      "profilePicture",
    ];

    // 3️⃣ Validate updates — no empty values allowed
    for (let key in updates) {
      if (!allowedFields.includes(key)) {
        return {
          success: false,
          message: `Invalid update field: ${key}`,
        };
      }

      const value = updates[key];

      if (
        value === "" ||
        value === " " ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return {
          success: false,
          message: `Field "${key}" cannot be empty`,
        };
      }
    }

    // 4️⃣ Apply updates
    for (let key in updates) {
      if (key === "hourlyRate") {
        service[key] = Number(updates[key]);
      } else {
        service[key] = updates[key];
      }
    }

    // 5️⃣ Save freelancer
    await freelancer.save();

    // 6️⃣ Clean output
    const safeService = service.toObject();
    delete safeService._id;
    delete safeService.createdAt;
    delete safeService.updatedAt;
    delete safeService.__v;

    return {
      success: true,
      message: "Service updated successfully",
      data: safeService,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function deleteFreelancerService(userId, title) {}

/**
 * Delete a service
 */
async function deleteFreelancerService(userId, serviceId) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { userId: objectId },
      { $pull: { services: { _id: serviceId } } },
      { new: true }
    );

    if (!updatedFreelancer) {
      return {
        success: false,
        message: "Freelancer profile not found",
      };
    }

    return {
      success: true,
      message: "Service deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

module.exports = {
  getFreelancerProfile,
  addNameAndUser,
  updateUserProfile,
  createFreelancerService,
  updateFreelancerService,

  deleteFreelancerService,
};
