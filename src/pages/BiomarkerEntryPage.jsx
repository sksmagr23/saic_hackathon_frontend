import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Upload, FileSpreadsheet, Send, Download } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const BiomarkerEntryPage = () => {
  const [loading, setLoading] = useState(false);
  const [biomarkers, setBiomarkers] = useState([{ biomarker: "", value: "" }]);
  const [predictions, setPredictions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  // Common biomarkers for autocomplete
  const commonBiomarkers = [
    "Glucose", "HbA1c", "Creatinine", "Hemoglobin", "Triglycerides", 
    "HDL", "LDL", "Total cholesterol", "Ferritin", "MCV", "WBC", 
    "Platelets", "Sodium", "Potassium", "Chloride", "Calcium", 
    "Phosphorus", "Magnesium", "BUN", "Albumin", "Total protein",
    "Bilirubin", "ALT", "AST", "ALP", "LDH", "CK", "TSH", "Free T4",
    "Cortisol", "Insulin", "C-peptide", "Vitamin B12", "Folate",
    "Iron", "TIBC", "Transferrin", "ESR", "CRP", "Procalcitonin"
  ];

  const addBiomarker = () => {
    setBiomarkers([...biomarkers, { biomarker: "", value: "" }]);
  };

  const removeBiomarker = (index) => {
    if (biomarkers.length > 1) {
      setBiomarkers(biomarkers.filter((_, i) => i !== index));
    }
  };

  const updateBiomarker = (index, field, value) => {
    const updated = biomarkers.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setBiomarkers(updated);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      // Immediately analyze the CSV on selection
      submitCSVPrediction(file);
    }
  };


  const downloadCSVTemplate = () => {
    const csvContent = "biomarker,value\nGlucose,100\nHbA1c,5.5\nCreatinine,1.0\nHemoglobin,14.0";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biomarker_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const submitPrediction = async () => {
    setLoading(true);
    try {
      // Filter out empty biomarkers
      const validBiomarkers = biomarkers.filter(b => b.biomarker.trim() && b.value);
      
      if (validBiomarkers.length === 0) {
        toast.error("Please enter at least one biomarker");
        return;
      }

      // Convert to labData object
      const labData = {};
      validBiomarkers.forEach(b => {
        labData[b.biomarker] = parseFloat(b.value);
      });

      // Get user profile for age and gender
      const profileResponse = await axios.get("/api/users/profile");
      const profile = profileResponse.data;
      
      if (!profile.dateOfBirth || !profile.sex) {
        toast.error("Please complete your profile (date of birth and sex) first");
        return;
      }

      // Calculate age
      const age = calculateAge(profile.dateOfBirth);
      const gender = profile.sex.toLowerCase();

      const response = await axios.post("/api/uploads", {
        age,
        gender,
        labData
      });

      setPredictions(response.data.data);
      setShowResults(true);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error.response?.data?.error || "Failed to process biomarkers");
    } finally {
      setLoading(false);
    }
  };

  const submitCSVPrediction = async (fileParam) => {
    const fileToUpload = fileParam || csvFile;
    if (!fileToUpload) {
      toast.error("Please select a CSV file");
      return;
    }

    setLoading(true);
    try {
      const profileResponse = await axios.get("/api/users/profile");
      const profile = profileResponse.data;
      
      if (!profile.dateOfBirth || !profile.sex) {
        toast.error("Please complete your profile (date of birth and sex) first");
        return;
      }

      const age = calculateAge(profile.dateOfBirth);
      const gender = profile.sex.toLowerCase();

      const formData = new FormData();
      formData.append("csvFile", fileToUpload);
      formData.append("age", age);
      formData.append("gender", gender);

      const response = await axios.post("/api/uploads/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPredictions(response.data.data);
      setShowResults(true);
      toast.success("CSV analysis completed successfully!");
    } catch (error) {
      console.error("CSV prediction error:", error);
      toast.error(error.response?.data?.error || "Failed to process CSV file");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getSeverityColor = (score) => {
    if (score >= 7) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biomarker Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Enter your biomarker values manually or upload a CSV file for disease prediction
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Manual Entry */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Manual Entry</h2>
          
          <div className="space-y-4">
            {biomarkers.map((biomarker, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Biomarker name (e.g., Glucose)"
                    value={biomarker.biomarker}
                    onChange={(e) => updateBiomarker(index, "biomarker", e.target.value)}
                    list={`biomarkers-${index}`}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <datalist id={`biomarkers-${index}`}>
                    {commonBiomarkers.map((bm) => (
                      <option key={bm} value={bm} />
                    ))}
                  </datalist>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Value"
                    value={biomarker.value}
                    onChange={(e) => updateBiomarker(index, "value", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => removeBiomarker(index)}
                  disabled={biomarkers.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addBiomarker}
              className="btn btn-outline flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Biomarker
            </button>
            <button
              onClick={submitPrediction}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Send className="h-4 w-4" />}
              Analyze
            </button>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">CSV Upload</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Upload a CSV with columns: biomarker,value. Analysis starts automatically.
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="btn btn-outline cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose CSV File
              </label>
              {csvFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadCSVTemplate}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </button>
              {/* CSV is analyzed automatically on upload; no extra button needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && predictions.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Analysis Results</h2>
          <div className="space-y-4">
            {predictions
              .sort((a, b) => b.scoring - a.scoring)
              .map((prediction, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getSeverityColor(prediction.scoring)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{prediction.label}</h3>
                    <div className="text-right">
                      <div className="text-sm opacity-75">
                        Match: {(prediction.criteriaMatchPercentage * 100).toFixed(1)}%
                      </div>
                      <div className="font-bold">Score: {prediction.scoring.toFixed(1)}</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-75">
                    Diet Category: {prediction.dietKey}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomarkerEntryPage; 