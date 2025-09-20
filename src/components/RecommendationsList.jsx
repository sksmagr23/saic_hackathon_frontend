import { AlertTriangle, Info, CheckCircle, Lightbulb } from "lucide-react"

const RecommendationsList = ({ analysis }) => {
  if (!analysis || analysis.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
        <div className="flex items-center gap-3 text-muted-foreground">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p>All biomarkers appear normal. Keep up the good work!</p>
        </div>
      </div>
    )
  }

  const getRecommendationIcon = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "Borderline":
        return <Info className="h-5 w-5 text-yellow-600" />
      case "Low":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-green-600" />
    }
  }

  const getRecommendationColor = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return "border-l-red-500 bg-red-50/50"
      case "Borderline":
        return "border-l-yellow-500 bg-yellow-50/50"
      case "Low":
        return "border-l-blue-500 bg-blue-50/50"
      default:
        return "border-l-green-500 bg-green-50/50"
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
      <div className="space-y-4">
        {analysis.map((item, index) => (
          <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getRecommendationColor(item.severity)}`}>
            <div className="flex items-start gap-3">
              {getRecommendationIcon(item.severity)}
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">{item.interpretation}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsList
