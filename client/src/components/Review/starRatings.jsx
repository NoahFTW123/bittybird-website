import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "../../css/Review/reviewForm.css"; // Or your dedicated CSS for stars

const StarRatingDisplay = ({ rating }) => {
    return (
        <div className="star-rating-display">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                if (rating >= starValue) {
                    // Full star
                    return (
                        <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className="star filled"
                        />
                    );
                } else if (rating >= starValue - 0.5) {
                    // Half star
                    return (
                        <FontAwesomeIcon
                            key={index}
                            icon={faStarHalfAlt}
                            className="star half-filled"
                        />
                    );
                } else {
                    // Empty star
                    return (
                        <FontAwesomeIcon
                            key={index}
                            icon={faStarEmpty}
                            className="star empty"
                        />
                    );
                }
            })}
        </div>
    );
};

StarRatingDisplay.propTypes = {
    rating: PropTypes.number.isRequired,
  };

export default StarRatingDisplay;
