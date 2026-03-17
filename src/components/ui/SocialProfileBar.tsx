'use client';

import React from 'react';

interface SocialProfileBarProps {
  hudlUrl?: string | null;
  on3Url?: string | null;
  two47Url?: string | null;
  rivalsUrl?: string | null;
  twitterHandle?: string | null;
  instagramHandle?: string | null;
  youtubeUrl?: string | null;
  maxPrepsUrl?: string | null;
  highlightsUrl?: string | null;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { icon: 24, button: 32, gap: 'gap-2' },
  md: { icon: 32, button: 44, gap: 'gap-3' },
  lg: { icon: 40, button: 56, gap: 'gap-4' },
};

const brandColors = {
  hudl: '#FF5722',
  on3: '#0066FF',
  two47: '#CC0000',
  rivals: '#FFC107',
  x: '#000000',
  instagram: '#E1306C',
  youtube: '#FF0000',
  maxpreps: '#1B5E20',
};

// SVG Icon components
const HudlIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.hudl : 'currentColor'} strokeWidth="2" />
    <path d="M8 12L11 15L16 9" stroke={isHovered ? brandColors.hudl : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const On3Icon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.on3 : 'currentColor'} strokeWidth="2" />
    <text x="12" y="14" textAnchor="middle" fontSize="8" fontWeight="bold" fill={isHovered ? brandColors.on3 : 'currentColor'}>On3</text>
  </svg>
);

const Two47Icon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.two47 : 'currentColor'} strokeWidth="2" />
    <text x="12" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill={isHovered ? brandColors.two47 : 'currentColor'}>247</text>
  </svg>
);

const RivalsIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.rivals : 'currentColor'} strokeWidth="2" />
    <path d="M9 10L12 13L15 10" stroke={isHovered ? brandColors.rivals : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TwitterIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.x : 'currentColor'} strokeWidth="2" />
    <path d="M8 9L16 15M16 9L8 15" stroke={isHovered ? brandColors.x : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const InstagramIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="12" height="12" rx="3" stroke={isHovered ? brandColors.instagram : 'currentColor'} strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke={isHovered ? brandColors.instagram : 'currentColor'} strokeWidth="2" />
    <circle cx="17" cy="7" r="1" fill={isHovered ? brandColors.instagram : 'currentColor'} />
  </svg>
);

const YoutubeIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.youtube : 'currentColor'} strokeWidth="2" />
    <path d="M9 10V14L14 12L9 10Z" fill={isHovered ? brandColors.youtube : 'currentColor'} />
  </svg>
);

const MaxPrepsIcon = ({ size, isHovered }: { size: number; isHovered: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={isHovered ? brandColors.maxpreps : 'currentColor'} strokeWidth="2" />
    <path d="M8 12H16M12 8V16" stroke={isHovered ? brandColors.maxpreps : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const VerifiedBadge = () => (
  <div className="flex items-center gap-1">
    <svg width="20" height="20" viewBox="0 0 24 24" fill={`var(--psp-gold)`} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26H22L17.54 12.88L19.63 19.24L12 15.12L4.37 19.24L6.46 12.88L2 8.26H8.91L12 2Z" />
    </svg>
  </div>
);

interface SocialLinkProps {
  icon: React.ReactNode;
  url: string;
  label: string;
  size: 'sm' | 'md' | 'lg';
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, url, label, size }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const buttonSize = sizeConfig[size].button;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="text-[var(--psp-navy)] hover:text-[var(--psp-gold)] transition-all duration-200 transform hover:scale-110"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: buttonSize, height: buttonSize }}
    >
      <div className="w-full h-full flex items-center justify-center rounded-full hover:bg-[var(--psp-gray-100)]">
        {React.cloneElement(icon as React.ReactElement<any>, { isHovered })}
      </div>
    </a>
  );
};

const SocialProfileBar: React.FC<SocialProfileBarProps> = ({
  hudlUrl,
  on3Url,
  two47Url,
  rivalsUrl,
  twitterHandle,
  instagramHandle,
  youtubeUrl,
  maxPrepsUrl,
  highlightsUrl,
  isVerified = false,
  size = 'md',
}) => {
  const { icon: iconSize, gap } = sizeConfig[size];

  // Build social links array
  const links: SocialLinkProps[] = [];

  if (hudlUrl || highlightsUrl) {
    links.push({
      icon: <HudlIcon size={iconSize} isHovered={false} />,
      url: hudlUrl || highlightsUrl || '#',
      label: 'Hudl',
      size,
    });
  }

  if (on3Url) {
    links.push({
      icon: <On3Icon size={iconSize} isHovered={false} />,
      url: on3Url,
      label: 'On3',
      size,
    });
  }

  if (two47Url) {
    links.push({
      icon: <Two47Icon size={iconSize} isHovered={false} />,
      url: two47Url,
      label: '247Sports',
      size,
    });
  }

  if (rivalsUrl) {
    links.push({
      icon: <RivalsIcon size={iconSize} isHovered={false} />,
      url: rivalsUrl,
      label: 'Rivals',
      size,
    });
  }

  if (twitterHandle) {
    links.push({
      icon: <TwitterIcon size={iconSize} isHovered={false} />,
      url: `https://twitter.com/${twitterHandle}`,
      label: 'Twitter/X',
      size,
    });
  }

  if (instagramHandle) {
    links.push({
      icon: <InstagramIcon size={iconSize} isHovered={false} />,
      url: `https://instagram.com/${instagramHandle}`,
      label: 'Instagram',
      size,
    });
  }

  if (youtubeUrl) {
    links.push({
      icon: <YoutubeIcon size={iconSize} isHovered={false} />,
      url: youtubeUrl,
      label: 'YouTube',
      size,
    });
  }

  if (maxPrepsUrl) {
    links.push({
      icon: <MaxPrepsIcon size={iconSize} isHovered={false} />,
      url: maxPrepsUrl,
      label: 'MaxPreps',
      size,
    });
  }

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center ${gap}`}>
      {isVerified && <VerifiedBadge />}
      <div className={`flex items-center ${gap}`}>
        {links.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SocialProfileBar);
