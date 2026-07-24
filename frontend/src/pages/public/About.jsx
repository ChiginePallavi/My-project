import '../../styles/Home.css'

function About() {
  return (
    <main className="page home-page">
      <section className="hero-section">
        <div className="hero-section__content">
          <p className="hero-section__eyebrow">About Placement Intelligence</p>
          <h2>Streamlining campus recruitment and student readiness tracking</h2>
          <p>
            Placement Eligibility Predictor is a modern Full-Stack MERN application designed to empower students and campus placement officers. 
            It features JWT-authenticated security, role-based access control (RBAC) for Admins and Students, real-time search & filtering, and persistent MongoDB Atlas data storage.
          </p>
        </div>
      </section>
    </main>
  )
}

export default About
