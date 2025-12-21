import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  User, 
  MapPin, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  Award,
  Briefcase
} from "lucide-react";
import { getPublicClientProfile } from "../../services/api/clientApi";
import "./ClientPublicProfile.css";

const ClientPublicProfile = () => {
  const { userId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchClientProfile();
    }
  }, [userId]);

  const fetchClientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPublicClientProfile(userId);
      
      if (response.success) {
        setClientData(response.data);
      } else {
        setError(response.message || "Failed to load client profile");
      }
    } catch (err) {
      console.error("Error fetching client profile:", err);
      setError("Failed to load client profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="client-public-profile">
        <div className="client-public-profile__loading">
          <div className="loading-spinner"></div>
          <p>Loading client profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-public-profile">
        <div className="client-public-profile__error">
          <h2>Profile Not Found</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="client-public-profile">
        <div className="client-public-profile__error">
          <h2>Profile Not Found</h2>
          <p>The requested client profile could not be found.</p>
        </div>
      </div>
    );
  }

  const { name, country, company } = clientData;

  return (
    <div className="client-public-profile">
      <div className="client-public-profile__container">
        {/* Header Section */}
        <div className="client-public-profile__header">
          <div className="client-public-profile__avatar">
            <User size={48} />
          </div>
          <div className="client-public-profile__basic-info">
            <h1 className="client-public-profile__name">{name || "Client Name"}</h1>
            {country && (
              <div className="client-public-profile__location">
                <MapPin size={16} />
                <span>{country}</span>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        {company && (
          <div className="client-public-profile__section">
            <h2 className="client-public-profile__section-title">
              <Building size={24} />
              Company Information
            </h2>
            <div className="client-public-profile__company-grid">
              {company.companyName && (
                <div className="client-public-profile__info-item">
                  <span className="client-public-profile__info-label">Company Name:</span>
                  <span className="client-public-profile__info-value">{company.companyName}</span>
                </div>
              )}
              
              {company.industry && (
                <div className="client-public-profile__info-item">
                  <span className="client-public-profile__info-label">Industry:</span>
                  <span className="client-public-profile__info-value">{company.industry}</span>
                </div>
              )}
              
              {company.companySize && (
                <div className="client-public-profile__info-item">
                  <span className="client-public-profile__info-label">Company Size:</span>
                  <span className="client-public-profile__info-value">{company.companySize}</span>
                </div>
              )}
              
              {company.website && (
                <div className="client-public-profile__info-item">
                  <span className="client-public-profile__info-label">Website:</span>
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-public-profile__info-link"
                  >
                    <Globe size={16} />
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Company Description */}
        {company?.companyDescription && (
          <div className="client-public-profile__section">
            <h2 className="client-public-profile__section-title">
              <Briefcase size={24} />
              About the Company
            </h2>
            <p className="client-public-profile__description">
              {company.companyDescription}
            </p>
          </div>
        )}

        {/* Contact Information */}
        {(company?.contactEmail || company?.contactPhone) && (
          <div className="client-public-profile__section">
            <h2 className="client-public-profile__section-title">
              <Mail size={24} />
              Contact Information
            </h2>
            <div className="client-public-profile__contact-grid">
              {company.contactEmail && (
                <div className="client-public-profile__contact-item">
                  <Mail size={20} />
                  <a href={`mailto:${company.contactEmail}`} className="client-public-profile__contact-link">
                    {company.contactEmail}
                  </a>
                </div>
              )}
              
              {company.contactPhone && (
                <div className="client-public-profile__contact-item">
                  <Phone size={20} />
                  <a href={`tel:${company.contactPhone}`} className="client-public-profile__contact-link">
                    {company.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="client-public-profile__stats">
          <div className="client-public-profile__stat-card">
            <Users size={32} />
            <div className="client-public-profile__stat-content">
              <span className="client-public-profile__stat-label">Member Since</span>
              <span className="client-public-profile__stat-value">
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="client-public-profile__stat-card">
            <Award size={32} />
            <div className="client-public-profile__stat-content">
              <span className="client-public-profile__stat-label">Verified Client</span>
              <span className="client-public-profile__stat-value">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPublicProfile;