export const ProviderLogos = {
  jira: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#0052CC"/>
      <path d="M12 6L8 10L12 14L16 10L12 6Z" fill="white"/>
      <path d="M12 10L8 14L12 18L16 14L12 10Z" fill="white" opacity="0.7"/>
    </svg>
  ),

  asana: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#F06A6A"/>
      <circle cx="12" cy="8" r="2.5" fill="white"/>
      <circle cx="8" cy="14" r="2.5" fill="white"/>
      <circle cx="16" cy="14" r="2.5" fill="white"/>
    </svg>
  ),

  trello: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#0079BF"/>
      <rect x="6" y="6" width="4" height="10" rx="1" fill="white"/>
      <rect x="14" y="6" width="4" height="7" rx="1" fill="white"/>
    </svg>
  ),

  clickup: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#7B68EE"/>
      <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  linear: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#5E6AD2"/>
      <path d="M8 16C8 11.5817 11.5817 8 16 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 8L16 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 8L12 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),

  slack: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#4A154B"/>
      {/* Vertical bars - left (red) and right (green) */}
      <rect x="7" y="9.5" width="2" height="5" rx="1" fill="#E01E5A"/>
      <rect x="15" y="9.5" width="2" height="5" rx="1" fill="#2EB67D"/>
      {/* Horizontal bars - top (blue) and bottom (yellow) */}
      <rect x="9.5" y="7" width="5" height="2" rx="1" fill="#36C5F0"/>
      <rect x="9.5" y="15" width="5" height="2" rx="1" fill="#ECB22E"/>
      {/* Corner pieces to complete the hashtag */}
      <circle cx="8" cy="8" r="1" fill="#E01E5A"/>
      <circle cx="16" cy="8" r="1" fill="#36C5F0"/>
      <circle cx="8" cy="16" r="1" fill="#ECB22E"/>
      <circle cx="16" cy="16" r="1" fill="#2EB67D"/>
    </svg>
  ),

  teams: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#5B5FC7"/>
      {/* T letterform */}
      <rect x="7" y="7" width="10" height="2.5" rx="0.5" fill="white"/>
      <rect x="10.75" y="7" width="2.5" height="10" rx="0.5" fill="white"/>
      {/* Small accent squares in bottom corners */}
      <rect x="7" y="14.5" width="2" height="2" rx="0.3" fill="white" opacity="0.7"/>
      <rect x="15" y="14.5" width="2" height="2" rx="0.3" fill="white" opacity="0.7"/>
    </svg>
  ),

  discord: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="#5865F2"/>
      <path d="M16 9C16 9 15 8 13.5 8C13.5 8 13.3 8.3 13.2 8.5C14.3 8.7 15 9 15.7 9.5C15 9.2 14.3 8.9 13.5 8.7C13.1 8.6 12.6 8.5 12 8.5C11.4 8.5 10.9 8.6 10.5 8.7C9.7 8.9 9 9.2 8.3 9.5C9 9 9.7 8.7 10.8 8.5C10.7 8.3 10.5 8 10.5 8C9 8 8 9 8 9C8 9 6.5 11.5 6.5 14.5C6.5 14.5 7.5 16 9.5 16C9.5 16 10 15.5 10.3 15C9.5 14.8 9 14.3 9 14.3C9 14.3 9.1 14.4 9.3 14.5C9.3 14.5 9.3 14.5 9.4 14.5C9.4 14.5 9.5 14.6 9.5 14.6C10 14.8 10.5 15 11 15.1C11.6 15.2 12.4 15.2 13 15.1C13.5 15 14 14.8 14.5 14.6C14.5 14.6 14.6 14.5 14.6 14.5C14.6 14.5 14.6 14.5 14.7 14.5C14.9 14.4 15 14.3 15 14.3C15 14.3 14.5 14.8 13.7 15C14 15.5 14.5 16 14.5 16C16.5 16 17.5 14.5 17.5 14.5C17.5 11.5 16 9 16 9Z" fill="white"/>
      <circle cx="10.5" cy="13" r="0.8" fill="#5865F2"/>
      <circle cx="13.5" cy="13" r="0.8" fill="#5865F2"/>
    </svg>
  ),

  gcal: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect width="24" height="24" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="5" y="6" width="14" height="13" rx="2" fill="#4285F4"/>
      <rect x="5" y="6" width="14" height="4" rx="2" fill="#1967D2"/>
      <text x="12" y="15.5" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">31</text>
    </svg>
  ),
};

interface ProviderLogoProps {
  provider: keyof typeof ProviderLogos;
  className?: string;
}

export function ProviderLogo({ provider, className = "w-11 h-11" }: ProviderLogoProps) {
  const Logo = ProviderLogos[provider];
  return (
    <div className={`${className} flex-shrink-0`}>
      <Logo />
    </div>
  );
}
