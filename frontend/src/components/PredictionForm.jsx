import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  Activity,
  Brain,
  RotateCcw,
  Loader2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
  Cpu,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./PredictionForm.css";

const initialValues = {
  MDVP_Fo: "",
  MDVP_Fhi: "",
  MDVP_Flo: "",
  MDVP_Jitter_percent: "",
  MDVP_Jitter_Abs: "",
  MDVP_RAP: "",
  MDVP_PPQ: "",
  Jitter_DDP: "",
  MDVP_Shimmer: "",
  MDVP_Shimmer_dB: "",
  Shimmer_APQ3: "",
  Shimmer_APQ5: "",
  MDVP_APQ: "",
  Shimmer_DDA: "",
  NHR: "",
  HNR: "",
  RPDE: "",
  DFA: "",
  spread1: "",
  spread2: "",
  D2: "",
  PPE: "",
};

const featureGroups = [
  {
    title: "Fundamental Frequency",
    description: "Basic vocal frequency measurements.",
    fields: [
      ["MDVP_Fo", "Average Fundamental Frequency"],
      ["MDVP_Fhi", "Maximum Fundamental Frequency"],
      ["MDVP_Flo", "Minimum Fundamental Frequency"],
    ],
  },
  {
    title: "Jitter Measurements",
    description: "Frequency variation and perturbation measurements.",
    fields: [
      ["MDVP_Jitter_percent", "Jitter (%)"],
      ["MDVP_Jitter_Abs", "Jitter (Absolute)"],
      ["MDVP_RAP", "RAP"],
      ["MDVP_PPQ", "PPQ"],
      ["Jitter_DDP", "Jitter DDP"],
    ],
  },
  {
    title: "Shimmer Measurements",
    description: "Amplitude variation measurements.",
    fields: [
      ["MDVP_Shimmer", "Shimmer"],
      ["MDVP_Shimmer_dB", "Shimmer (dB)"],
      ["Shimmer_APQ3", "Shimmer APQ3"],
      ["Shimmer_APQ5", "Shimmer APQ5"],
      ["MDVP_APQ", "MDVP APQ"],
      ["Shimmer_DDA", "Shimmer DDA"],
    ],
  },
  {
    title: "Noise & Harmonics",
    description: "Voice noise and harmonic structure.",
    fields: [
      ["NHR", "Noise-to-Harmonics Ratio"],
      ["HNR", "Harmonics-to-Noise Ratio"],
    ],
  },
  {
    title: "Nonlinear Voice Measures",
    description: "Nonlinear and complexity-based voice measurements.",
    fields: [
      ["RPDE", "RPDE"],
      ["DFA", "DFA"],
      ["spread1", "Spread 1"],
      ["spread2", "Spread 2"],
      ["D2", "D2"],
      ["PPE", "PPE"],
    ],
  },
];

function PredictionForm({ onBack }) {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const hasEmptyField = Object.values(values).some(
      (value) => value === ""
    );

    if (hasEmptyField) {
      setError("Please enter values for all 22 voice features.");
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        Number(value),
      ])
    );

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          `Backend error: ${
            err.response.data?.detail ||
            "Unable to process prediction."
          }`
        );
      } else {
        setError(
          "Unable to connect to the backend. Make sure FastAPI is running on port 8000."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setResult(null);
    setError("");
  };

  const chartData =
    result?.explanation?.top_features?.map((item) => ({
      feature: item.feature,
      impact: Number(item.shap_value.toFixed(4)),
    })) || [];

  return (
    <main className="analysis-page">
      <motion.div
        className="analysis-container"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* HEADER */}
        <div className="analysis-header">
          <button
            className="back-button"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="analysis-brand">
            <div className="brand-icon">
              <Activity size={20} />
            </div>

            <span>NeuroVoice AI</span>
          </div>
        </div>

        {/* INTRO */}
        <section className="analysis-intro">
          <div className="analysis-badge">
            <Brain size={15} />
            ML VOICE ANALYSIS
          </div>

          <h1>Analyze Voice Profile</h1>

          <p>
            Enter the 22 biomedical voice features used by the trained
            machine learning pipeline.
          </p>
        </section>

        {/* NOTICE */}
        <div className="research-notice">
          <ShieldCheck size={20} />

          <div>
            <strong>Research prototype</strong>

            <p>
              This tool provides a machine learning prediction for
              academic research. It is not a medical diagnosis.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {featureGroups.map((group, groupIndex) => (
            <motion.section
              className="feature-card"
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: groupIndex * 0.08,
              }}
            >
              <div className="feature-card-header">
                <div>
                  <span className="feature-number">
                    0{groupIndex + 1}
                  </span>

                  <h2>{group.title}</h2>

                  <p>{group.description}</p>
                </div>
              </div>

              <div className="feature-grid">
                {group.fields.map(([field, label]) => (
                  <div className="input-group" key={field}>
                    <label htmlFor={field}>{label}</label>

                    <input
                      id={field}
                      type="number"
                      step="any"
                      value={values[field]}
                      onChange={(event) =>
                        handleChange(field, event.target.value)
                      }
                      placeholder="Enter value"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
          ))}

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="reset-button"
              onClick={resetForm}
              disabled={loading}
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="submit"
              className="analyze-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spin" size={19} />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Voice Profile
                  <Activity size={19} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* RESULT */}
        {result && (
          <motion.section
            className="result-card"
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="result-header">
              <div>
                <span className="small-label">
                  MODEL RESULT
                </span>

                <h2>Analysis Complete</h2>
              </div>

              <div className="result-status">
                <span />
                COMPLETE
              </div>
            </div>

            {/* CLASSIFICATION */}
            <div className="prediction-result">
              <span>Classification</span>

              <strong>{result.result}</strong>
            </div>

            {/* PROBABILITIES */}
            <div className="probability-section">
              <div className="probability-row">
                <div className="probability-label">
                  <span>Parkinson's probability</span>

                  <strong>
                    {(result.parkinsons_probability * 100).toFixed(2)}%
                  </strong>
                </div>

                <div className="probability-track">
                  <motion.div
                    className="probability-fill"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        result.parkinsons_probability * 100
                      }%`,
                    }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </div>

              <div className="probability-row">
                <div className="probability-label">
                  <span>Healthy probability</span>

                  <strong>
                    {(result.healthy_probability * 100).toFixed(2)}%
                  </strong>
                </div>

                <div className="probability-track">
                  <motion.div
                    className="probability-fill healthy-fill"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        result.healthy_probability * 100
                      }%`,
                    }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </div>
            </div>

            {/* RESULT SUMMARY */}
            <div className="result-summary-grid">
              <div className="summary-card">
                <div className="summary-icon">
                  <Brain size={19} />
                </div>

                <div>
                  <span>CLASSIFIER</span>
                  <strong>ML Pipeline</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">
                  <BarChart3 size={19} />
                </div>

                <div>
                  <span>FEATURES ANALYZED</span>
                  <strong>22 Voice Features</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">
                  <Cpu size={19} />
                </div>

                <div>
                  <span>EXPLAINABILITY</span>
                  <strong>SHAP</strong>
                </div>
              </div>
            </div>

            {/* SHAP */}
            {result.explanation && (
              <motion.div
                className="shap-section"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                }}
              >
                <div className="shap-header">
                  <div className="shap-title">
                    <div className="shap-icon">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <span className="small-label">
                        EXPLAINABLE AI
                      </span>

                      <h3>
                        Why did the model predict this?
                      </h3>
                    </div>
                  </div>

                  <span className="shap-badge">
                    SHAP
                  </span>
                </div>

                <p className="shap-description">
                  SHAP identifies which voice features had the
                  strongest influence on this individual prediction.
                </p>

                {/* SHAP CHART */}
                {chartData.length > 0 && (
                  <div className="shap-chart-card">
                    <div className="chart-title">
                      <BarChart3 size={17} />
                      Feature impact on prediction
                    </div>

                    <ResponsiveContainer
                      width="100%"
                      height={330}
                    >
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                          top: 10,
                          right: 20,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(148,163,184,0.08)"
                        />

                        <XAxis
                          type="number"
                          stroke="#64748b"
                          tick={{
                            fill: "#64748b",
                            fontSize: 10,
                          }}
                        />

                        <YAxis
                          type="category"
                          dataKey="feature"
                          width={125}
                          stroke="#64748b"
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 10,
                          }}
                        />

                        <Tooltip
                          cursor={{
                            fill: "rgba(79,209,197,0.04)",
                          }}
                          contentStyle={{
                            background: "#0b1728",
                            border:
                              "1px solid rgba(79,209,197,0.2)",
                            borderRadius: "10px",
                            color: "#e2e8f0",
                          }}
                          formatter={(value) => [
                            value,
                            "SHAP impact",
                          ]}
                        />

                        <Bar
                          dataKey="impact"
                          fill="#4fd1c5"
                          radius={[0, 5, 5, 0]}
                          animationDuration={900}
                        />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="chart-legend">
                      <span>
                        Positive values → Parkinson's
                      </span>

                      <span>
                        Negative values → Healthy
                      </span>
                    </div>
                  </div>
                )}

                {/* SHAP LIST */}
                <div className="shap-list">
                  {result.explanation.top_features.map(
                    (item, index) => {
                      const increases =
                        item.shap_value > 0;

                      return (
                        <motion.div
                          className="shap-item"
                          key={item.feature}
                          initial={{
                            opacity: 0,
                            x: -15,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.35,
                            delay:
                              0.5 + index * 0.06,
                          }}
                        >
                          <div className="shap-rank">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="shap-feature">
                            <strong>
                              {item.feature}
                            </strong>

                            <span>
                              Input value:{" "}
                              {item.value.toFixed(5)}
                            </span>
                          </div>

                          <div
                            className={`shap-impact ${
                              increases
                                ? "impact-positive"
                                : "impact-negative"
                            }`}
                          >
                            {increases ? (
                              <TrendingUp size={16} />
                            ) : (
                              <TrendingDown size={16} />
                            )}

                            <div>
                              <strong>
                                {increases ? "+" : ""}
                                {item.shap_value.toFixed(4)}
                              </strong>

                              <span>
                                {increases
                                  ? "Increases Parkinson's probability"
                                  : "Decreases Parkinson's probability"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>

                <div className="shap-note">
                  <Brain size={17} />

                  <span>
                    SHAP values explain the direction and relative
                    contribution of individual features to the model's
                    prediction. They describe model behavior and are
                    not clinical evidence.
                  </span>
                </div>
              </motion.div>
            )}

            {/* DISCLAIMER */}
            <div className="result-note">
              <ShieldCheck size={17} />

              <span>
                This result is a model prediction from the provided
                voice features and should not be interpreted as a
                clinical diagnosis.
              </span>
            </div>
          </motion.section>
        )}
      </motion.div>
    </main>
  );
}

export default PredictionForm;