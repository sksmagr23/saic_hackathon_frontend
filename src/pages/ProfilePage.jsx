import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"
import { Calendar, Save } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const ProfilePage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    dateOfBirth: "",
    sex: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile", { withCredentials: true })
      setProfile({
        dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split("T")[0] : "",
        sex: response.data.sex || "",
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axios.put("/api/users/profile", profile, { withCredentials: true })
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.profilePicture || "/placeholder.svg"}
            alt={user?.firstName}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This helps us provide more accurate health insights based on age-specific reference ranges.
            </p>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sex</label>
            <select
              name="sex"
              value={profile.sex}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Some biomarker reference ranges differ by sex, helping us provide more personalized analysis.
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Privacy Notice */}
      <div className="card p-6">
        <h3 className="font-semibold text-foreground mb-3">Privacy & Security</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Your health data is encrypted and stored securely. We never share your personal health information with
            third parties.
          </p>
          <p>You can delete your account and all associated data at any time by contacting our support team.</p>
          <p>
            All analysis is performed using established medical reference ranges and rule-based algorithms - no machine
            learning models have access to your data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
