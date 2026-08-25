import React from 'react';
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
    title: 'Mentorship & Venture Advisory',
    description: 'Dedicated 1-on-1 office hours with industry leaders, founders, and subject matter specialists.'
  },
  {
    title: 'Workshops & Certifications',
    description: 'Accredited workshops spanning product strategy, financial modeling, marketing psychology, and fundraising.'
  },
  {
    title: 'E-Summit & Hackathons',
    description: 'Annual flagship conclaves gathering over 2,000+ delegates, 50+ startup stalls, and prominent angel syndicates.'
  },
  {
    title: 'Co-Working & Prototyping Lab',
    description: 'Access to high-speed workstations, 3D printing equipment, meeting pods, and cloud server credits.'
  }
];

const team = [
  {
    name: 'Dr. S. K. Mukherjee',
    role: 'Faculty Mentor & Chief Advisor',
    department: 'School of Business & Economics',
    icon: 'fa-user-tie'
  },
  {
    name: 'Arindam Ghosh',
    role: 'Club President',
    department: 'Computer Science & Engineering',
    icon: 'fa-crown'
  },
  {
    name: 'Shreya Sengupta',
    role: 'Vice President & Head of Incubation',
    department: 'Department of Management',
    icon: 'fa-briefcase'
  },
  {
    name: 'Rohan Sharma',
    role: 'Lead - Tech & Innovation Wing',
    department: 'Information Technology',
    icon: 'fa-code'
  },
  {
    name: 'Priyanka Das',
    role: 'Lead - Marketing & Public Relations',
    department: 'Media & Mass Communication',
    icon: 'fa-bullhorn'
  },
  {
    name: 'Sourav Roy',
    role: 'Lead - Corporate & Investor Relations',
    department: 'Finance & Commerce',
    icon: 'fa-handshake'
  }
];

export default function About() {
  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>About Our Club</h1>
          <p>Empowering Adamas University students to pioneer sustainable ventures and lead global innovation.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Mission & Vision</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontSize: '1.4rem' }}>
                  <i className="fas fa-bullseye" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                  Our Mission
                </h3>
                <p>
                  To cultivate a dynamic entrepreneurial ecosystem within Adamas University by empowering students with
                  practical tools, expert mentorship, seed capital pipelines, and an interdisciplinary collaborative
                  community.
                </p>
              </div>

              <div>
                <h3 style={{ color: 'var(--secondary-color)', fontSize: '1.4rem' }}>
                  <i className="fas fa-eye" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                  Our Vision
                </h3>
                <p>
                  To become Eastern India's leading university venture incubator, producing high-growth startups,
                  socio-economic innovations, and ethical business leaders that shape the future of industry.
                </p>
              </div>
            </div>

            <div className="about-image">
              <img src="/assets/hero/hero3.png" alt="Adamas University Innovation Center" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
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
          <div className="section-header">
            <h2>What We Offer Members</h2>
            <p>Tangible resources and acceleration benefits for every student who joins our club</p>
          </div>

          <div className="initiatives-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {offerings.map((offer, i) => (
              <div key={i} style={{ background: 'var(--white)', padding: '1.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ color: 'var(--secondary-color)', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-check-circle" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                  {offer.title}
                </h4>
                <p style={{ marginTop: '0.75rem', lineHeight: '1.6', fontSize: '0.9rem' }}>{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Core Committee */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Leadership & Core Team</h2>
            <p>Meet the visionary mentors and student leaders driving E-Club operations</p>
          </div>

          <div className="initiatives-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {team.map((member, i) => (
              <div key={i} className="highlight-item" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                <div className="highlight-icon" style={{ width: '64px', height: '64px', fontSize: '1.5rem', marginBottom: '1rem', borderRadius: '16px' }}>
                  <i className={`fas ${member.icon}`}></i>
                </div>
                <div className="highlight-text">
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>{member.name}</h4>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '700', marginBottom: '0.35rem', fontSize: '0.88rem' }}>{member.role}</p>
                  <p style={{ fontSize: '0.82rem' }}>{member.department}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/contact" className="btn btn-primary">
              <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i> Join Our Core Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
