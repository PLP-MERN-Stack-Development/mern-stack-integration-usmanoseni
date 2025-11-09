import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with different variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element} - Button component
 */

const Button = ({variant = "primary", size = "xs", disabled= false, onClick, children, className='', ...rest}
) => { 
   const baseclass = "inline-flex justify-center items-center hover:cursor-pointer font-medium rounded-sm focus:outline-none focus:ring-1 focus:ring-offset-2 transition-colors duration-200";

    const variants = {
        primary_one: "bg-green-600 text-white hover:bg-green-700/80 focus:ring-green-500",
        primary_two: "bg-yellow-500 text-white hover:bg-yellow-500/80 focus:ring-yellow-500 ",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    const sizes = {
        xs: "px-4 py-1.5 text-xs",
        sm: "px-3 py-1.5 text-xs lg:text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
    const combinedClassName = `${baseclass} ${variants[variant]} ${sizes[size]} ${disabledClass} ${className}`;
    return (
        <button 
            className={combinedClassName}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );  
}

export default Button;