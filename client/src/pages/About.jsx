import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const objectives = [
  {
    icon: 'fa-brain',
    title: 'Cultivate Entrepreneurial Mindset',
    description: 'Instill calculated risk-taking, resilience, problem-solving agility, and leadership across all student disciplines.'
  },
  {
    icon: 'fa-hands-helping',
    title: 'Incubation & Seed Support',
    description: 'Provide end-to-end support including legal mentorship, business model canvas drafting, and seed grant access.'
  },
  {
    icon: 'fa-network-wired',
    title: 'Industry & Alumni Bridges',
    description: 'Connect students with seasoned Adamas alumni founders, venture capitalists, and Kolkata startup ecosystem accelerators.'
  },
  {
    icon: 'fa-laptop-code',
    title: 'Technical & Design Bootcamps',
    description: 'Equip students with cutting-edge tech skills (AI, Web3, full-stack prototyping, UI/UX) required to build modern software products.'
  },
  {
    icon: 'fa-bullhorn',
    title: 'Venture Pitch Showcases',
    description: 'Host university-wide pitch battles where student teams receive constructive feedback and direct investment offers.'
  },
  {
    icon: 'fa-globe-americas',
    title: 'Global Ecosystem Exposure',
    description: 'Sponsor participation in premier national summits, international hackathons, and global youth leadership forums.'
  }
];

const offerings = [
  {
    icon: 'fa-chalkboard-teacher',
    title: 'Mentorship & Venture Advisory',
    description: 'Dedicated 1-on-1 office hours with industry leaders, founders, and subject matter specialists.'
  },
  {
    icon: 'fa-certificate',
    title: 'Workshops & Certifications',
    description: 'Accredited workshops spanning product strategy, financial modeling, marketing psychology, and fundraising.'
  },
  {
    icon: 'fa-rocket',
    title: 'E-Summit & Hackathons',
    description: 'Annual flagship conclaves gathering over 2,000+ delegates, 50+ startup stalls, and prominent angel syndicates.'
  },
  {
    icon: 'fa-laptop-house',
    title: 'Co-Working & Prototyping Lab',
    description: 'Access to high-speed workstations, 3D printing equipment, meeting pods, and cloud server credits.'
  }
];

const coreTeam = [
  {
    name: 'Soodipa Chakraborty',
    role: 'Founder & Mentor',
    photo: '/assets/photos/Soodipa.jpg',
    badge: 'Faculty Mentor',
    objectPosition: 'center 15%'
  },
  {
    name: 'Preyashee Saha',
    role: 'Student Coordinator',
    photo: '/assets/photos/Preyashee.jpeg',
    badge: 'Core Leadership',
    objectPosition: 'center 18%'
  },
  {
    name: 'Sayani Saha',
    role: 'Student Coordinator',
    photo: '/assets/photos/Sayani.jpeg',
    badge: 'Core Leadership',
    objectPosition: 'center 20%'
  },
  {
    name: 'Ratnadipa Saha',
    role: 'Lead – Reports & Documentation',
    photo: '/assets/photos/Ratnadipa.jpeg',
    badge: 'Documentation Lead',
    objectPosition: 'center 25%'
  },
  {
    name: 'Utsav Saha',
    role: 'Lead – Social Media & Promotions',
    photo: '/assets/photos/Utsav.jpeg',
    badge: 'Media & Branding Lead',
    objectPosition: 'center 15%'
  },
  {
    name: 'Md Samiul Islam',
    role: 'Lead – PR & Communications',
    photo: '/assets/photos/Samiul.jpeg',
    badge: 'PR & Outreach Lead',
    objectPosition: 'center 15%'
  },
  {
    name: 'Sourish Banerjee',
    role: 'Lead – Social Media & Promotions',
    photo: '/assets/photos/Sourish.jpeg',
    badge: 'Media & Branding Lead',
    objectPosition: 'center 15%'
  },
  {
    name: 'Aleena Hossain',
    role: 'Lead – PR & Communications',
    photo: '/assets/photos/Aleena.jpeg',
    badge: 'PR & Outreach Lead',
    objectPosition: 'center 12%'
  },
  {
    name: 'Prithwiraj Mazumdar',
    role: 'Lead – Technical Operations',
    photo: '/assets/photos/Prithwiraj.jpeg',
    badge: 'Tech & Ops Lead',
    objectPosition: 'center 32%'
  }
];

const timelineBento2025 = [
  {
    id: 1,
    title: 'Annual E-Club Mega Conclave',
    subtitle: 'Over 200+ students and aspiring founders gathered at the Adamas Grand Auditorium',
    tag: 'Flagship Conclave',
    date: '2025–26 Session',
    photo: '/assets/photos/Main-Team.jpeg',
    gridClass: 'bento-span-2x2',
    icon: 'fa-users'
  },
  {
    id: 2,
    title: 'Executive Committee Launch',
    subtitle: 'Core leaders inaugurated outside the Adamas University main building',
    tag: 'Leadership',
    date: 'August 2025',
    photo: '/assets/photos/t1.jpeg',
    gridClass: 'bento-span-1x1',
    icon: 'fa-university'
  },
  {
    id: 3,
    title: 'Founder & Mentor Keynote Address',
    subtitle: 'Soodipa Chakraborty sharing the vision for student incubations',
    tag: 'Keynote Session',
    date: 'October 2025',
    photo: '/assets/photos/t5.jpeg',
    gridClass: 'bento-span-1x1',
    icon: 'fa-microphone'
  },
  {
    id: 4,
    title: 'Virtual Founder Masterclass',
    subtitle: 'Interactive live session with industry disruptors streamed to the auditorium',
    tag: 'Masterclass',
    date: 'November 2025',
    photo: '/assets/photos/t3.jpeg',
    gridClass: 'bento-span-1x1',
    icon: 'fa-chalkboard-teacher'
  },
  {
    id: 5,
    title: 'Audience Interaction & Pitch Battles',
    subtitle: 'Students engaging in active Q&A, venture debate, and ideas evaluation',
    tag: 'Idea Pitch',
    date: 'December 2025',
    photo: '/assets/photos/t6.jpeg',
    gridClass: 'bento-span-1x1',
    icon: 'fa-comments'
  },
  {
    id: 6,
    title: 'Packed Full House Attendance',
    subtitle: 'Adamas University students showing massive enthusiasm for startup building',
    tag: 'Campus Pulse',
    date: 'January 2026',
    photo: '/assets/photos/t7.jpeg',
    gridClass: 'bento-span-2x1',
    icon: 'fa-fire'
  },
  {
    id: 7,
    title: 'E-Club Student Coordinators Squad',
    subtitle: 'Passionate student team driving daily operations, logistics & tech',
    tag: 'Core Squad',
    date: '2025–26 Era',
    photo: '/assets/photos/team.jpeg',
    gridClass: 'bento-span-1x1',
    icon: 'fa-shield-alt'
  }
];

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState('2025-26');

  return (
    <div className="about-page-root">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-badge">
            <i className="fas fa-compass"></i>
            <span>ADAMAS UNIVERSITY ENTREPRENEURSHIP CLUB</span>
          </div>
          <h1>ABOUT OUR CLUB</h1>
          <p>
            Empowering Adamas University students to transform bold ideas into scalable ventures, sustainable businesses, and world-class innovations.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section about-mv-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <span className="section-eyebrow">
                <i className="fas fa-star" style={{ color: 'var(--primary-color)' }}></i> FOUNDATIONAL PILLARS
              </span>
              <h2>Our Mission &amp; Vision</h2>
              
              <div className="mv-card-item">
                <div className="mv-icon-box">
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="mv-text-box">
                  <h3>Our Mission</h3>
                  <p>
                    To cultivate a dynamic, high-impact entrepreneurial ecosystem within Adamas University by empowering students with practical venture-building tools, industry mentorship, seed capital access, and an interdisciplinary collaborative community.
                  </p>
                </div>
              </div>

              <div className="mv-card-item">
                <div className="mv-icon-box">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="mv-text-box">
                  <h3>Our Vision</h3>
                  <p>
                    To become Eastern India's leading university venture incubator, producing high-growth student startups, pioneering technological breakthroughs, and ethical business leaders that shape the future of global industry.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-mv-image-wrapper">
              <div className="about-mv-card">
                <img
                  src="/assets/photos/Main-Team.jpeg"
                  alt="Adamas Entrepreneurship Club Full Delegation and Mentors"
                  className="about-mv-photo"
                />
                <div className="about-mv-overlay-badge">
                  <i className="fas fa-award"></i>
                  <div>
                    <strong>Adamas E-Club Grand Assembly</strong>
                    <span>Auditorium Session • 2025–26</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2025-26 Timeline & Bento Gallery Section */}
      <section className="section timeline-bento-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">
              <i className="fas fa-history" style={{ color: 'var(--primary-color)' }}></i> ARCHIVES &amp; MILESTONES
            </span>
            <h2>Moments &amp; Timeline Chronicles</h2>
            <p>
              A visual journey through key workshops, auditoriums, summits, and milestones crafted by the E-Club community.
            </p>

            {/* Timeline Year Tabs */}
            <div className="timeline-tabs-wrapper">
              <button
                type="button"
                className={`timeline-tab-btn ${activeTimeline === '2025-26' ? 'active' : ''}`}
                onClick={() => setActiveTimeline('2025-26')}
              >
                <i className="fas fa-calendar-check"></i>
                <span>Timeline 2025 – 2026</span>
                <span className="timeline-tab-pill">Active Era</span>
              </button>

              <button
                type="button"
                className="timeline-tab-btn disabled-upcoming"
                title="Timeline for 2026-27 will be updated soon"
              >
                <i className="fas fa-hourglass-half"></i>
                <span>Timeline 2026 – 2027</span>
                <span className="timeline-tab-pill upcoming">Upcoming</span>
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="timeline-bento-grid">
            {timelineBento2025.map((item) => (
              <div key={item.id} className={`bento-card ${item.gridClass}`}>
                <div className="bento-media-container">
                  <img src={item.photo} alt={item.title} className="bento-img" loading="lazy" />
                  <div className="bento-hover-caption">
                    <span className="bento-caption-title">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Core Team Section */}
      <section className="section core-team-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">
              <i className="fas fa-crown" style={{ color: 'var(--primary-color)' }}></i> EXECUTIVE COMMITTEE
            </span>
            <h2>Leadership &amp; Core Team</h2>
            <p>
              Meet the passionate mentors and student leaders steering the Entrepreneurship Club at Adamas University.
            </p>
          </div>

          <div className="team-bento-grid">
            {coreTeam.map((member, index) => (
              <div key={index} className="team-member-card">
                <div className="team-avatar-wrapper">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="team-avatar-img"
                    style={{ objectPosition: member.objectPosition || 'center 20%' }}
                    loading="lazy"
                  />
                </div>

                <div className="team-card-body">
                  <h3 className="team-member-name">{member.name}</h3>
                  <p className="team-member-role">{member.role}</p>
                  <div className="team-adamas-tag">
                    <i className="fas fa-university"></i>
                    <span>Adamas University</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="team-join-cta-box">
            <div className="join-cta-content">
              <h3>Want to make an impact with our core team?</h3>
              <p>We are always eager to welcome driven students passionate about innovation, organizing, and tech operations.</p>
            </div>
            <Link to="/contact" className="btn btn-primary btn-join-team">
              <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Connect With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">
              <i className="fas fa-cogs" style={{ color: 'var(--primary-color)' }}></i> STRATEGIC GOALS
            </span>
            <h2>Our Core Objectives</h2>
            <p>Our strategic pillars guiding every initiative, hackathon, and mentorship session</p>
          </div>

          <div className="initiatives-grid">
            {objectives.map((obj, i) => (
              <div key={i} className="initiative-card">
                <div className="initiative-icon">
                  <i className={`fas ${obj.icon}`}></i>
                </div>
                <div className="initiative-content">
                  <h3>{obj.title}</h3>
                  <p>{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">
              <i className="fas fa-gift" style={{ color: 'var(--primary-color)' }}></i> MEMBER PRIVILEGES
            </span>
            <h2>What We Offer Members</h2>
            <p>Tangible resources and acceleration benefits for every student who joins our club</p>
          </div>

          <div className="initiatives-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {offerings.map((offer, i) => (
              <div key={i} className="offering-card">
                <div className="offering-icon">
                  <i className={`fas ${offer.icon}`}></i>
                </div>
                <div className="offering-info">
                  <h4>{offer.title}</h4>
                  <p>{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

