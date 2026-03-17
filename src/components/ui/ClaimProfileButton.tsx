'use client';

import React, { useState } from 'react';
import Button from './Button';

interface ClaimProfileButtonProps {
  playerId: number;
  playerName: string;
  schoolName?: string;
}

interface ClaimFormData {
  relationship: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  parentName?: string;
  parentEmail?: string;
  height?: string;
  weight?: string;
  jersey?: string;
  position?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  hudlUrl?: string;
  on3Url?: string;
  two47Url?: string;
  rivalsUrl?: string;
  recruitingStatus?: string;
  interestedColleges?: string;
  recruitingNotes?: string;
  consentFilm: boolean;
  consentContact: boolean;
  consentAcademic: boolean;
  consentEmail: boolean;
}

const steps = [
  { id: 1, title: 'Identity', icon: '👤' },
  { id: 2, title: 'Contact', icon: '📞' },
  { id: 3, title: 'Measurables', icon: '📏' },
  { id: 4, title: 'Film & Social', icon: '🎬' },
  { id: 5, title: 'Recruiting', icon: '🎓' },
  { id: 6, title: 'Consent', icon: '✅' },
];

const ClaimProfileButton: React.FC<ClaimProfileButtonProps> = ({
  playerId,
  playerName,
  schoolName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ClaimFormData>({
    relationship: 'self',
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    parentName: '',
    parentEmail: '',
    height: '',
    weight: '',
    jersey: '',
    position: '',
    twitterHandle: '',
    instagramHandle: '',
    hudlUrl: '',
    on3Url: '',
    two47Url: '',
    rivalsUrl: '',
    recruitingStatus: 'uncommitted',
    interestedColleges: '',
    recruitingNotes: '',
    consentFilm: false,
    consentContact: false,
    consentAcademic: false,
    consentEmail: false,
  });

  const handleFormChange = (field: keyof ClaimFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.consentContact) {
      setError('You must consent to contact before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: playerId,
          relationship: formData.relationship,
          claimant_name: formData.claimantName,
          claimant_email: formData.claimantEmail,
          claimant_phone: formData.claimantPhone,
          parent_name: formData.parentName || null,
          parent_email: formData.parentEmail || null,
          measurables: {
            height: formData.height,
            weight: formData.weight,
            jersey: formData.jersey,
            position: formData.position,
          },
          social_links: {
            twitter: formData.twitterHandle,
            instagram: formData.instagramHandle,
            hudl: formData.hudlUrl,
            on3: formData.on3Url,
            two47: formData.two47Url,
            rivals: formData.rivalsUrl,
          },
          recruiting_status: formData.recruitingStatus,
          recruiting_prefs: {
            interested_colleges: formData.interestedColleges,
            notes: formData.recruitingNotes,
          },
          consent_film: formData.consentFilm,
          consent_contact: formData.consentContact,
          consent_academic: formData.consentAcademic,
          consent_email: formData.consentEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit claim');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setCurrentStep(1);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.relationship && formData.claimantName;
      case 2:
        return formData.claimantEmail && formData.claimantPhone;
      case 3:
        return true; // Measurables are optional
      case 4:
        return true; // Film & Social are optional
      case 5:
        return true; // Recruiting info is optional
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Identity
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Are you claiming this profile for:
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => handleFormChange('relationship', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              >
                <option value="self">Myself (the player)</option>
                <option value="parent">Parent/Guardian</option>
                <option value="coach">Coach/Trainer</option>
                <option value="family">Family Member</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Full Name (Claimant)
              </label>
              <input
                type="text"
                value={formData.claimantName}
                onChange={(e) => handleFormChange('claimantName', e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>

            {formData.relationship !== 'self' && (
              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Player's Name (for verification)
                </label>
                <input
                  type="text"
                  value={playerName}
                  disabled
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg bg-[var(--psp-gray-50)] text-[var(--psp-navy)]"
                />
              </div>
            )}
          </div>
        );

      case 2: // Contact
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.claimantEmail}
                onChange={(e) => handleFormChange('claimantEmail', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.claimantPhone}
                onChange={(e) => handleFormChange('claimantPhone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>

            {formData.relationship === 'parent' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName || ''}
                    onChange={(e) => handleFormChange('parentName', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                    Parent/Guardian Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail || ''}
                    onChange={(e) => handleFormChange('parentEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 3: // Measurables
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Height
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleFormChange('height', e.target.value)}
                  placeholder="e.g., 6'2"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleFormChange('weight', e.target.value)}
                  placeholder="185"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Jersey #
                </label>
                <input
                  type="text"
                  value={formData.jersey}
                  onChange={(e) => handleFormChange('jersey', e.target.value)}
                  placeholder="23"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleFormChange('position', e.target.value)}
                  placeholder="WR"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Film & Social
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Hudl Profile URL
              </label>
              <input
                type="url"
                value={formData.hudlUrl}
                onChange={(e) => handleFormChange('hudlUrl', e.target.value)}
                placeholder="https://hudl.com/..."
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => handleFormChange('twitterHandle', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => handleFormChange('instagramHandle', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  On3 Profile
                </label>
                <input
                  type="url"
                  value={formData.on3Url}
                  onChange={(e) => handleFormChange('on3Url', e.target.value)}
                  placeholder="https://on3.com/..."
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                  247Sports Profile
                </label>
                <input
                  type="url"
                  value={formData.two47Url}
                  onChange={(e) => handleFormChange('two47Url', e.target.value)}
                  placeholder="https://247sports.com/..."
                  className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
                />
              </div>
            </div>
          </div>
        );

      case 5: // Recruiting
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Recruiting Status
              </label>
              <select
                value={formData.recruitingStatus}
                onChange={(e) => handleFormChange('recruitingStatus', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              >
                <option value="uncommitted">Uncommitted</option>
                <option value="committed">Committed</option>
                <option value="committed-verbal">Committed (Verbal)</option>
                <option value="transferred">Transferred</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Interested Colleges (comma-separated)
              </label>
              <input
                type="text"
                value={formData.interestedColleges}
                onChange={(e) => handleFormChange('interestedColleges', e.target.value)}
                placeholder="Penn, Temple, Villanova"
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--psp-navy)] mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.recruitingNotes}
                onChange={(e) => handleFormChange('recruitingNotes', e.target.value)}
                placeholder="Any additional recruiting information..."
                rows={4}
                className="w-full px-3 py-2 border border-[var(--psp-gray-300)] rounded-lg text-[var(--psp-navy)]"
              />
            </div>
          </div>
        );

      case 6: // Consent
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--psp-gray-600)] mb-4">
              Please review and agree to the following before submitting your claim:
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentContact}
                  onChange={(e) => handleFormChange('consentContact', e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm text-[var(--psp-navy)]">
                  I consent to being contacted about this claim and agree to verify my identity
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentFilm}
                  onChange={(e) => handleFormChange('consentFilm', e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm text-[var(--psp-navy)]">
                  I consent to game film and highlights being shared with recruiting services
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentEmail}
                  onChange={(e) => handleFormChange('consentEmail', e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm text-[var(--psp-navy)]">
                  I consent to receiving recruiting updates and news via email
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentAcademic}
                  onChange={(e) => handleFormChange('consentAcademic', e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm text-[var(--psp-navy)]">
                  I certify that the information provided is accurate and complete
                </span>
              </label>
            </div>

            <div className="p-3 bg-[var(--psp-gold-light)] rounded-lg text-sm text-[var(--psp-navy)]">
              <strong>Note:</strong> Your claim will be verified within 3-5 business days. Please ensure all contact information is correct.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-[var(--psp-navy)] mb-2">Claim Submitted!</h3>
          <p className="text-[var(--psp-gray-600)] text-sm">
            We'll verify your claim within 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 items-center"
      >
        <span>👤</span>
        Is this your profile?
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--psp-navy)] text-white p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Claim Your Profile</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--psp-gray-300)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--psp-gold)] h-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps Navigation */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex gap-1 justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                        step.id <= currentStep
                          ? 'bg-[var(--psp-gold)] text-[var(--psp-navy)]'
                          : 'bg-[var(--psp-gray-200)] text-[var(--psp-gray-500)]'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-xs text-[var(--psp-gray-600)] text-center">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-[var(--psp-navy)] mb-4">
                {steps[currentStep - 1].title}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {renderStep()}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-between gap-3 bg-[var(--psp-gray-50)]">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.consentContact}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ClaimProfileButton);
