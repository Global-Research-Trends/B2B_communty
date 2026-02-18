'use client';

import React, { useState, useRef, useEffect } from 'react';
import { uploadData, getUrl, list } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import './profile.css';

// Icons as SVG components for cleaner code
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

interface ProfilePageProps {
  onBack: () => void;
  profileData: {
    displayName: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    emailVerified: boolean;
    jobTitle: string;
  };
  profileImageUrl?: string;
  onProfileImageChange?: (url: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, profileData, profileImageUrl, onProfileImageChange }) => {
  const [activeNav, setActiveNav] = useState('personal');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profileImageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile image from S3 on mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const { userId } = await getCurrentUser();
        const result = await list({ path: `profile-pictures/${userId}/` });
        if (result.items.length > 0) {
          // Get the most recent file
          const sorted = [...result.items].sort((a, b) => {
            const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
            const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
            return bTime - aTime;
          });
          const latestFile = sorted[0];
          const urlResult = await getUrl({ path: latestFile.path });
          setAvatarUrl(urlResult.url.toString());
        }
      } catch {
        // If no image exists, keep default
      }
    };
    if (!profileImageUrl) {
      void loadProfileImage();
    }
  }, [profileImageUrl]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const { userId } = await getCurrentUser();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const key = `profile-pictures/${userId}/avatar.${ext}`;

      await uploadData({
        path: key,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      const urlResult = await getUrl({ path: key });
      const newUrl = urlResult.url.toString();
      setAvatarUrl(newUrl);
      onProfileImageChange?.(newUrl);
    } catch (err) {
      console.error('Failed to upload profile image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const navItems = [
    { id: 'personal', label: 'Personal Information', icon: <UserIcon /> },
    { id: 'professional', label: 'Professional Details', icon: <BriefcaseIcon /> },
  ];

  return (
    <div className="profile-content-wrapper">
      {/* Back Button */}
      <button className="profile-back-btn" onClick={onBack} type="button">
        <BackArrowIcon />
        <span>Back to Dashboard</span>
      </button>

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-avatar">
          <img
            src={avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.displayName)}&size=200&background=4f46e5&color=fff`}
            alt={profileData.displayName}
          />
          <button
            className="avatar-edit-btn"
            onClick={handleAvatarClick}
            disabled={uploading}
            title="Change profile picture"
          >
            {uploading ? <span className="avatar-spinner" /> : <EditIcon />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="profile-header-info">
          <h2 className="profile-name">{profileData.fullName}</h2>
          <p className="profile-title">{profileData.jobTitle}</p>
          <div className="verified-badge">
            <CheckIcon />
            <span>{profileData.emailVerified ? 'Verified Member' : 'Verification Pending'}</span>
          </div>
        </div>
      </div>

      {/* Profile Nav Tabs */}
      <div className="profile-tabs">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`profile-tab ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="profile-main-content">
        {/* Profile Completion */}
        <section className="completion-section">
          <div className="completion-header">
            <h3>Profile Completion</h3>
            <span className="completion-percent">75%</span>
          </div>
          <p className="completion-subtext">
            Complete your profile to access trusted networking opportunities and qualified connections.
          </p>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '75%' }} />
          </div>
          <div className="next-step-card">
            <div className="next-step-content">
              <div className="star-icon"><StarIcon /></div>
              <div className="next-step-text">
                <span className="next-step-title">Next Step:</span>
                <span className="next-step-desc">Add company size to increase completion by 10%</span>
              </div>
            </div>
            <button className="complete-btn">Complete Profile</button>
          </div>
        </section>

        {activeNav === 'personal' && (
          <>
            {/* Personal Details */}
            <section className="details-section">
              <div className="section-header">
                <h3>Personal Details</h3>
                <button className="edit-btn">
                  <EditIcon />
                  <span>Edit</span>
                </button>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <p className="detail-value">{profileData.fullName}</p>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <div className="verified-value">
                    <p className="detail-value">{profileData.email}</p>
                    <span className="verified-tag">
                      <CheckIcon />
                      {profileData.emailVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <p className="detail-value">{profileData.phone}</p>
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <p className="detail-value">{profileData.location}</p>
                </div>
              </div>
            </section>

            {/* Email Preferences */}
            <section className="preferences-section">
              <div className="section-header">
                <div className="section-title-group">
                  <MailIcon />
                  <h3>Email Preferences</h3>
                </div>
                <ChevronRightIcon />
              </div>
              <p className="preferences-subtext">
                Manage the emails you receive and control your notification preferences.
              </p>
            </section>
          </>
        )}

        {activeNav === 'professional' && (
          <section className="details-section">
            <div className="section-header">
              <h3>Professional Information</h3>
              <button className="edit-btn">
                <EditIcon />
                <span>Edit</span>
              </button>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <label>Job Title</label>
                <p className="detail-value">{profileData.jobTitle}</p>
              </div>
              <div className="detail-item">
                <label>Industry</label>
                <p className="detail-value">Software & Technology</p>
              </div>
              <div className="detail-item">
                <label>Company Size</label>
                <div className="missing-value">
                  <p className="detail-value missing">Not provided</p>
                  <span className="missing-tag">Missing</span>
                </div>
              </div>
              <div className="detail-item">
                <label>Years of Experience</label>
                <p className="detail-value">8-10 Years</p>
              </div>
            </div>
            <div className="info-banner">
              <div className="info-icon"><InfoIcon /></div>
              <p>Complete your professional profile to access advanced networking features and industry insights.</p>
              <a href="#" className="update-link">Update now</a>
            </div>
          </section>
        )}
      </div>
      </div>
  );
};

export default ProfilePage;


