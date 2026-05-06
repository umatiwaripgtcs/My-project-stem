/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower, Info, CheckCircle, AlertCircle, Loader2, Thermometer, Ruler, ArrowRight } from "lucide-react";

export default function App() {
  const [formData, setFormData] = useState({
    sepal_length: 5.1,
    sepal_width: 3.5,
    petal_length: 1.4,
    petal_width: 0.2,
  });

  const [prediction, setPrediction] = useState<null | {
    prediction: string;
    confidence: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from the server.");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const inputFields = [
    { name: "sepal_length", label: "Sepal Length (cm)", min: 4.3, max: 7.9, step: 0.1 },
    { name: "sepal_width", label: "Sepal Width (cm)", min: 2.0, max: 4.4, step: 0.1 },
    { name: "petal_length", label: "Petal Length (cm)", min: 1.0, max: 6.9, step: 0.1 },
    { name: "petal_width", label: "Petal Width (cm)", min: 0.1, max: 2.5, step: 0.1 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 p-4 md:p-8 flex flex-col items-center">
      <header className="max-w-4xl w-full text-center mb-12 space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200"
        >
          <Flower size={40} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Iris Species <span className="text-indigo-600">Classifier</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Predict the species of an Iris flower using machine learning. Enter the dimensions of the sepal and petal below.
        </p>
      </header>

      <main className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="text-slate-400" size={20} />
            <h2 className="text-xl font-semibold">Flower Measurements</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none bg-slate-50/50"
                    required
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: {field.min}</span>
                    <span>Max: {field.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group translate-y-0 active:translate-y-px"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Classify Flower
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            {!prediction && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 flex flex-col items-center text-center space-y-4"
              >
                <div className="p-4 bg-white rounded-full text-indigo-400">
                  <Info size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 text-lg">Ready to Analyze</h3>
                  <p className="text-indigo-600/70 text-sm">
                    Enter the measurements and click classify to see the machine learning results.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-3xl flex items-start gap-4"
              >
                <AlertCircle className="shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold">Error Occurred</h3>
                  <p className="text-sm opacity-90">{error}</p>
                  <p className="text-xs mt-2 font-mono bg-white/50 p-2 rounded">
                    Tip: Ensure the FastAPI backend is running.
                  </p>
                </div>
              </motion.div>
            )}

            {prediction && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Prediction Result</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                    <CheckCircle size={14} />
                    Verified Agent
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-block p-6 bg-slate-50 rounded-full text-indigo-600 mb-2">
                    <Flower size={64} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 capitalize italic">
                    Iris {prediction.prediction}
                  </h3>
                  
                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500 font-medium">Model Confidence</span>
                      <span className="text-slate-900 font-bold">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Algorithm</span>
                    <span className="text-xs font-semibold text-slate-700">Random Forest</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Scikit-Learn</span>
                    <span className="text-xs font-semibold text-slate-700">v1.2+</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="bg-slate-900 text-slate-100 p-8 rounded-3xl overflow-hidden relative group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Thermometer size={20} className="text-indigo-400" />
                How it works
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                The algorithm analyzes 4 features (sepal/petal length and width) against the classic Iris dataset patterns. Once the request is sent to the <strong>FastAPI</strong> backend, the <strong>Random Forest</strong> classifier evaluates the input and returns the most likely species with a confidence score.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flower size={120} strokeWidth={1} />
            </div>
          </section>
        </motion.div>
      </main>

      <footer className="mt-auto py-12 text-slate-400 text-xs text-center border-t border-slate-100 w-full max-w-4xl">
        <p>© 2024 Machine Learning Showcase • Powered by FastAPI, Scikit-Learn, and React</p>
      </footer>
    </div>
  );
}
