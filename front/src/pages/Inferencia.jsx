import { useState } from "react";

const KMC_BLUE = "#2e75b6"; // Color institucional

function formatPredictedLabel(raw) {
  if (!raw) return "N/A";

  if (raw === "REF") return "Control / referencia (clase modelo)";
  if (raw === "MMC_or_Control")
    return "MMC o Control (clase modelo: no-REF)";

  return raw;
}

export default function Inferencia() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  // Probabilidad numérica (0–1) de la clase REF, si existe
  const probabilityRef =
    result && result.probability_ref != null
      ? Number(result.probability_ref)
      : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Selecciona un archivo .txt con las características radiómicas.");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${apiBase}/predict`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Ocurrió un error al obtener la predicción.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Paso 2: descargar resultado en .json
  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kmc_inferencia_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-1.5 w-full" style={{ backgroundColor: KMC_BLUE }} />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* ENCABEZADO */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-200">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: KMC_BLUE }}
            />
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-slate-600">
              Proyecto Madre Canguro · 20 años
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Módulo de inferencia sobre características radiómicas
          </h1>

          <p className="text-sm md:text-[15px] text-slate-600 max-w-3xl leading-relaxed">
            Este módulo permite cargar un archivo con las{" "}
            <strong>42 características radiómicas pre-calculadas</strong> del
            paciente, derivadas de la imagen T1 mediante el pipeline del
            proyecto. La predicción generada es estrictamente experimental y
            debe interpretarse exclusivamente en el contexto académico del
            estudio.
          </p>
        </header>

        {/* SUBIDA DE ARCHIVO */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            1. Cargar archivo de características radiómicas
          </h2>

          <p className="text-xs text-slate-600">
            El archivo debe contener 42 variables en formato{" "}
            <code className="bg-slate-100 px-1 rounded text-[11px]">
              clave=valor
            </code>{" "}
            por línea (por ejemplo:{" "}
            <code className="bg-slate-100 px-1 rounded text-[11px]">
              original_firstorder_Entropy=3.41
            </code>
            ).
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col md:flex-row md:items-center gap-3"
          >
            <input
              type="file"
              accept=".txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-700
                         file:mr-3 file:py-2 file:px-4
                         file:rounded-xl file:border-0
                         file:text-sm file:font-medium
                         file:text-white
                         file:bg-[#2e75b6]
                         hover:file:bg-[#245d8f]
                         cursor-pointer"
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl
                         text-sm font-medium shadow-sm
                         text-white transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: KMC_BLUE }}
            >
              {loading ? "Procesando…" : "Obtener predicción"}
            </button>
          </form>

          {file && (
            <p className="text-[11px] text-slate-500">
              Archivo seleccionado:{" "}
              <span className="font-medium">{file.name}</span>
            </p>
          )}

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* RESULTADO */}
        {result && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
            {/* Título + botón de descarga JSON */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">
                2. Resultado de la inferencia
              </h2>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl
                           text-[11px] font-medium border border-slate-300
                           text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
              >
                Descargar resultado (.json)
              </button>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6">
              {/* BLOQUE IZQUIERDO */}
              <div className="space-y-3">
                {/* Clase predicha */}
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Clase predicha: </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-[3px] text-xs font-medium text-white"
                    style={{ backgroundColor: KMC_BLUE }}
                  >
                    {formatPredictedLabel(result.predicted_class)}
                  </span>
                </p>

                {/* Probabilidad REF + barra visual */}
                {probabilityRef !== null && (
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">
                        Probabilidad (clase REF):
                      </span>{" "}
                      {(probabilityRef * 100).toFixed(1)}%
                    </p>

                    {/* 🔹 Barra visual de probabilidad */}
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            Math.max(probabilityRef * 100, 0),
                            100
                          ).toFixed(1)}%`,
                          backgroundColor: KMC_BLUE,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      El tramo sombreado representa la proporción de probabilidad
                      asignada por el modelo a la clase REF.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-slate-500">
                  <strong>Modelo:</strong>{" "}
                  {result.model_type || "radiomics_elasticnet_logreg"}{" "}
                  · <strong>Salida interna (raw):</strong>{" "}
                  {result.raw_class_int}
                </p>
              </div>

              {/* BLOQUE DE INTERPRETACIÓN */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">
                  ¿Cómo interpretar este resultado?
                </p>

                <ul className="list-disc list-inside space-y-1">
                  <li>
                    El modelo se entrenó con un subconjunto específico del
                    estudio de 20 años del Método Madre Canguro.
                  </li>
                  <li>
                    La predicción se basa en 42 características radiómicas
                    cuantitativas extraídas de la imagen T1.
                  </li>
                  <li>
                    El desempeño del modelo es moderado (AUC ≈ 0.64), por lo
                    que su uso es exclusivamente investigativo.
                  </li>
                  <li>
                    No constituye diagnóstico ni apoyo clínico; cualquier
                    decisión médica requiere evaluación profesional completa.
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Este módulo forma parte del proyecto de grado de la Maestría en
              Inteligencia Artificial. La inferencia generada es
              <strong> estrictamente experimental</strong> y debe analizarse
              dentro del contexto metodológico descrito en el informe técnico.
            </p>
          </section>
        )}

        {/* EJEMPLO DE ARCHIVO */}
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Ejemplo de archivo{" "}
            <code className="bg-slate-100 px-1 rounded text-[11px]">.txt</code>
          </h2>

          <p className="text-xs text-slate-600">
            El archivo debe incluir las 42 características radiómicas utilizadas
            por el modelo (se muestran solo algunas para ilustración):
          </p>

          <pre
            className="text-[11px] leading-relaxed rounded-xl p-4 overflow-x-auto text-slate-50"
            style={{ backgroundColor: "#0f172a" }}
          >{`original_firstorder_10Percentile=29.3485
original_firstorder_90Percentile=214.0572
original_firstorder_Energy=416905714306.4755
original_firstorder_Entropy=3.3894
original_firstorder_InterquartileRange=102.7312
original_firstorder_Kurtosis=2.8699
...
original_glcm_SumAverage=10.5857
original_glcm_SumEntropy=4.3109
original_glcm_SumSquares=7.3840`}</pre>

          <p className="text-[11px] text-slate-500">
            Estos valores se generan automáticamente a partir de imágenes T1
            mediante el pipeline de extracción construido en el proyecto.
          </p>
        </section>
      </div>
    </div>
  );
}
