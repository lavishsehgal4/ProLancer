import { useParams } from "react-router-dom";
import CategoryHeader from "../../components/category/CategoryHeader/CategoryHeader";
import FilterSidebar from "../../components/category/FilterSidebar/FilterSidebar";
import FreelancerCard from "../../components/common/FreelancerCard/FreelancerCard";
import "./CategoryDetail.css";

/**
 * CategoryDetail Page
 * Displays freelancers in a specific category with filters
 */

const CategoryDetail = () => {
  // Get category name from URL params
  const { categoryName } = useParams();

  // Format category name for display (e.g., "web-development" -> "Web Development")
  const formatCategoryName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayCategoryName = formatCategoryName(categoryName);

  // Mock freelancer data (replace with API call later)
  const mockFreelancers = [
    {
      id: 1,
      profilePicture:
        "https://ui-avatars.com/api/?name=John+Doe&background=6BA5A8&color=fff&size=200",
      name: "John Doe",
      title: "Senior Full Stack Developer",
      rating: 4.9,
      reviewsCount: 127,
      hourlyRate: 50,
      skills: ["React", "Node.js", "MongoDB", "Express"],
      bio: "I build scalable web applications with modern tech stack",
    },
    {
      id: 2,
      profilePicture:
        "https://ui-avatars.com/api/?name=Sarah+Smith&background=4A6B7C&color=fff&size=200",
      name: "Sarah Smith",
      title: "UI/UX Designer & Developer",
      rating: 5.0,
      reviewsCount: 89,
      hourlyRate: 45,
      skills: ["Figma", "React", "Tailwind CSS"],
      bio: "Creating beautiful and intuitive user experiences",
    },
    {
      id: 3,
      profilePicture:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=D1E9EB&color=4A6B7C&size=200",
      name: "Mike Johnson",
      title: "Backend Developer",
      rating: 4.8,
      reviewsCount: 156,
      hourlyRate: 60,
      skills: ["Python", "Django", "PostgreSQL"],
      bio: "Expert in building robust backend systems and APIs",
    },
    {
      id: 4,
      profilePicture:
        "https://ui-avatars.com/api/?name=Emma+Wilson&background=6BA5A8&color=fff&size=200",
      name: "Emma Wilson",
      title: "Frontend Developer",
      rating: 4.7,
      reviewsCount: 92,
      hourlyRate: 40,
      skills: ["Vue.js", "JavaScript", "CSS3"],
      bio: "Passionate about creating responsive web interfaces",
    },
    {
      id: 5,
      profilePicture:
        "https://ui-avatars.com/api/?name=David+Brown&background=4A6B7C&color=fff&size=200",
      name: "David Brown",
      title: "Mobile App Developer",
      rating: 4.9,
      reviewsCount: 134,
      hourlyRate: 55,
      skills: ["React Native", "iOS", "Android"],
      bio: "Building cross-platform mobile applications",
    },
    {
      id: 6,
      profilePicture:
        "https://ui-avatars.com/api/?name=Lisa+Anderson&background=D1E9EB&color=4A6B7C&size=200",
      name: "Lisa Anderson",
      title: "DevOps Engineer",
      rating: 5.0,
      reviewsCount: 78,
      hourlyRate: 70,
      skills: ["AWS", "Docker", "Kubernetes"],
      bio: "Streamlining deployment and infrastructure management",
    },
  ];

  return (
    <div className="category-detail">
      {/* Category Header Section */}
      <CategoryHeader categoryTitle={displayCategoryName} />

      {/* Main Content Area */}
      <div className="category-detail__content">
        <div className="category-detail__container">
          {/* Left Sidebar - Filters */}
          <FilterSidebar />

          {/* Right Side - Freelancer Listings */}
          <main className="category-detail__main">
            {/* Results Header */}
            <div className="category-detail__header">
              <p className="category-detail__results">
                Found <strong>{mockFreelancers.length}</strong> freelancers
              </p>
              <select className="category-detail__sort">
                <option value="top-rated">Top Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Freelancer Cards Grid */}
            <div className="category-detail__grid">
              {mockFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>

            {/* Pagination */}
            <div className="category-detail__pagination">
              <button className="pagination__button pagination__button--active">
                1
              </button>
              <button className="pagination__button">2</button>
              <button className="pagination__button">3</button>
              <button className="pagination__button">4</button>
              <button className="pagination__button">...</button>
              <button className="pagination__button">10</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
