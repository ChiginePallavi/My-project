import { useEffect, useState } from 'react'
import '../styles/Register.css'

const initialForm = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  gender: '',
  dob: '',
  college: '',
  branch: '',
  graduationYear: '',
  skills: '',
  resume: '',
  terms: false,
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const mobilePattern = /^\d{10}$/

function Register() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [submittedData, setSubmittedData] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [emailAvailability, setEmailAvailability] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!form.password) {
      setPasswordStrength('')
      return
    }

    const lengthScore = Math.min(form.password.length / 8, 1)
    const varietyScore = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].reduce(
      (score, test) => score + (test.test(form.password) ? 1 : 0),
      0,
    )
    const totalScore = lengthScore * 0.4 + (varietyScore / 4) * 0.6

    if (totalScore > 0.85) {
      setPasswordStrength('Strong')
    } else if (totalScore > 0.6) {
      setPasswordStrength('Moderate')
    } else {
      setPasswordStrength('Weak')
    }
  }, [form.password])

  const validateForm = () => {
    const validationErrors = {}

    if (!form.fullName.trim()) validationErrors.fullName = 'Full Name is required.'
    if (!form.email.trim()) {
      validationErrors.email = 'Email Address is required.'
    } else if (!emailPattern.test(form.email)) {
      validationErrors.email = 'Enter a valid email address.'
    }
    if (!form.mobile.trim()) {
      validationErrors.mobile = 'Mobile Number is required.'
    } else if (!mobilePattern.test(form.mobile)) {
      validationErrors.mobile = 'Mobile number must be exactly 10 digits.'
    }
    if (!form.password) {
      validationErrors.password = 'Password is required.'
    } else if (!passwordPattern.test(form.password)) {
      validationErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    }
    if (!form.confirmPassword) {
      validationErrors.confirmPassword = 'Confirm Password is required.'
    } else if (form.confirmPassword !== form.password) {
      validationErrors.confirmPassword = 'Passwords do not match.'
    }
    if (!form.terms) validationErrors.terms = 'You must accept the terms and conditions.'

    return validationErrors
  }

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target
    const fieldValue =
      type === 'checkbox' ? checked : type === 'file' ? files[0]?.name || '' : value

    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    if (name === 'email') {
      setEmailAvailability('')
    }
  }

  const checkEmailAvailability = () => {
    if (!form.email || !emailPattern.test(form.email)) {
      setEmailAvailability('Enter a valid email to check availability.')
      return
    }

    const isTaken = form.email.toLowerCase().includes('taken') || form.email.toLowerCase().includes('test')
    setEmailAvailability(isTaken ? 'Email already taken (dummy check)' : 'Email appears available')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      setSuccess('')
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setTimeout(() => {
      setSuccess('Registration successful! Your information has been submitted.')
      setSubmittedData(form)
      setForm(initialForm)
      setEmailAvailability('')
      setPasswordStrength('')
      setIsSubmitting(false)
    }, 500)
  }

  const handleReset = () => {
    setForm(initialForm)
    setErrors({})
    setSuccess('')
    setSubmittedData(null)
    setEmailAvailability('')
    setPasswordStrength('')
  }

  return (
    <main className="page register-page">
      <section className="register-card">
        <div className="register-card__header">
          <div>
            <p className="eyebrow">Registration Module</p>
            <h2>Complete your student registration</h2>
            <p>Use controlled components, validation, and event handling to submit your profile.</p>
          </div>
          <div className="register-status">
            {success && <span className="badge success">Success</span>}
            {isSubmitting && <span className="badge loading">Submitting...</span>}
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field">
              <span>Full Name *</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="field-error">{errors.fullName}</p>}
            </label>

            <label className="form-field">
              <span>Email Address *</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={checkEmailAvailability}
                type="email"
                placeholder="student@example.com"
              />
              {emailAvailability && <p className="field-hint">{emailAvailability}</p>}
              {errors.email && <p className="field-error">{errors.email}</p>}
            </label>

            <label className="form-field">
              <span>Mobile Number *</span>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                type="tel"
                placeholder="1234567890"
                maxLength={10}
              />
              {errors.mobile && <p className="field-error">{errors.mobile}</p>}
            </label>

            <label className="form-field">
              <span>Password *</span>
              <div className="password-row">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                />
                <button
                  className="toggle-password"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordStrength && <p className={`field-hint strength ${passwordStrength.toLowerCase()}`}>Strength: {passwordStrength}</p>}
              {errors.password && <p className="field-error">{errors.password}</p>}
            </label>

            <label className="form-field">
              <span>Confirm Password *</span>
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
            </label>

            <label className="form-field">
              <span>Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="preferNot">Prefer not to say</option>
              </select>
            </label>

            <label className="form-field">
              <span>Date of Birth</span>
              <input name="dob" value={form.dob} onChange={handleChange} type="date" />
            </label>

            <label className="form-field">
              <span>College Name</span>
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                type="text"
                placeholder="Enter college name"
              />
            </label>

            <label className="form-field">
              <span>Branch</span>
              <input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                type="text"
                placeholder="Enter your branch"
              />
            </label>

            <label className="form-field">
              <span>Graduation Year</span>
              <select name="graduationYear" value={form.graduationYear} onChange={handleChange}>
                <option value="">Select year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </label>

            <label className="form-field full-width">
              <span>Skills</span>
              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="List your key skills separated by commas"
                maxLength={180}
                rows={4}
              />
              <p className="field-hint counter">{form.skills.length} / 180 characters</p>
            </label>

            <label className="form-field full-width">
              <span>Resume Upload (UI only)</span>
              <input name="resume" onChange={handleChange} type="file" accept=".pdf,.doc,.docx" />
              {form.resume && <p className="field-hint">Selected file: {form.resume}</p>}
            </label>
          </div>

          <label className="form-terms">
            <input
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              type="checkbox"
            />
            <span>I accept the terms and conditions *</span>
          </label>
          {errors.terms && <p className="field-error">{errors.terms}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {submittedData && (
        <section className="submission-summary">
          <h3>Submitted Details</h3>
          <div className="summary-grid">
            <p>
              <strong>Name:</strong> {submittedData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {submittedData.email}
            </p>
            <p>
              <strong>Mobile:</strong> {submittedData.mobile}
            </p>
            <p>
              <strong>Gender:</strong> {submittedData.gender || 'Not specified'}
            </p>
            <p>
              <strong>DOB:</strong> {submittedData.dob || 'Not specified'}
            </p>
            <p>
              <strong>College:</strong> {submittedData.college || 'Not specified'}
            </p>
            <p>
              <strong>Branch:</strong> {submittedData.branch || 'Not specified'}
            </p>
            <p>
              <strong>Graduation Year:</strong> {submittedData.graduationYear || 'Not specified'}
            </p>
            <p className="full-width">
              <strong>Skills:</strong> {submittedData.skills || 'Not specified'}
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

export default Register
