import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import '../../styles/Register.css'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  dob: '',
  college: '',
  branch: '',
  graduationYear: '2026',
  cgpa: '',
  skills: '',
  role: 'student',
  resume: null,
  profileImage: '',
  profileImageFile: null,
}

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [mode, setMode] = useState('create')

  useEffect(() => {
    if (location.state?.mode && location.state?.userData) {
      setMode(location.state.mode)
      setForm((current) => ({
        ...current,
        ...location.state.userData,
        password: '',
        confirmPassword: '',
      }))
    }
  }, [location.state])

  const validate = () => {
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email Address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone Number is required.'
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits.'
    }

    if (mode !== 'view') {
      if (!form.password) {
        newErrors.password = 'Password is required.'
      } else if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long.'
      }

      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.'
      }
    }

    if (!form.college.trim()) {
      newErrors.college = 'College Name is required.'
    }

    if (!form.branch) {
      newErrors.branch = 'Branch is required.'
    }

    if (!form.graduationYear) {
      newErrors.graduationYear = 'Graduation Year is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value, files } = event.target

    if (name === 'resume' && files && files[0]) {
      setForm((current) => ({
        ...current,
        resume: files[0],
      }))
      setErrors((current) => ({ ...current, resume: '' }))
      return
    }

    if (name === 'profileImage' && files && files[0]) {
      const imageFile = files[0]
      const previewUrl = URL.createObjectURL(imageFile)
      setForm((current) => ({
        ...current,
        profileImage: previewUrl,
        profileImageFile: imageFile,
      }))
      setErrors((current) => ({ ...current, profileImage: '' }))
      return
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitSuccess('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser(form)

      setSubmitSuccess('Registration saved successfully.')
      navigate('/registered-details', {
        state: { userData: form },
      })
    } catch (apiError) {
      setErrors({ api: apiError.message || 'Registration failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <main className="page register-page">
      <section className="register-card">
        <div className="register-card__header">
          <div>
            <p className="eyebrow">
              {mode === 'edit' ? 'Update Profile' : mode === 'view' ? 'Account Summary' : 'Student Registration'}
            </p>

            <h2>
              {mode === 'edit'
                ? 'Edit Your Information'
                : mode === 'view'
                ? 'View Your Information'
                : 'Create Placement Predictor Account'}
            </h2>

            <p>
              {mode === 'view'
                ? 'Review your saved application details below.'
                : 'Register your account to access eligibility scores and placement opportunities.'}
            </p>
          </div>
        </div>

        {submitSuccess && <p className="field-success">{submitSuccess}</p>}
        {errors.api && <p className="field-error">{errors.api}</p>}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field full-width">
              <span>Profile Image Upload</span>
              <div className="file-input-wrapper">
                <input
                  ref={imageInputRef}
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={isReadOnly}
                />
                {form.profileImage ? (
                  <div className="profile-preview">
                    <img src={form.profileImage} alt="Profile Preview" />
                  </div>
                ) : (
                  <p className="file-hint">Select a photo for your account profile.</p>
                )}
              </div>
            </label>

            <label className="form-field">
              <span>Full Name</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                readOnly={isReadOnly}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </label>

            <label className="form-field">
              <span>Account Role</span>
              <select name="role" value={form.role} onChange={handleChange} disabled={isReadOnly}>
                <option value="student">🎓 Student Account</option>
                <option value="admin">🛡️ Administrator Account</option>
              </select>
            </label>

            <label className="form-field">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane.doe@college.edu"
                readOnly={isReadOnly}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label className="form-field">
              <span>Phone Number</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                readOnly={isReadOnly}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>

            {!isReadOnly && (
              <>
                <label className="form-field">
                  <span>Password</span>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                    />
                    <button
                      className="toggle-password"
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </label>

                <label className="form-field">
                  <span>Confirm Password</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </label>
              </>
            )}

            <label className="form-field">
              <span>College Name</span>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Institute of Technology"
                readOnly={isReadOnly}
              />
              {errors.college && <span className="field-error">{errors.college}</span>}
            </label>

            <label className="form-field">
              <span>Branch</span>
              <select name="branch" value={form.branch} onChange={handleChange} disabled={isReadOnly}>
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical Engineering</option>
                <option value="MECH">Mechanical Engineering</option>
              </select>
              {errors.branch && <span className="field-error">{errors.branch}</span>}
            </label>

            <label className="form-field">
              <span>Graduation Year</span>
              <select
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
              {errors.graduationYear && <span className="field-error">{errors.graduationYear}</span>}
            </label>

            <label className="form-field full-width">
              <span>Technical Skills</span>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js, Python"
                readOnly={isReadOnly}
              />
            </label>

            <label className="form-field full-width">
              <span>Resume File</span>
              <div className="file-input-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  disabled={isReadOnly}
                />
                {form.resume ? (
                  <p className="file-selected">Selected: {form.resume.name}</p>
                ) : (
                  <p className="file-hint">Upload PDF or DOCX format (Max 5MB)</p>
                )}
              </div>
            </label>
          </div>

          <div className="form-actions">
            {!isReadOnly && (
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving Account...'
                  : mode === 'edit'
                  ? 'Update Details'
                  : 'Register Account'}
              </button>
            )}

            {mode !== 'create' && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate('/registered-details', { state: { userData: form } })}
              >
                Back to Account Summary
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}

export default Register
