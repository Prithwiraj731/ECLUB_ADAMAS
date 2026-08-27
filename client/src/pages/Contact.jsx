import React, { useState } from 'react';
import ContactSection from '../components/ContactSection';

const faqs = [
  {
    question: 'Who can join the Adamas University Entrepreneurship Club?',
    answer:
      'Any registered student of Adamas University across engineering, management, sciences, law, humanities, or biotechnology is eligible to join E-Club. No prior business experience is required!',
  },
  {
    question: 'How do I pitch my startup idea to get incubation support?',
    answer:
      'You can submit your idea through our contact form or during our bi-weekly Founder Pitch Office Hours. Our incubation wing will schedule a 1-on-1 review session to help refine your business canvas.',
  },
  {
    question: 'Are there registration fees to participate in E-Club workshops?',
    answer:
      'Most of our internal workshops, speaker webinars, and networking events are completely free for Adamas University students. Select national hackathons and certified bootcamps may have subsidized partner fees.',
  },
  {
    question: 'Can E-Club help me find technical co-founders or team members?',
    answer:
      'Yes! We host dedicated Co-Founder Matchmaking Mixers at the start of each academic semester to help visionaries connect with software developers, designers, and marketers.',
  },
  {
    question: 'How can external startup founders or corporate sponsors partner with E-Club?',
    answer:
      'We welcome corporate sponsors, angel syndicates, and guest speakers! Please drop us an email at adamaseclub@gmail.com with your proposal or sponsorship deck.',
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Connect With Us</h1>
          <p>Have inquiries, ideas, or partnership opportunities? Our team is always eager to help.</p>
        </div>
      </section>

      {/* Main Contact Section Component */}
      <ContactSection />

      {/* Frequently Asked Questions */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about joining, pitching, and collaborating with E-Club</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    background: 'var(--off-white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--light-grey)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      color: isOpen ? 'var(--secondary-color)' : 'var(--text-dark)',
                    }}
                  >
                    <span>{faq.question}</span>
                    <i
                      className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
                      style={{ color: 'var(--primary-color)', marginLeft: '10px' }}
                    ></i>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.5rem 1.5rem',
                        color: 'var(--text-light)',
                        lineHeight: '1.6',
                        fontSize: '0.95rem',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Map & Directions */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Visit Our Innovation Center</h2>
            <p>Located at Adamas Knowledge City, Kolkata</p>
          </div>

          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>
                <i className="fas fa-university" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                Adamas Knowledge City
              </h3>
              <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
                <strong>Address:</strong> Adamas Knowledge City, Barasat - Barrackpore Road, 24 Parganas North,
                Kolkata - 700126, West Bengal, India.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <p style={{ margin: 0 }}>
                  <i className="fas fa-subway" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                  Nearest Metro / Rail: Barasat Railway Station (15 mins)
                </p>
                <p style={{ margin: 0 }}>
                  <i className="fas fa-plane" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                  Nearest Airport: Netaji Subhash Chandra Bose Intl Airport, CCU (30 mins)
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Adamas+University+Barasat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="fas fa-directions" style={{ marginRight: '8px' }}></i> Open in Google Maps
              </a>
            </div>

            <div
              style={{
                height: '300px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--light-grey)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--light-grey)',
              }}
            >
              <iframe
                title="Adamas University Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.593437142721!2d88.48783457591632!3d22.743343326685514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8996e39bf099d%3A0xc39f860f065367b6!2sAdamas%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
