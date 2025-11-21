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

export default function InferenciaNii() {
  const [imageFile, setImageFile] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!imageFile || !maskFile) {
      setError("Selecciona la imagen T1 (.nii) y la máscara correspondiente.");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("image", imageFile);
      form.append("mask", maskFile);

      const res = await fetch(`${apiBase}/predict_from_nii`, {
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
              Inferencia directa desde imagen T1 (.nii) + máscara
            </h1>
            <p className="text-sm md:text-[15px] text-slate-600 max-w-3xl leading-relaxed">
              Esta vista permite cargar la{" "}
              <strong>imagen T1 en formato NIfTI</strong>{" "}
              (<code className="bg-slate-100 px-1 rounded text-xs">.nii</code> /
              <code className="bg-slate-100 px-1 rounded text-xs">.nii.gz</code>){" "}
              junto con su <strong>máscara</strong>. El servidor extrae
              automáticamente las 42 características radiómicas y aplica el
              mismo clasificador que en el módulo basado en archivo{" "}
              <code className="bg-slate-100 px-1 rounded text-xs">.txt</code>.
            </p>
          </div>
        </header>

        {/* TARJETA DE CARGA */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              1. Cargar imagen y máscara
            </h2>
            <p className="text-xs text-slate-600">
              Selecciona la <strong>imagen T1</strong> y la{" "}
              <strong>máscara correspondiente</strong>, ambas en formato NIfTI
              (<code className="bg-slate-100 px-1 rounded text-[11px]">
                .nii / .nii.gz
              </code>
              ). El backend se encarga de extraer las características mediante
              PyRadiomics.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Imagen T1 (.nii / .nii.gz)
                </label>
                <input
                  type="file"
                  accept=".nii,.nii.gz"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-slate-700
                             file:mr-3 file:py-2 file:px-4
                             file:rounded-xl file:border-0
                             file:text-sm file:font-medium
                             file:text-white
                             file:bg-[#2e75b6]
                             hover:file:bg-[#245d8f]
                             cursor-pointer"
                />
                {imageFile && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Imagen seleccionada:{" "}
                    <span className="font-medium">{imageFile.name}</span>
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Máscara (.nii / .nii.gz)
                </label>
                <input
                  type="file"
                  accept=".nii,.nii.gz"
                  onChange={(e) =>
                    setMaskFile(e.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-slate-700
                             file:mr-3 file:py-2 file:px-4
                             file:rounded-xl file:border-0
                             file:text-sm file:font-medium
                             file:text-white
                             file:bg-[#2e75b6]
                             hover:file:bg-[#245d8f]
                             cursor-pointer"
                />
                {maskFile && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Máscara seleccionada:{" "}
                    <span className="font-medium">{maskFile.name}</span>
                  </p>
                )}
              </div>
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
                "Obtener predicción desde .nii"
              )}
            </button>
          </form>

          {loading && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              El servidor está leyendo la imagen, extrayendo las características
              radiómicas y aplicando el clasificador. Esto puede tardar 20–30
              segundos según el tamaño del archivo.
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

                {probabilityRef !== null && (
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Probabilidad REF: </span>
                      {(probabilityRef * 100).toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Este valor refleja la probabilidad estimada por el modelo
                      de pertenecer al grupo de referencia definido en el
                      entrenamiento. No debe interpretarse como un riesgo
                      clínico individual.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold">Modelo:</span>{" "}
                  {result.model_type || "radiomics_elasticnet_logreg_from_nii"}
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
                    Se utiliza el mismo clasificador entrenado con 42
                    características radiómicas del estudio a 20 años.
                  </li>
                  <li>
                    Las características se extraen automáticamente a partir del
                    volumen T1 y la máscara asociados al paciente.
                  </li>
                  <li>
                    El desempeño del modelo es moderado (AUC ≈ 0.64), por lo
                    que su uso es exploratorio y de investigación.
                  </li>
                  <li>
                    Cualquier decisión clínica debe basarse en la valoración
                    médica integral y no en esta predicción.
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Este resultado es <strong>estrictamente experimental</strong>. No
              constituye diagnóstico clínico ni apoyo a la toma de decisiones
              médicas. Forma parte del proyecto de grado de la Maestría en
              Inteligencia Artificial y debe interpretarse en el contexto del
              informe metodológico.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
