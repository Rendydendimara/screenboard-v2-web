const RoundedCheckboxActive = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="8" fill="url(#paint0_linear_437_2029)" />
      <path
        d="M4.5 8L7 10.5L12 5.5"
        stroke="#F9F9F9"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_437_2029"
          x1="0"
          y1="8"
          x2="16"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2563EB" />
          <stop offset="1" stop-color="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default RoundedCheckboxActive;
