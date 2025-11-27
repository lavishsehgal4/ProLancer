import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { createOrder } from "../../../services/api/orderApi";
import "./OrderRequestModal.css";

/**
 * OrderRequestModal Component
 * Modal for clients to request orders from freelancers
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Function to close modal
 * @param {Object} service - Service details
 * @param {Object} freelancerInfo - Freelancer information
 */

const OrderRequestModal = ({ isOpen, onClose, service, freelancerInfo }) => {
    const [formData, setFormData] = useState({
        projectTitle: "",
        description: "",
        budget: service?.hourlyRate * 10 || 500,
        deadline: "",
        requirements: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Don't render if modal is not open
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.projectTitle.trim()) {
            newErrors.projectTitle = "Project title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Project description is required";
        } else if (formData.description.trim().length < 50) {
            newErrors.description = "Description must be at least 50 characters";
        }

        if (!formData.budget || formData.budget < 1) {
            newErrors.budget = "Budget must be at least $1";
        }

        if (!formData.deadline) {
            newErrors.deadline = "Deadline is required";
        } else {
            const selectedDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate <= today) {
                newErrors.deadline = "Deadline must be in the future";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                serviceId: service._id,
                freelancerId: service.freelancerId || "freelancer-placeholder",
                projectTitle: formData.projectTitle,
                description: formData.description,
                budget: parseFloat(formData.budget),
                deadline: formData.deadline,
                requirements: formData.requirements || "",
                message: `Project: ${formData.projectTitle}\n\nDescription: ${formData.description}\n\nRequirements: ${formData.requirements || "None specified"}`
            };

            console.log("Submitting order request:", orderData);

            const response = await createOrder(orderData);

            if (response.success) {
                // Success - show success message and close modal
                alert("Order request sent successfully! The freelancer will contact you soon.");
                onClose();

                // Reset form
                setFormData({
                    projectTitle: "",
                    description: "",
                    budget: service?.hourlyRate * 10 || 500,
                    deadline: "",
                    requirements: ""
                });
            } else {
                alert(response.message || "Failed to send order request");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Failed to send order request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="order-modal-backdrop" onClick={handleBackdropClick}>
            <div className={`order-modal ${loading ? 'order-modal--loading' : ''}`}>
                {/* Loading Overlay */}
                {loading && (
                    <div className="order-modal__loading-overlay">
                        <div className="order-modal__loading-content">
                            <div className="order-modal__spinner">
                                <Loader2 className="spinner-icon" size={32} />
                            </div>
                            <p className="order-modal__loading-text">Sending your request...</p>
                        </div>
                    </div>
                )}

                {/* Modal Header */}
                <div className="order-modal__header">
                    <div className="order-modal__title-section">
                        <h2 className="order-modal__title">Request Order</h2>
                        <p className="order-modal__subtitle">
                            Send a project request to {freelancerInfo?.name || "the freelancer"}
                        </p>
                    </div>
                    <button
                        className="order-modal__close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Service Info */}
                <div className="order-modal__service-info">
                    <div className="order-modal__service-details">
                        <h3 className="order-modal__service-title">{service?.title}</h3>
                        <p className="order-modal__service-rate">${service?.hourlyRate}/hour</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="order-modal__form">
                    {/* Project Title */}
                    <div className="order-modal__field">
                        <label htmlFor="projectTitle" className="order-modal__label">
                            Project Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="projectTitle"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleChange}
                            className={`order-modal__input ${errors.projectTitle ? 'order-modal__input--error' : ''}`}
                            placeholder="e.g., E-commerce Website Development"
                            disabled={loading}
                        />
                        {errors.projectTitle && (
                            <span className="order-modal__error">{errors.projectTitle}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="order-modal__field">
                        <label htmlFor="description" className="order-modal__label">
                            Project Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`order-modal__textarea ${errors.description ? 'order-modal__textarea--error' : ''}`}
                            rows="4"
                            placeholder="Describe your project in detail. What do you need? What are your expectations?"
                            disabled={loading}
                        />
                        <div className="order-modal__char-count">
                            {formData.description.length}/500 characters
                        </div>
                        {errors.description && (
                            <span className="order-modal__error">{errors.description}</span>
                        )}
                    </div>

                    {/* Budget and Deadline Row */}
                    <div className="order-modal__row">
                        <div className="order-modal__field">
                            <label htmlFor="budget" className="order-modal__label">
                                Budget ($) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className={`order-modal__input ${errors.budget ? 'order-modal__input--error' : ''}`}
                                min="1"
                                step="0.01"
                                disabled={loading}
                            />
                            {errors.budget && (
                                <span className="order-modal__error">{errors.budget}</span>
                            )}
                        </div>

                        <div className="order-modal__field">
                            <label htmlFor="deadline" className="order-modal__label">
                                Deadline <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className={`order-modal__input ${errors.deadline ? 'order-modal__input--error' : ''}`}
                                min={new Date().toISOString().split('T')[0]}
                                disabled={loading}
                            />
                            {errors.deadline && (
                                <span className="order-modal__error">{errors.deadline}</span>
                            )}
                        </div>
                    </div>

                    {/* Additional Requirements */}
                    <div className="order-modal__field">
                        <label htmlFor="requirements" className="order-modal__label">
                            Additional Requirements
                        </label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            className="order-modal__textarea"
                            rows="3"
                            placeholder="Any specific requirements, technologies, or preferences? (Optional)"
                            disabled={loading}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="order-modal__actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="order-modal__btn order-modal__btn--cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`order-modal__btn order-modal__btn--submit ${loading ? 'order-modal__btn--loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="btn-spinner" size={16} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderRequestModal;