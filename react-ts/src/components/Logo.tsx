import React from 'react';

interface LogoProps {
    width?: number | string;
    height?: number | string;
    variant?: 'default' | 'white' | 'dark';
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    width = 120,
    height = 40,
    variant = 'default',
    className = '',
}) => {
    const getLogoSrc = () => {
        switch (variant) {
            case 'white': return '/logo-white.svg';
            case 'dark' : return '/logo-dark.svg';
            // default: return '/logo.svg';
            default: return '/assets/images/logo.svg';
        }
    };
    return (
        <img 
            src={getLogoSrc()}
            alt="I Thee Wed Logo"
            width={width}
            height={height}
            className={className}
            style={{ display: 'block' , backgroundColor: variant === 'default' ? 'red' : 'green', padding: variant === 'default' ? '4px' : '0' }} 
        />
    );
};

export default Logo;