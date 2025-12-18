import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0F62FE" />
    <path d="M20 10L10 15L20 20L30 15L20 10Z" fill="white" />
    <path d="M10 25L20 30L30 25V18L20 23L10 18V25Z" fill="white" fillOpacity="0.8" />
  </svg>
);

export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="150" r="140" fill="#EEF4FF" />
    <rect x="100" y="100" width="80" height="120" rx="8" fill="#FFFFFF" stroke="#0F62FE" strokeWidth="2" />
    <rect x="110" y="120" width="60" height="4" rx="2" fill="#E0E0E0" />
    <rect x="110" y="130" width="40" height="4" rx="2" fill="#E0E0E0" />
    <circle cx="280" cy="160" r="40" fill="#00B37E" fillOpacity="0.1" />
    <path d="M260 160L275 175L300 145" stroke="#00B37E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M50 250 C 100 280, 300 280, 350 250" stroke="#FF8A65" strokeWidth="2" strokeDasharray="8 8" fill="none" />
  </svg>
);

export const EmptyStateIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 150" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="40" width="80" height="70" rx="4" fill="#F6F9FC" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="100" cy="75" r="15" fill="#EEF4FF" />
    <path d="M100 68V82M93 75H107" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Step1Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#EEF4FF" />
    <path d="M24 14V34M14 24H34" stroke="#0F62FE" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const Step2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#EEF4FF" />
    <path d="M16 16H32V32H16Z" stroke="#0F62FE" strokeWidth="2" fill="white" />
    <path d="M20 22H28M20 26H26" stroke="#0B5BE6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Step3Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#EEF4FF" />
    <path d="M18 24L22 28L30 20" stroke="#00B37E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Step4Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#EEF4FF" />
    <path d="M24 16V22L28 26" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="24" r="10" stroke="#FF8A65" strokeWidth="2" />
  </svg>
);

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4" />
    <path d="M4 6v12a2 2 0 002 2h14v-4" />
    <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
  </svg>
);