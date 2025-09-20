import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Activity, Upload, BarChart3, Shield, ArrowRight } from "lucide-react"

const LandingPage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Upload your health reports in PDF, CSV, or JSON format with just a few clicks.",
    },
    {
      icon: BarChart3,
      title: "Smart Analysis",
      description: "Get instant insights and recommendations based on your biomarker data.",
    },
    {
      icon: Activity,
      title: "Trend Tracking",
      description: "Visualize your health trends over time with interactive charts and graphs.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is encrypted and stored securely with Google authentication.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Transform Your Health Reports into
            <span className="text-primary"> Actionable Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Upload your lab reports and get personalized health insights, trend analysis, and recommendations powered by
            medical expertise.
          </p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose HealthInsight?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Upload Report</h3>
              <p className="text-muted-foreground">Securely upload your lab report in any supported format</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Get Analysis</h3>
              <p className="text-muted-foreground">Our system analyzes your biomarkers against medical standards</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your health trends and follow personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
