import React from 'react'

interface IconProps {
  width?: number
  height?: number
  className?: string
}

export const VendorBlank2Icon: React.FC<IconProps> = ({ 
  width = 60, 
  height = 60, 
  className 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 74 74" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_1427_3712)">
      <mask id="mask0_1427_3712" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="10" y="6" width="54" height="61">
        <path d="M60.3746 17.1237L26.5672 8.06502C25.9267 7.89341 25.2443 7.98325 24.6701 8.31477C24.0959 8.64629 23.6769 9.19233 23.5053 9.83278L11.8584 53.2994C11.6868 53.9399 11.7767 54.6223 12.1082 55.1965C12.4397 55.7707 12.9858 56.1897 13.6262 56.3613L47.4336 65.42C48.0741 65.5916 48.7564 65.5017 49.3307 65.1702C49.9049 64.8387 50.3239 64.2927 50.4955 63.6522L62.1423 20.1855C62.3139 19.5451 62.2241 18.8627 61.8926 18.2885C61.5611 17.7143 61.015 17.2953 60.3746 17.1237Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26.6063 41.7226L43.51 46.2519M24.6651 48.967L33.117 51.2317M33.2269 26.6733L45.301 29.9086M37.6463 34.328L40.8815 22.2539" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </mask>
      <g mask="url(#mask0_1427_3712)">
        <path d="M15.7891 0L73.7446 15.5291L58.2155 73.4847L0.25992 57.9555L15.7891 0Z" fill="#CCFDF2"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1427_3712">
        <rect width="60" height="60" fill="white" transform="translate(15.7891) rotate(15)"/>
      </clipPath>
    </defs>
  </svg>
)
