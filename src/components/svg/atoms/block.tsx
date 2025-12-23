import React from "react";

interface BlockProps {
  variant?: "default" | "secondary" | "tertiary" | "orange" | "purple" | "green";
  showStud?: boolean;
}

const Block: React.FC<BlockProps> = ({ variant = "default", showStud = true }) => {
  const colors = {
    default: {
      light: "#00B6FB",
      lightAlt: "#0097BD",
      dark: "#006F95",
      darkAlt: "#007096",
    },
    secondary: {
      light: "#F7F7F7",
      lightAlt: "#F7F7F7",
      dark: "#BDBDBD",
      darkAlt: "#BDBDBD",
    },
    tertiary: {
      light: "#E0E0E0",
      lightAlt: "#E0E0E0",
      dark: "#9E9E9E",
      darkAlt: "#9E9E9E",
    },
    orange: {
      light: "#FF8C42",
      lightAlt: "#FF7A29",
      dark: "#CC5500",
      darkAlt: "#E06100",
    },
    purple: {
      light: "#9B59B6",
      lightAlt: "#8E44AD",
      dark: "#6C3483",
      darkAlt: "#7D3C98",
    },
    green: {
      light: "#2ECC71",
      lightAlt: "#27AE60",
      dark: "#1E8449",
      darkAlt: "#229954",
    },
  };

  const colorScheme = colors[variant];

  return (
    <svg
      width="113"
      height="81"
      viewBox="0 0 113 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {showStud && (
        <>
          <path
            d="M75 25.8803V25.8762C75 19.2487 66.9411 13.8762 57 13.8762C47.0589 13.8762 39 19.2487 39 25.8762C39 32.5036 47.0589 37.8762 57 37.8762C66.9391 37.8762 74.9967 32.5058 75 25.8803Z"
            fill={colorScheme.light}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M75 25.8803V25.8762C75 19.2487 66.9411 13.8762 57 13.8762C47.0589 13.8762 39 19.2487 39 25.8762V31.8762C39 38.5036 47.0589 43.8762 57 43.8762C66.9411 43.8762 75 38.5036 75 31.8762C75 31.8245 74.9995 31.7729 74.9985 31.7214L75 25.8803Z"
            fill={colorScheme.light}
          />
          <path
            d="M75 25.8803C74.9967 32.5058 66.9391 37.8762 57 37.8762C47.0589 37.8762 39 32.5036 39 25.8762V31.8762C39 38.5036 47.0589 43.8762 57 43.8762C66.9411 43.8762 75 38.5036 75 31.8762C75 31.8245 74.9995 31.7729 74.9985 31.7214L75 25.8803Z"
            fill={colorScheme.dark}
          />
        </>
      )}
      <path
        d="M56.5 64.8766V80.2853L112.5 48.2762V32.5762L56.5 64.8766Z"
        fill={colorScheme.darkAlt}
      />
      <path
        d="M56.5 80.2853V64.8766L0.5 32.5762V48.2762L56.5 80.2853Z"
        fill={colorScheme.lightAlt}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={
          showStud
            ? "M0.5 32.5762L56.5 64.8766L112.5 32.5762L56.5 0.576172L0.5 32.5762ZM75 25.8762V25.8803L74.9985 31.7214C74.9995 31.7729 75 31.8245 75 31.8762C75 38.5036 66.9411 43.8762 57 43.8762C47.0589 43.8762 39 38.5036 39 31.8762V25.8762C39 19.2487 47.0589 13.8762 57 13.8762C66.9411 13.8762 75 19.2487 75 25.8762Z"
            : "M0.5 32.5762L56.5 64.8766L112.5 32.5762L56.5 0.576172L0.5 32.5762Z"
        }
        fill={colorScheme.light}
      />
      <path
        d={
          showStud
            ? "M56.5 80.2853V64.8766M56.5 80.2853L0.5 48.2762V32.5762M56.5 80.2853L112.5 48.2762V32.5762M56.5 64.8766L0.5 32.5762M56.5 64.8766L112.5 32.5762M0.5 32.5762L56.5 0.576172L112.5 32.5762M75 25.8803V25.8762C75 19.2487 66.9411 13.8762 57 13.8762C47.0589 13.8762 39 19.2487 39 25.8762M75 25.8803C74.9967 32.5058 66.9391 37.8762 57 37.8762C47.0589 37.8762 39 32.5036 39 25.8762M75 25.8803L74.9985 31.7214C74.9995 31.7729 75 31.8245 75 31.8762C75 38.5036 66.9411 43.8762 57 43.8762C47.0589 43.8762 39 38.5036 39 31.8762V25.8762"
            : "M56.5 80.2853V64.8766M56.5 80.2853L0.5 48.2762V32.5762M56.5 80.2853L112.5 48.2762V32.5762M56.5 64.8766L0.5 32.5762M56.5 64.8766L112.5 32.5762M0.5 32.5762L56.5 0.576172L112.5 32.5762"
        }
        stroke="black"
      />
    </svg>
  );
};

export default Block;
