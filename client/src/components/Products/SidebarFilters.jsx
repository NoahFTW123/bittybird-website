import { useState, useEffect } from "react";
import Slider from "react-slider";
import PropTypes from 'prop-types';
import "../../css/Products/sidebarFilters.css";

const MIN = 0;
const MAX = 100;

const SidebarFilters = ({ 
    setPriceRange, selectedTags, setSelectedTags, 
    searchQuery, setSearchQuery, 
    currentPage, setCurrentPage, totalPages 
}) => {
    const [localPriceRange, setLocalPriceRange] = useState([MIN, MAX]);

    const availableTags = [
        "christ", "keychain", "doctrine and covenants", "lds", "family",
        "ornament", "snowflake", "featured", "missionary", "tree", "sign",
        "home", "state", "pets", "cat", "dog", "christmas", "stocking",
        "joy", "primary", "name"
    ];

    useEffect(() => {
        setSearchQuery(searchQuery);
    }, [searchQuery]);

    const handlePriceChange = (newRange) => {
        if (!Array.isArray(newRange) || newRange.length !== 2) return;
        setLocalPriceRange(newRange);
        setPriceRange(newRange);
        setCurrentPage(1);
    };

    const handleMinInputChange = (e) => {
        const min = Math.max(MIN, Math.min(Number(e.target.value), localPriceRange[1] - 1));
        handlePriceChange([min, localPriceRange[1]]);
    };

    const handleMaxInputChange = (e) => {
        const max = Math.min(MAX, Math.max(Number(e.target.value), localPriceRange[0] + 1));
        handlePriceChange([localPriceRange[0], max]);
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
        setCurrentPage(1);
    };

    return (
        <div className="sidebar-filters">
            <h3>Search</h3>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sidebar-search-input"
            />

            <h3>Price Range</h3>
            <div className="price-inputs">
                <input
                    type="number"
                    value={localPriceRange[0]}
                    onChange={handleMinInputChange}
                    min={MIN}
                    max={localPriceRange[1] - 1}
                />
                <span>to</span>
                <input
                    type="number"
                    value={localPriceRange[1]}
                    onChange={handleMaxInputChange}
                    min={localPriceRange[0]}
                    max={MAX}
                />
            </div>
            <Slider
                className="slider"
                onChange={handlePriceChange}
                value={localPriceRange}
                min={MIN}
                max={MAX}
                step={1}
                minDistance={1}
            />

            <h3>Filter by Tags</h3>
            <div className="tags-filter">
                <div className="tags-scroll">
                    {availableTags.map((tag) => (
                        <label key={tag} className="tag-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedTags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                            />
                            <span>{tag}</span>
                        </label>
                    ))}
                </div>
            </div>

            <h3>Pages</h3>
            <div className="pagination">
                <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >◀</button>

                {[...Array(totalPages).keys()].map(number => (
                    <button 
                        key={number + 1} 
                        className={`page-btn ${currentPage === number + 1 ? "active" : ""}`} 
                        onClick={() => setCurrentPage(number + 1)}
                    >
                        {number + 1}
                    </button>
                ))}

                <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >▶</button>
            </div>
        </div>
    );
};

SidebarFilters.propTypes = {
    setPriceRange: PropTypes.func.isRequired,
    selectedTags: PropTypes.array.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
};

export default SidebarFilters;
