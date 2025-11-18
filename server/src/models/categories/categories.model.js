const Freelancer = require("../FREELANCER/freelancer.mongo");
const mongoose = require("mongoose");

/**
 * Get paginated & filtered services by service TITLE (case-insensitive)
 *
 * @param {String} title   - service title from URL (e.g., "web development")
 * @param {Number} page    - page number
 * @param {Number} limit   - services per page
 * @param {Object} filters - optional filters (price, rating, experience)
 */
async function getServicesByCategory(title, page = 1, limit = 6, filters = {}) {
  try {
    // Convert to lowercase ONCE for comparison
    const loweredTitle = title.toLowerCase();

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    // ----------------------------------------------------------
    // 1️⃣ MATCH FILTERS (WITH LOWERCASE TITLE MATCHING)
    // ----------------------------------------------------------

    const matchFilters = {
      // Case-insensitive comparison using $expr + $toLower
      $expr: {
        $eq: [
          { $toLower: "$services.title" },   // DB title lowercased
          loweredTitle                       // param lowercased
        ]
      },

      // only active services
      "services.isActive": true
    };

    // Budget filter
    if (filters.minRate && filters.maxRate) {
      matchFilters["services.hourlyRate"] = {
        $gte: Number(filters.minRate),
        $lte: Number(filters.maxRate)
      };
    }

    // Rating filter
    if (filters.rating) {
      matchFilters["services.averageRating"] = {
        $gte: Number(filters.rating)
      };
    }

    // Experience filter
    if (filters.experience) {
      if (filters.experience === "entry") {
        matchFilters["yearsOfExperience"] = { $lte: 1 };
      } else if (filters.experience === "intermediate") {
        matchFilters["yearsOfExperience"] = { $gt: 1, $lte: 4 };
      } else if (filters.experience === "expert") {
        matchFilters["yearsOfExperience"] = { $gt: 4 };
      }
    }

    // ----------------------------------------------------------
    // 2️⃣ AGGREGATION PIPELINE
    // ----------------------------------------------------------
    const pipeline = [
      // A. Flatten services array
      { $unwind: "$services" },

      // B. Apply match filters
      { $match: matchFilters },

      // C. Join user collection to get freelancer full name
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },

      // D. Sort best rated first
      { $sort: { "services.averageRating": -1 } },

      // E. Paginated results + total count (in ONE query)
      {
        $facet: {
          // paginated services
          paginatedResults: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                id: "$services._id",
                title: "$services.title",
                bio: "$services.bio",
                hourlyRate: "$services.hourlyRate",
                profilePicture: "$services.profilePicture",
                averageRating: "$services.averageRating",
                totalReviews: "$services.totalReviews",
                skills: "$services.skills",

                // Combine first & last name
                name: {
                  $concat: [
                    "$userInfo.firstName",
                    " ",
                    "$userInfo.lastName"
                  ]
                }
              }
            }
          ],

          // count total results for pagination
          totalCount: [
            { $count: "total" }
          ]
        }
      }
    ];

    // Execute pipeline
    const result = await Freelancer.aggregate(pipeline);

    const services = result[0].paginatedResults;
    const totalItems = result[0].totalCount[0]
      ? result[0].totalCount[0].total
      : 0;

    const totalPages = Math.ceil(totalItems / limit);

    return {
      success: true,
      title,
      currentPage: page,
      totalPages,
      limit,
      totalItems,
      services
    };

  } catch (err) {
    console.error("PAGINATION ERROR:", err);
    return {
      success: false,
      message: "Server error in getServicesByCategory",
      error: err.message
    };
  }
}

module.exports = { getServicesByCategory };
