import React from 'react';

const initiatives = [
  {
    step: '01',
    icon: 'fa-rocket',
    tag: 'Incubation Studio',
    title: 'Startup Incubation & MVPs',
    description:
      'Transform classroom concepts into scalable businesses with co-working desks, legal structuring guidance, and institutional incubation backing.',
    perk: 'Pre-Seed Guidance',
  },
  {
    step: '02',
    icon: 'fa-chalkboard-teacher',
    tag: 'Mastery',
    title: 'CXO & Founder Masterclasses',
    description:
      'Actionable venture-building frameworks taught directly by successful startup founders, venture capitalists, and domain specialists.',
    perk: '100+ Live Hours',
  },
  {
    step: '03',
    icon: 'fa-laptop-code',
    tag: 'Build Sprints',
    title: '48H Hackathons & Sprints',
    description:
      'Multi-disciplinary build sessions bringing engineers, designers, and business strategists together to deploy viable software & hardware MVPs.',
    perk: '₹2L+ Sprint Grants',
  },
  {
    step: '04',
    icon: 'fa-user-tie',
    tag: '1-on-1 Office Hours',
    title: 'Executive Mentorship',
    description:
      'Personalized advisory sessions with industry leaders to refine unit economics, customer acquisition loops, and go-to-market roadmaps.',
    perk: 'Dedicated Advisors',
  },
  {
    step: '05',
    icon: 'fa-handshake',
    tag: 'Capital & Demo Days',
    title: 'Investor Pitch Showcases',
    description:
      'High-stakes pitch events connecting promising student startups directly to active angel syndicates, micro-VCs, and government grants.',
    perk: 'Direct Angel Access',
  },
  {
    step: '06',
    icon: 'fa-globe-americas',
    tag: 'Global Exposure',
    title: 'National Startup Delegations',
    description:
      'Sponsored student delegations to premier national entrepreneurship conclaves, global hackathons, and youth leadership summits.',
    perk: 'Pan-India Summits',
  },
];

export default function InitiativeSection() {
  return (
    <section id="initiatives" className="initiatives section">
      <div className="container">
        <div className="section-header">
          <div className="section-pre-tag">
            <i className="fas fa-layer-group"></i>
            <span>VENTURE PILLARS</span>
          </div>
          <h2>Our Flagship Initiatives</h2>
          <p>Structured programs engineered to accelerate student founders from ideation to scale</p>
        </div>

        <div className="initiatives-grid">
          {initiatives.map((item, index) => (
            <div key={index} className="initiative-card">
              <div className="initiative-card-top">
                <div className="initiative-icon-box">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="initiative-meta-badge">
                  <span className="initiative-step">{item.step}</span>
                  <span className="initiative-tag">{item.tag}</span>
                </div>
              </div>

              <div className="initiative-card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="initiative-card-footer">
                <span className="initiative-perk">
                  <i className="fas fa-check"></i> {item.perk}
                </span>
                <span className="initiative-action-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
