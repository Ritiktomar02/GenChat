const Logo = ({ className = "size-6", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-5 5z" />
    <path d="M8.5 7.5l-2 2 2 2" />
    <path d="M12.5 7.5l2 2-2 2" />
    <line x1="11.5" y1="6.5" x2="9.5" y2="12.5" />
    <path
      d="M18 5.5l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export default Logo;
