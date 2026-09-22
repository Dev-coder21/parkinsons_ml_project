import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Mic2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PredictionForm from "./components/PredictionForm";

function App() {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const startAnalysis = () => {
    setShowAnalysis(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  const goHome = () => {
    setShowAnalysis(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  // =========================
  // ANALYSIS PAGE
  // =========================

  if (showAnalysis) {
    return (
      <div className="app">
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />

        <PredictionForm onBack={goHome} />
      </div>
    );
  }

  // =========================
  // LANDING PAGE
  // =========================

  return (
    <div className="app">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div
          className="brand"
          onClick={goHome}
          style={{ cursor: "pointer" }}
        >
          <div className="brand-icon">
            <Activity size={21} />
          </div>

          <span>NeuroVoice AI</span>
        </div>

        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <button className="nav-button" onClick={startAnalysis}>
          Start Analysis
          <ArrowRight size={17} />
        </button>
      </nav>

      {/* HERO */}
      <main>
        <section className="hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow">
              <Sparkles size={15} />
              AI-POWERED VOICE ANALYSIS
            </div>

            <h1>
              Understanding
              <span> Parkinson’s </span>
              through voice.
            </h1>

            <p>
              An AI-powered research prototype that analyzes biomedical voice
              features using machine learning to identify patterns associated
              with Parkinson’s disease.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={startAnalysis}
                type="button"
              >
                Start Voice Analysis
                <ArrowRight size={19} />
              </button>

              <a href="#how-it-works" className="secondary-button">
                Explore the technology
              </a>
            </div>

            <div className="hero-points">
              <div>
                <CheckCircle2 size={16} />
                Machine Learning
              </div>

              <div>
                <CheckCircle2 size={16} />
                Explainable AI
              </div>

              <div>
                <ShieldCheck size={16} />
                Research Prototype
              </div>
            </div>
          </motion.div>

          {/* HERO VISUAL */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="monitor-card">
              <div className="monitor-top">
                <div>
                  <span className="small-label">VOICE ANALYSIS</span>
                  <h3>Neural Signal Monitor</h3>
                </div>

                <div className="ready-status">
                  <span />
                  READY
                </div>
              </div>

              <div className="signal-box">
                <div className="grid-lines" />

                <div className="signal">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <motion.span
                      key={index}
                      animate={{
                        height: [
                          `${8 + (index % 4) * 4}px`,
                          `${18 + ((index * 7) % 25)}px`,
                          `${8 + (index % 4) * 4}px`,
                        ],
                      }}
                      transition={{
                        duration: 1.2 + (index % 5) * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="monitor-stats">
                <div>
                  <span>VOICE FEATURES</span>
                  <strong>22</strong>
                </div>

                <div>
                  <span>ML PIPELINE</span>
                  <strong>ACTIVE</strong>
                </div>

                <div>
                  <span>XAI</span>
                  <strong>SHAP</strong>
                </div>
              </div>

              <div className="monitor-footer">
                <Brain size={17} />
                AI model ready for biomedical voice feature analysis
              </div>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how-it-works">
          <div className="section-heading">
            <span>THE PIPELINE</span>

            <h2>
              From voice features to
              <br />
              machine learning insight.
            </h2>

            <p>
              NeuroVoice AI combines preprocessing, feature selection,
              classification and explainable AI into one research workflow.
            </p>
          </div>

          <div className="steps">
            <Step
              number="01"
              icon={<Mic2 size={23} />}
              title="Voice Features"
              description="Biomedical voice measurements are provided as numerical features."
            />

            <Step
              number="02"
              icon={<Brain size={23} />}
              title="ML Pipeline"
              description="The trained machine learning pipeline processes and evaluates the features."
            />

            <Step
              number="03"
              icon={<Activity size={23} />}
              title="Prediction"
              description="The model produces a classification and probability estimate."
            />

            <Step
              number="04"
              icon={<Sparkles size={23} />}
              title="Explainable AI"
              description="SHAP-based analysis helps understand which features influenced the model."
            />
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="about-card">
            <div className="about-icon">
              <Brain size={28} />
            </div>

            <div>
              <span className="small-label">ABOUT THE PROJECT</span>

              <h2>
                Machine learning for
                <br />
                biomedical voice analysis.
              </h2>

              <p>
                This project uses the UCI Parkinson’s voice dataset and
                classical machine learning techniques to explore patterns in
                biomedical voice measurements associated with Parkinson’s
                disease.
              </p>

              <div className="about-tags">
                <span>Python</span>
                <span>Scikit-learn</span>
                <span>XGBoost</span>
                <span>SHAP</span>
                <span>FastAPI</span>
                <span>React</span>
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="disclaimer">
          <ShieldCheck size={21} />

          <div>
            <strong>Research prototype — not a medical diagnosis</strong>

            <p>
              This application is intended for academic and research purposes
              only. Model predictions should not be interpreted as a clinical
              diagnosis or used as a substitute for professional medical
              advice.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="brand">
          <div className="brand-icon">
            <Activity size={18} />
          </div>

          <span>NeuroVoice AI</span>
        </div>

        <span>
          Machine Learning • Explainable AI • Biomedical Voice Analysis
        </span>
      </footer>
    </div>
  );
}

function Step({ number, icon, title, description }) {
  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="step-number">{number}</div>

      <div className="step-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </motion.div>
  );
}

export default App;