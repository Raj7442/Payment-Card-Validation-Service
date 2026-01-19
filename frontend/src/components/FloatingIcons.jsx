export default function FloatingIcons() {
  const icons = ['💳', '💳', '💳', '💳', '💳', '💳']
  const positions = [
    { top: '10%', left: '10%', delay: '0s' },
    { top: '20%', right: '15%', delay: '2s' },
    { bottom: '15%', left: '20%', delay: '4s' },
    { bottom: '25%', right: '10%', delay: '6s' },
    { top: '50%', left: '5%', delay: '8s' },
    { top: '60%', right: '8%', delay: '10s' }
  ]

  return (
    <div className="floating-icons">
      {icons.map((icon, i) => (
        <div
          key={i}
          className="floating-icon"
          style={{
            ...positions[i],
            animationDelay: positions[i].delay
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  )
}
