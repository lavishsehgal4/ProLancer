import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CategoryHeader from "../../components/category/CategoryHeader/CategoryHeader";
import FilterSidebar from "../../components/category/FilterSidebar/FilterSidebar";
import ServiceCard from "../../components/common/ServiceCard/ServiceCard";
import { getServicesByCategory } from "../../services/api/categoriesApi";
import "./CategoryDetail.css";

/**
 * CategoryDetail Page
 * Displays services in a specific category with filters and pagination
 */

const CategoryDetail = () => {
  // Get category name from URL params
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 6
  });

  // Filter state
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 6,
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    rating: searchParams.get('rating') || '',
    experience: searchParams.get('experience') || ''
  });

  // Format category name for display (e.g., "web-development" -> "Web Development")
  const formatCategoryName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayCategoryName = formatCategoryName(categoryName);

  // Fetch services when component mounts or filters change
  useEffect(() => {
    fetchServices();
  }, [categoryName, filters]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  /**
   * Fetch services from backend API
   */
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filter options (only include non-empty values)
      const options = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          options[key] = value;
        }
      });

      console.log("Fetching services for category:", categoryName, "with filters:", options);

      const response = await getServicesByCategory(categoryName, options);

      console.log("API Response:", response);
      console.log("Services from API:", response.data?.services);

      if (response.success) {
        setServices(response.data.services);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
          limit: response.data.limit
        });
      } else {
        setError(response.message || "Failed to load services");
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("An error occurred while loading services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page: page
    }));
  };

  /**
   * Handle sorting
   */
  const handleSortChange = (sortValue) => {
    // You can implement sorting logic here
    console.log("Sort changed to:", sortValue);
    // For now, just refresh the data
    fetchServices();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="category-detail">
        <CategoryHeader categoryTitle={displayCategoryName} />
        <div className="category-detail__content">
          <div className="category-detail__container">
            <div className="category-detail__loading">
              <div className="loading-spinner"></div>
              <p>Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-detail">
      {/* Category Header Section */}
      <CategoryHeader categoryTitle={displayCategoryName} />

      {/* Main Content Area */}
      <div className="category-detail__content">
        <div className="category-detail__container">
          {/* Left Sidebar - Filters */}
          <FilterSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Right Side - Service Listings */}
          <main className="category-detail__main">
            {/* Results Header */}
            <div className="category-detail__header">
              <p className="category-detail__results">
                {error ? (
                  <span className="error-text">{error}</span>
                ) : (
                  <>
                    Found <strong>{pagination.totalItems}</strong> services
                    {pagination.totalItems > 0 && (
                      <span className="page-info">
                        {" "}(Page {pagination.currentPage} of {pagination.totalPages})
                      </span>
                    )}
                  </>
                )}
              </p>
              <select 
                className="category-detail__sort"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="top-rated">Top Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="category-detail__error">
                <p>{error}</p>
                <button onClick={fetchServices} className="retry-button">
                  Try Again
                </button>
              </div>
            )}

            {/* Services Grid */}
            {!error && services.length > 0 && (
              <div className="category-detail__grid">
                {services.map((service) => {
                  // Debug: Log the service data to see what we're receiving
                  console.log("Raw service data from API:", service);
                  console.log("Service ID:", service.serviceId);
                  
                  // Transform service data to match ServiceCard component
                  // Handle different possible ID field names from backend
                  const actualServiceId = service.serviceId || service._id || service.id;
                  
                  const serviceData = {
                    _id: actualServiceId,
                    id: actualServiceId,
                    profilePicture: service.profilePicture || "/default-service.jpg",
                    name: service.name || "Service Provider",
                    title: service.title || service.bio,
                    rating: service.averageRating || 0,
                    reviewsCount: service.totalReviews || 0,
                    hourlyRate: service.hourlyRate || 0,
                    skills: service.skills || [],
                    bio: service.bio || "No description available",
                    freelancerId: service.freelancerId // Add if available
                  };
                  
                  console.log("Transformed service data:", serviceData);
                  
                  return (
                    <ServiceCard
                      key={actualServiceId || `service-${Math.random()}`}
                      service={serviceData}
                      showActions={false}
                    />
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!error && !loading && services.length === 0 && (
              <div className="category-detail__empty">
                <div className="empty-icon">🔍</div>
                <h3>No services found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button 
                  onClick={() => handleFilterChange({ 
                    minRate: '', 
                    maxRate: '', 
                    rating: '', 
                    experience: '' 
                  })}
                  className="clear-filters-button"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!error && services.length > 0 && pagination.totalPages > 1 && (
              <div className="category-detail__pagination">
                {/* Previous Button */}
                <button 
                  className="pagination__button"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.currentPage) <= 1;

                  if (!showPage && page === 2 && pagination.currentPage > 4) {
                    return <span key={page} className="pagination__ellipsis">...</span>;
                  }
                  
                  if (!showPage && page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) {
                    return <span key={page} className="pagination__ellipsis">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      className={`pagination__button ${
                        page === pagination.currentPage ? 'pagination__button--active' : ''
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button 
                  className="pagination__button"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
