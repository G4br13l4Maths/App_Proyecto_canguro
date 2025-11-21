import { useState } from "react";

const KMC_BLUE = "#2e75b6"; // azul Fundación Canguro aprox

function formatPredictedLabel(predictedClass) {
  if (!predictedClass) return "N/A";

  const cls = predictedClass.toString().toUpperCase();

  if (cls.includes("MMC") && cls.includes("CONTROL")) {
    return "MMC vs Control (clasificación binaria)";
  }
  if (cls.includes("MMC")) {
    return "MMC (Método Madre Canguro)";
  }
  if (cls.includes("CONTROL") || cls.includes("REF")) {
    return "Control / referencia";
  }
  return predictedClass;
}

export default function Inferencia() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

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

  const probabilityRef =
    result && result.probability_ref != null
      ? Number(result.probability_ref)
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* barra superior con color KMC */}
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

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Módulo de inferencia sobre características radiómicas
            </h1>
            <p className="text-sm md:text-[15px] text-slate-600 max-w-3xl leading-relaxed">
              Esta vista permite cargar un archivo{" "}
              <code className="bg-slate-100 px-1 rounded text-xs">.txt</code> con
              las{" "}
              <strong>características radiómicas pre-calculadas</strong> de un
              paciente, extraídas de la imagen T1 mediante el pipeline
              desarrollado en el proyecto. El archivo no está pensado para ser
              diligenciado manualmente, sino generado automáticamente a partir
              de las imágenes.
            </p>
          </div>
        </header>

        {/* TARJETA DE CARGA */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              1. Cargar archivo de características radiómicas
            </h2>
            <p className="text-xs text-slate-600">
              Formato:{" "}
              <code className="bg-slate-100 px-1 rounded text-[11px]">
                clave=valor
              </code>{" "}
              por línea, con las 42 variables radiómicas utilizadas en el
              clasificador (por ejemplo{" "}
              <code className="bg-slate-100 px-1 rounded text-[11px]">
                original_firstorder_10Percentile=29.34
              </code>
              ).
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col md:flex-row md:items-center gap-3"
          >
            <div className="flex-1">
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
              {file && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Archivo seleccionado:{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl
                         text-sm font-medium shadow-sm
                         text-white transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: KMC_BLUE }}
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 mr-2 animate-spin text-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Procesando…
                </>
              ) : (
                "Obtener predicción"
              )}
            </button>
          </form>

          {loading && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              El servidor está leyendo el archivo y aplicando el clasificador
              radiomics T1. Esto puede tardar unos segundos…
            </p>
          )}

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* RESULTADO DE LA INFERENCIA */}
        {result && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              2. Resultado de la inferencia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
              {/* Bloque principal con clase y probabilidad */}
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Clase predicha: </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-[3px] text-xs font-medium text-white"
                    style={{ backgroundColor: KMC_BLUE }}
                  >
                    {formatPredictedLabel(result.predicted_class)}
                  </span>
                </p>

                {/* Probabilidades MMC / Control */}
{result && result.probability_mmc != null && result.probability_control != null && (
  <div className="space-y-1">
    <p className="text-sm text-slate-700">
      <span className="font-semibold">Probabilidad MMC: </span>
      {(Number(result.probability_mmc) * 100).toFixed(1)}%
    </p>

    <p className="text-sm text-slate-700">
      <span className="font-semibold">Probabilidad Control: </span>
      {(Number(result.probability_control) * 100).toFixed(1)}%
    </p>

    <p className="text-[11px] text-slate-500">
      Estas probabilidades reflejan la estimación del modelo radiomics T1
      sobre la pertenencia del paciente a cada grupo (MMC o Control).
      No constituyen riesgo clínico individual y su uso es estrictamente
      exploratorio en el marco del proyecto.
    </p>
  </div>
)}


                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold">Modelo:</span>{" "}
                  {result.model_type || "radiomics_elasticnet_logreg"}
                  {" · "}
                  <span className="font-semibold">
                    Salida interna (raw_class_int):
                  </span>{" "}
                  {result.raw_class_int}
                </p>
              </div>

              {/* Recuadro de interpretación */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">
                  ¿Cómo interpretar este resultado?
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    El modelo se entrenó con un conjunto específico de pacientes
                    del estudio de 20 años del Método Madre Canguro.
                  </li>
                  <li>
                    La predicción resume información numérica de 42
                    características radiómicas extraídas de la imagen T1.
                  </li>
                  <li>
                    El desempeño del modelo es moderado (AUC ≈ 0.64), por lo que
                    su uso se limita a fines exploratorios y de investigación.
                  </li>
                  <li>
                    Cualquier decisión clínica debe basarse en la valoración
                    médica integral y no en la salida de este modelo.
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Este resultado es <strong>estrictamente experimental</strong>. No
              constituye diagnóstico clínico ni apoyo a la toma de decisiones
              médicas. El modelo y esta interfaz forman parte del proyecto de
              grado de la Maestría en Inteligencia Artificial y deben
              interpretarse siempre en el contexto metodológico descrito en el
              informe escrito.
            </p>
          </section>
        )}

        {/* EJEMPLO DE ARCHIVO TXT */}
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Ejemplo de archivo{" "}
            <code className="bg-slate-100 px-1 rounded text-[11px]">.txt</code>{" "}
            (radiomics)
          </h2>
          <p className="text-xs text-slate-600">
            El archivo real contiene las 42 características radiómicas
            empleadas por el modelo. A modo de ejemplo, se muestran algunas de
            ellas:
          </p>

          <pre
            className="text-[11px] leading-relaxed rounded-xl p-4 overflow-x-auto text-slate-50"
            style={{ backgroundColor: "#0f172a" }} // slate-900
          >{`original_firstorder_10Percentile=29.3485
original_firstorder_90Percentile=214.0572
original_firstorder_Energy=416905714306.4755
original_firstorder_Entropy=3.3894
original_firstorder_InterquartileRange=102.7312
original_firstorder_Kurtosis=2.8699
original_firstorder_Maximum=772.3339
original_firstorder_MeanAbsoluteDeviation=56.7872
original_firstorder_Mean=114.1636
original_firstorder_Median=105.0998
...
original_glcm_SumAverage=10.5857
original_glcm_SumEntropy=4.3109
original_glcm_SumSquares=7.3840`}</pre>

          <p className="text-[11px] text-slate-500">
            Estos archivos se generan a partir de las imágenes T1 mediante el
            pipeline de extracción de características (PyRadiomics) descrito en
            los notebooks del proyecto. La interfaz de esta página se enfoca en
            la <strong>visualización e interpretación</strong> de la salida del
            modelo.
          </p>
        </section>
      </div>
    </div>
  );
}
