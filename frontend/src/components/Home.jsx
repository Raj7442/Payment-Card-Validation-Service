export default function Home({ onNavigate }) {
  return (
    <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
      <h1 style={{ 
        fontSize: '2.8rem',
        color: '#fff',
        textShadow: '0 4px 30px rgba(0,0,0,0.3)',
        background: 'none',
        WebkitBackgroundClip: 'unset',
        WebkitTextFillColor: '#fff',
        marginBottom: '2.5rem',
        letterSpacing: '-1px'
      }}>
        Payment Card Validation Service
      </h1>
      <p style={{ 
        color: 'rgba(255,255,255,0.9)', 
        fontSize: '1.1rem', 
        marginBottom: '2.5rem',
        lineHeight: '1.6'
      }}>
        Validate credit card numbers instantly with our secure, fast, and reliable service.
      </p>
      <button className="btn" onClick={() => onNavigate('validator')} style={{
        fontSize: '1.1rem',
        padding: '1rem 3rem'
      }}>
        Get Started →
      </button>
      <p style={{ 
        marginTop: '3rem', 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: '0.95rem' 
      }}>
        Developed by Rounak Raj
      </p>
    </div>
  )
}
