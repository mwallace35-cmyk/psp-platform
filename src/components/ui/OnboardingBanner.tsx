'use client';

import React, { useState, useEffect } from 'react';

interface OnboardingBannerProps {
  className?: string;
}

/**
 * Onboarding banner shown to first-time visitors
 *
 * Features:
 * - Only displays on first visit (localStorage check)
 * - Animated entrance with smooth fade-in
 * - Highlights key features of the platform
 * - CTA button to explore
 * - Dismiss button (persisted in localStorage)
 * - PSP brand colors (navy bg, gold accents, blue text)
 */
export default function OnboardingBanner({
  className = '',
}: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check localStorage for onboarding dismissal
    const hasSeenOnboarding = localStorage.getItem('psp_onboarding_seen');
    const isFirstVisit = !hasSeenOnboarding;

    if (isFirstVisit) {
      // Small delay for better UX - ensures page is loaded first
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('psp_onboarding_seen', 'true');
    }, 300); // Duration of fade-out animation
  };

  const handleGetStarted = () => {
    // Scroll to the sport cards section
    const sportCardsSection = document.getElementById('sport-cards');
    if (sportCardsSection) {
      sportCardsSection.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${isAnimating ? 'animate-fadeIn' : ''} ${className}`}
      style={{
        animation: isAnimating ? 'fadeIn 0.5s ease-in-out forwards' : 'fadeOut 0.3s ease-in-out forwards',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        .psp-onboarding-banner {
          background: linear-gradient(135deg, #0a1628 0%, #0f2040 100%);
          border-bottom: 3px solid #f0a500;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .psp-onboarding-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .psp-onboarding-content {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .psp-onboarding-text h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #f0a500;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
        }

        .psp-onboarding-text p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          line-height: 1.5;
        }

        .psp-onboarding-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-shrink: 0;
        }

        .psp-onboarding-btn-primary {
          background: #f0a500;
          color: #0a1628;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .psp-onboarding-btn-primary:hover {
          background: #d48f00;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(240, 165, 0, 0.3);
        }

        .psp-onboarding-btn-primary:active {
          transform: translateY(0);
        }

        .psp-onboarding-btn-secondary {
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .psp-onboarding-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.7);
          color: white;
        }

        @media (max-width: 640px) {
          .psp-onboarding-content {
            padding: 16px;
          }

          .psp-onboarding-text h2 {
            font-size: 20px;
          }

          .psp-onboarding-text p {
            font-size: 13px;
          }

          .psp-onboarding-actions {
            width: 100%;
            flex-direction: column;
          }

          .psp-onboarding-btn-primary,
          .psp-onboarding-btn-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="psp-onboarding-banner">
        <div className="psp-onboarding-content">
          {/* Text content */}
          <div className="psp-onboarding-text">
            <h2>Welcome to PhillySportsPack</h2>
            <p>
              Explore 25 years of Philadelphia high school sports data. Track legendary players,
              championship dynasties, and the stories that shaped our community.
            </p>
          </div>

          {/* Action buttons */}
          <div className="psp-onboarding-actions">
            <button
              onClick={handleGetStarted}
              className="psp-onboarding-btn-primary"
              aria-label="Get started exploring sports data"
            >
              Get Started →
            </button>
            <button
              onClick={handleDismiss}
              className="psp-onboarding-btn-secondary"
              aria-label="Dismiss onboarding banner"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
