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
            En esta página se presentan de forma resumida los resultados principales del estudio a
            20 años: descripción de la cohorte, comparación entre grupos (MMC vs controles y REF) y
            patrones identificados mediante clustering y análisis estadístico sobre las estructuras
            cerebrales y los desenlaces clínicos.
          </p>
        </section>

        {/* 🔹 Tarjetas de KPIs principales */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Total participantes
            </span>
            <span className="text-2xl font-semibold text-slate-900">400</span>
            <span className="text-[11px] text-slate-500">
              Cohorte original incluida en el seguimiento a 20 años.
            </span>
          </div>

          {/* KPI 2 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Grupo MMC
            </span>
            <span className="text-2xl font-semibold text-slate-900">200</span>
            <span className="text-[11px] text-slate-500">
              Participantes en los que se implementó el Método Madre Canguro.
            </span>
          </div>

          {/* KPI 3 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Grupo Control + REF
            </span>
            <span className="text-2xl font-semibold text-slate-900">200</span>
            <span className="text-[11px] text-slate-500">
              Participantes manejados con cuidado convencional o cuidado de referencia.
            </span>
          </div>

          {/* KPI 4 */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Tiempo de seguimiento
            </span>
            <span className="text-2xl font-semibold text-slate-900">20 años</span>
            <span className="text-[11px] text-slate-500">
              Evaluación estructural y funcional en la adultez temprana.
            </span>
          </div>
        </section>

        {/* 🔹 Distribución de la cohorte por grupo */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Distribución de la cohorte por grupo
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Este gráfico resume la proporción de participantes en cada grupo de estudio. Por ahora
              se muestran valores de ejemplo; en la versión final se reemplazarán con los
              porcentajes calculados a partir de la base de datos consolidada.
            </p>
          </div>

          {/* Barras horizontales tipo "gráfico" simple */}
          <div className="space-y-3 mt-2">
            {/* MMC */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-700">MMC</span>
                <span className="text-xs text-slate-500">50%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "50%", backgroundColor: KMC_BLUE }}
                />
              </div>
            </div>

            {/* Control */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-700">Control</span>
                <span className="text-xs text-slate-500">30%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-slate-400" style={{ width: "30%" }} />
              </div>
            </div>

            {/* REF */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-700">REF</span>
                <span className="text-xs text-slate-500">20%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-slate-300" style={{ width: "20%" }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            En el informe escrito se detalla cómo se definieron estos grupos, los criterios de
            inclusión y las diferencias en el seguimiento clínico entre el Método Madre Canguro, el
            cuidado convencional (Control) y el cuidado de referencia (REF).
          </p>
        </section>

        {/* 🔹 Clustering exploratorio en cuerpo calloso (FreeSurfer) */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Clustering exploratorio en cuerpo calloso
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              A partir de las métricas estructurales del cuerpo calloso obtenidas con FreeSurfer se
              aplicaron métodos de clustering para identificar patrones latentes en la cohorte, sin
              usar la etiqueta de grupo (MMC vs Control) durante el entrenamiento. La figura muestra
              la distribución de los sujetos en un espacio de características reducido, coloreados
              según el clúster asignado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Imagen del clustering */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src="/images/clustering_cuerpo_calloso.png"
                alt="Dispersión de sujetos en el espacio de características, coloreados por clúster K-means, con índice de silueta aproximado de 0.57."
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
                  moderada entre grupos latentes en las métricas del cuerpo calloso.
                </p>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  <li>Se observan dos grupos relativamente compactos en el espacio reducido.</li>
                  <li>
                    Algunos puntos se ubican en zonas intermedias, reflejando solapamiento entre
                    los patrones estructurales.
                  </li>
                  <li>
                    El análisis es completamente no supervisado; las etiquetas clínicas se utilizan
                    solo en la etapa de interpretación para comparar la distribución de MMC y
                    controles en cada clúster.
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Estos resultados son exploratorios y no permiten una separación perfecta entre MMC
                y controles, pero apoyan la hipótesis de que el Método Madre Canguro deja huellas
                sutiles en la organización estructural de la sustancia blanca que pueden ser
                aprovechadas en modelos predictivos más avanzados.
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
              grosor cortical y volumen gris en regiones occipitales y temporales (corteza
              pericalcarina, cuneus, lingual, lateral occipital y fusiforme), comparando
              participantes con Método Madre Canguro (MMC) y controles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Imagen de las comparaciones FreeSurfer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src="/images/freesurfer_corteza_visual.png"
                alt="Mapa de efectos β MMC vs Control en corteza visual (ThickAvg, SurfArea, GrayVol, GrayVol/eTIV) estimados con modelos OLS."
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
                    Regiones: pericalcarina, cuneus, lingual, lateral occipital, fusiforme.
                  </li>
                  <li>
                    Métricas: grosor medio (ThickAvg), área de superficie (SurfArea), volumen gris
                    (GrayVol) y volumen gris normalizado (GrayVol/eTIV).
                  </li>
                  <li>
                    Modelos ajustados por eTIV, sexo, edad gestacional y otras covariables
                    clínicas.
                  </li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Tendencias preliminares</h3>
                <p className="text-xs text-slate-600">
                  Se observan <span className="font-semibold">tendencias a mayores valores de grosor,
                  volumen y área</span> en algunas regiones de la corteza visual en el grupo MMC
                  frente a los controles, especialmente en cuneus y zonas pericalcarinas. Estas
                  diferencias son sutiles y de tamaño de efecto moderado, por lo que requieren
                  validación con muestras más grandes.
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Esta sección resume de forma visual los análisis estructurales con FreeSurfer que se
                detallan en el informe escrito. La interpretación de estos hallazgos se hace siempre
                en conjunto con los desenlaces clínicos y neuropsicológicos del estudio.
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
              pipeline supervisado para predecir pertenencia al grupo MMC o Control a partir de
              descriptores radiológicos cuantitativos extraídos de imágenes T1.
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
                  capacidad de discriminación moderada, coherente con el tamaño muestral actual.
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
              A pesar de partir de una cohorte de{" "}
              <span className="font-semibold">alto riesgo biológico</span>, los participantes con
              Método Madre Canguro (MMC) muestran{" "}
              <span className="font-semibold">tendencias estructurales favorables</span> en corteza
              visual (mayor grosor, volumen y área relativa en regiones como cuneus y corteza
              pericalcarina).
            </li>
            <li>
              El <span className="font-semibold">clustering del cuerpo calloso</span> revela
              patrones latentes en la organización estructural que, aunque presentan solapamiento,
              tienden a agrupar de forma diferencial a MMC y controles, sugiriendo huellas sutiles
              del tipo de cuidado neonatal en la arquitectura de la sustancia blanca.
            </li>
            <li>
              Los modelos supervisados basados en{" "}
              <span className="font-semibold">radiomics T1</span> alcanzan un desempeño moderado
              (AUC ≈ 0.64) para distinguir MMC de controles, lo que indica que los descriptores
              cuantitativos de imagen contienen información relevante, pero aún insuficiente para
              uso clínico individual.
            </li>
            <li>
              En conjunto, los resultados apoyan la hipótesis de que el Método Madre Canguro puede
              tener un <span className="font-semibold">impacto estructural de largo plazo</span> sobre
              el cerebro en la adultez temprana, que se refleja en métricas morfométricas y
              radiológicas y merece ser profundizado en futuras fases del proyecto.
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
