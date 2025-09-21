import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

const DashboardPage = () => {

  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reports, setReports] = useState([])
  console.log(user.id);
  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.id) return;
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`/api/dashboard/${user.id}`)
        setReports(Array.isArray(response.data.data) ? response.data.data : [])
      } catch (err) {
        console.error("Failed to fetch reports:", err)
        setError("Failed to load reports. Please try again later.")
        toast.error("Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [user?.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  }

  const renderKeyValueList = (data) => {
    if (!data || typeof data !== 'object') return null;
    return (
      <ul className="list-disc list-inside space-y-1 text-xs text-green-900">
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      {Array.isArray(reports) && reports.length > 0 ? reports.map((report) => (
        <div key={report._id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-4 space-y-4">
          <h3 className="text-lg font-bold text-green-700 border-b border-green-200 pb-2 mb-4">Report Date: {new Date(report.date).toLocaleDateString()}</h3>
          <div className="bg-green-100 rounded-lg p-4">
            <h4 className="font-semibold text-green-700 mb-2">Lab Data Summary:</h4>
            {renderKeyValueList(report.labData)}
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-md p-4 max-h-36 overflow-auto">
              <h4 className="font-semibold text-green-700 mb-2">Diet Recommendations:</h4>
              <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                {Array.isArray(report.analysis?.diet) && report.analysis.diet.length > 0 ? report.analysis.diet.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) : <li>No diet recommendations available.</li>}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-md p-4 max-h-36 overflow-auto">
              <h4 className="font-semibold text-green-700 mb-2">Lifestyle Recommendations:</h4>
              <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                {Array.isArray(report.analysis?.lifestyle) && report.analysis.lifestyle.length > 0 ? report.analysis.lifestyle.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) : <li>No lifestyle recommendations available.</li>}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-md p-4 max-h-36 overflow-auto">
              <h4 className="font-semibold text-green-700 mb-2">Precautions:</h4>
              <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                {Array.isArray(report.analysis?.precaution) && report.analysis.precaution.length > 0 ? report.analysis.precaution.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) : <li>No precautions available.</li>}
              </ul>
            </div>
          </div>
          {report.diseases && report.diseases.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <h4 className="font-semibold text-green-700 w-full mb-1">Diseases:</h4>
              {report.diseases.map((disease, index) => (
                <span key={index} className="bg-green-200 text-green-800 rounded-full px-2 py-1 text-xs font-medium">
                  {disease.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )) : <div className="min-h-screen flex items-center justify-center text-green-400">No health reports available.</div>}
    </div>
  )
}

export default DashboardPage
