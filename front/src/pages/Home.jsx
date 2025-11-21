const KMC_BLUE = "#2e75b6";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra fina azul debajo de la navbar para mantener identidad visual */}
      <div className="h-1 w-full" style={{ backgroundColor: KMC_BLUE }} />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Encabezado principal del dashboard */}
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Panel de resultados · Método Madre Canguro
          </h1>
          <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed max-w-3xl">
            En esta página se resumen los principales resultados estructurales del seguimiento a
            20 años: submuestras analizadas, comparación entre grupos (MMC vs controles) y patrones
            identificados mediante clustering, modelos supervisados y análisis estadístico sobre
            distintas estructuras cerebrales.
          </p>
        </section>

        {/* 🔹 Tarjetas de KPIs principales (valores reales por submuestra) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              MRI T1 tras QC
            </span>
            <span className="text-2xl font-semibold text-slate-900">215</span>
            <span className="text-[11px] text-slate-500">
              Sujetos con resonancia estructural T1 apta para análisis morfométrico a 20 años.
            </span>
          </div>

          {/* KPI 2 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              FreeSurfer · corteza visual
            </span>
            <span className="text-2xl font-semibold text-slate-900">185</span>
            <span className="text-[11px] text-slate-500">
              Participantes con tablas .stats completas y covariables clínicas no faltantes
              incluidos en los modelos ajustados.
            </span>
          </div>

          {/* KPI 3 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Slices cuerpo calloso
            </span>
            <span className="text-2xl font-semibold text-slate-900">156</span>
            <span className="text-[11px] text-slate-500">
              Sujetos (84 MMC, 72 control) con imágenes segmentadas del cuerpo calloso usadas en el
              clustering.
            </span>
          </div>

          {/* KPI 4 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Radiomics T1
            </span>
            <span className="text-2xl font-semibold text-slate-900">151</span>
            <span className="text-[11px] text-slate-500">
              Participantes (83 MMC, 68 control) incluidos en el modelo supervisado basado en
              descriptores radiológicos T1.
            </span>
          </div>
        </section>
        {/* 🔹 Distribución de la cohorte por grupo (ejemplo radiomics T1) */}
<section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
  <div className="flex flex-col gap-1">
    <h2 className="text-sm font-semibold text-slate-900">
      Distribución por grupo · submuestra radiomics T1
    </h2>
    <p className="text-xs text-slate-600 max-w-3xl">
      Esta visualización resume la proporción de participantes MMC y control en la
      submuestra utilizada para el modelo radiomics T1 (83 MMC y 68 controles). La
      distribución exacta puede variar entre los distintos análisis del pipeline
      (FreeSurfer, clustering y pruebas neuropsicológicas).
    </p>
  </div>

  {/* Barras horizontales tipo "gráfico" simple */}
  <div className="space-y-3 mt-2">
    {/* MMC */}
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-700">MMC</span>
        <span className="text-xs text-slate-500">55%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: "55%", backgroundColor: KMC_BLUE }}
        />
      </div>
    </div>

    {/* Control */}
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-700">Control</span>
        <span className="text-xs text-slate-500">45%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-slate-400" style={{ width: "45%" }} />
      </div>
    </div>
  </div>

  <p className="text-[11px] text-slate-500 leading-relaxed">
    En el informe escrito se documenta la composición de cada submuestra (MRI T1,
    FreeSurfer, radiomics y pruebas neuropsicológicas), así como los criterios de inclusión
    y las diferencias entre participantes MMC y controles.
  </p>
</section>

        
        {/* 🔹 Clustering exploratorio en cuerpo calloso (FreeSurfer / slices) */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Clustering exploratorio en cuerpo calloso
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              El análisis se realizó sobre 156 participantes (84 MMC, 72 controles) con imágenes de
              slices del cuerpo calloso segmentadas y procesadas. A partir de representaciones
              latentes aprendidas mediante un autoencoder 3D se aplicó K-means para identificar
              patrones estructurales sin usar la etiqueta de grupo durante el entrenamiento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Imagen del clustering */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src="/images/clustering_cuerpo_calloso.png"
                alt="Dispersión de sujetos en el espacio de características latentes del cuerpo calloso, coloreados por clúster K-means."
                className="max-h-80 w-auto object-contain rounded-md"
              />
            </div>

            {/* Texto explicativo del clustering */}
            <div className="flex flex-col gap-3">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">
                  Estructura de los clústeres
                </h3>
                <p className="text-xs text-slate-600">
                  El modelo K-means con dos clústeres alcanzó un índice de silueta cercano a{" "}
                  <span className="font-semibold">0.57</span>, lo que indica una separación
                  moderada entre patrones latentes en las métricas del cuerpo calloso.
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  <li>
                    En el <span className="font-semibold">clúster 0</span>, aproximadamente el 64%
                    de los sujetos pertenece al grupo MMC y el 36% al grupo control.
                  </li>
                  <li>
                    En el <span className="font-semibold">clúster 1</span> se observa una
                    distribución más equilibrada, con ligera tendencia hacia controles (≈56%
                    control, 44% MMC).
                  </li>
                  <li>
                    El análisis es no supervisado; las etiquetas clínicas se utilizan únicamente en
                    la etapa de interpretación para comparar la distribución de MMC y controles en
                    cada clúster.
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Los resultados sugieren que el cuerpo calloso contiene huellas estructurales sutiles
                asociadas al tipo de cuidado neonatal temprano. Aunque existe solapamiento entre
                grupos, la organización latente tiende a diferenciar, de forma parcial, a pacientes
                MMC de controles.
              </p>
            </div>
          </div>
        </section>

        {/* 🔹 Resultados FreeSurfer en corteza visual */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Resultados FreeSurfer en corteza visual
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              A partir de las segmentaciones automáticas de FreeSurfer se analizaron métricas de
              grosor cortical, área y volumen gris en regiones occipitales y temporales
              (pericalcarina, cuneus, lingual, lateral occipital y fusiforme). La submuestra incluyó{" "}
              <span className="font-semibold">185 participantes</span> (105 MMC y 80 controles) con
              tablas .stats completas y covariables clínicas disponibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Imagen de las comparaciones FreeSurfer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src="/images/freesurfer_corteza_visual.png"
                alt="Mapa de efectos MMC vs Control en corteza visual (ThickAvg, SurfArea, GrayVol y GrayVol/eTIV) estimados con modelos OLS."
                className="max-h-80 w-auto object-contain rounded-md"
              />
            </div>

            {/* Resumen textual de hallazgos */}
            <div className="flex flex-col gap-3">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">
                  Regiones y métricas analizadas
                </h3>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  <li>
                    Regiones: pericalcarina, cuneus, lingual, lateral occipital y fusiforme.
                  </li>
                  <li>
                    Métricas: grosor medio (ThickAvg), área de superficie (SurfArea), volumen gris
                    (GrayVol) y volumen gris normalizado (GrayVol/eTIV).
                  </li>
                  <li>
                    Modelos ajustados por eTIV, sexo, edad gestacional y otras covariables clínicas.
                  </li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Tendencias preliminares</h3>
                <p className="text-xs text-slate-600">
                  Se observan{" "}
                  <span className="font-semibold">
                    tendencias a mayores valores de grosor, volumen y área
                  </span>{" "}
                  en algunas regiones de la corteza visual en el grupo MMC frente a los controles,
                  especialmente en cuneus y zonas pericalcarinas. Las diferencias son sutiles, de
                  tamaño de efecto moderado, y requieren validación en muestras más amplias.
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Esta sección resume de forma visual los análisis estructurales con FreeSurfer
                detallados en el informe escrito. La interpretación de estos hallazgos se hace
                siempre en conjunto con los desenlaces clínicos y neuropsicológicos del estudio.
              </p>
            </div>
          </div>
        </section>

        {/* 🔹 Enfoque supervisado basado en radiomics */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Enfoque supervisado basado en radiomics T1
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Siguiendo la propuesta de Wagner et al. (Scientific Reports, 2022), se implementó un
              pipeline supervisado para predecir pertenencia al grupo MMC o control a partir de
              descriptores radiológicos cuantitativos extraídos de imágenes T1. La submuestra de
              trabajo incluyó <span className="font-semibold">151 participantes</span> (83 MMC y 68
              controles).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Imagen de la curva ROC */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src="/images/roc_radiomics_t1.png"
                alt="Curva ROC del modelo radiomics T1 (Elastic Net) para clasificación MMC vs Control, con AUC aproximado de 0.64."
                className="max-h-80 w-auto object-contain rounded-md"
              />
            </div>

            {/* Resumen textual del modelo */}
            <div className="flex flex-col gap-3">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Pipeline supervisado</h3>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  <li>Preprocesamiento de MRI T1.</li>
                  <li>Extracción de características radiomics (PyRadiomics).</li>
                  <li>Integración con variables clínicas (subconjunto seleccionado).</li>
                  <li>
                    Modelado supervisado con <span className="font-medium">Elastic Net</span>.
                  </li>
                  <li>Evaluación mediante curva ROC y AUC.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Desempeño preliminar</h3>
                <p className="text-xs text-slate-600">
                  El modelo radiomics T1 alcanza un AUC aproximado de{" "}
                  <span className="font-semibold">0.64</span> para distinguir entre pacientes MMC y
                  controles, por encima del clasificador aleatorio (línea diagonal). Esto indica una
                  capacidad de discriminación moderada, coherente con el tamaño muestral actual y
                  con la sutileza de las diferencias estructurales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔹 Síntesis de hallazgos del estudio */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Síntesis de hallazgos: ¿qué nos dice este panel?
          </h2>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1.5">
            <li>
              Los participantes que recibieron el{" "}
              <span className="font-semibold">Método Madre Canguro</span> muestran{" "}
              <span className="font-semibold">tendencias estructurales favorables</span> en corteza
              visual (mayor grosor, volumen y área relativa en cuneus y corteza pericalcarina),
              después de ajustar por eTIV y covariables clínicas.
            </li>
            <li>
              El <span className="font-semibold">clustering del cuerpo calloso</span> revela
              patrones latentes en la organización de la sustancia blanca que, aunque presentan
              solapamiento, tienden a agrupar de forma diferencial a MMC y controles, sugiriendo
              huellas sutiles del tipo de cuidado neonatal.
            </li>
            <li>
              Los modelos supervisados basados en{" "}
              <span className="font-semibold">radiomics T1</span> alcanzan un desempeño moderado
              (AUC ≈ 0.64) para distinguir MMC de controles, indicando que los descriptores de
              imagen contienen información relevante, pero aún insuficiente para uso clínico
              individual.
            </li>
            <li>
              En conjunto, los hallazgos apoyan la hipótesis de que el Método Madre Canguro puede
              tener un <span className="font-semibold">impacto estructural de largo plazo</span>
              sobre el cerebro en la adultez temprana, coherente con la evidencia clínica y
              neuropsicológica del proyecto.
            </li>
          </ul>
        </section>

        {/* 🔹 Nota ética y uso responsable */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Nota ética y uso responsable de la herramienta
          </h2>
          <p className="text-xs text-slate-600">
            Esta interfaz se ha desarrollado con fines exclusivamente académicos y de investigación
            dentro del proyecto de grado de la Maestría en Inteligencia Artificial de la
            Universidad de los Andes, en colaboración con la Fundación Canguro.
          </p>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
            <li>
              Los resultados mostrados resumen análisis agregados;{" "}
              <span className="font-semibold">no permiten identificar pacientes individuales</span>.
            </li>
            <li>
              La herramienta de inferencia no constituye un{" "}
              <span className="font-semibold">dispositivo médico ni un apoyo diagnóstico</span>; sus
              salidas deben interpretarse únicamente en el contexto de investigación.
            </li>
            <li>
              El acceso a los datos originales está restringido y regulado por los comités de ética
              de las instituciones involucradas. Esta página no permite descargar bases de datos ni
              información sensible.
            </li>
          </ul>
          <p className="text-[11px] text-slate-500">
            Cualquier uso futuro de estos modelos fuera del contexto académico deberá considerar
            cuidadosamente aspectos éticos, regulatorios y clínicos, así como la participación
            activa de los equipos médicos y de la Fundación Canguro.
          </p>
        </section>
      </div>
    </div>
  );
}
