from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import numpy as np
import os
import joblib
import tempfile # NUEVO 
from radiomics import featureextractor  # <-- NUEVO

# Limitar número de threads de librerías numéricas (útil en servidores)
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")


app = FastAPI(title="KMC Inference API (Radiomics)")

# Permitir llamadas desde el front local (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta del modelo ya copiado a back/app/models/elasticnet.pkl
BASE_DIR = os.path.dirname(__file__)  # /app/app en Railway
MODEL_PATH = os.path.join(BASE_DIR, "models", "elasticnet.pkl")
_model = None


# === FEATURES QUE ESPERA EL MODELO (42 radiomics) ===
RADIOMICS_FEATURES: List[str] = [
    "original_firstorder_10Percentile",
    "original_firstorder_90Percentile",
    "original_firstorder_Energy",
    "original_firstorder_Entropy",
    "original_firstorder_InterquartileRange",
    "original_firstorder_Kurtosis",
    "original_firstorder_Maximum",
    "original_firstorder_MeanAbsoluteDeviation",
    "original_firstorder_Mean",
    "original_firstorder_Median",
    "original_firstorder_Minimum",
    "original_firstorder_Range",
    "original_firstorder_RobustMeanAbsoluteDeviation",
    "original_firstorder_RootMeanSquared",
    "original_firstorder_Skewness",
    "original_firstorder_TotalEnergy",
    "original_firstorder_Uniformity",
    "original_firstorder_Variance",
    "original_glcm_Autocorrelation",
    "original_glcm_ClusterProminence",
    "original_glcm_ClusterShade",
    "original_glcm_ClusterTendency",
    "original_glcm_Contrast",
    "original_glcm_Correlation",
    "original_glcm_DifferenceAverage",
    "original_glcm_DifferenceEntropy",
    "original_glcm_DifferenceVariance",
    "original_glcm_Id",
    "original_glcm_Idm",
    "original_glcm_Idmn",
    "original_glcm_Idn",
    "original_glcm_Imc1",
    "original_glcm_Imc2",
    "original_glcm_InverseVariance",
    "original_glcm_JointAverage",
    "original_glcm_JointEnergy",
    "original_glcm_JointEntropy",
    "original_glcm_MCC",
    "original_glcm_MaximumProbability",
    "original_glcm_SumAverage",
    "original_glcm_SumEntropy",
    "original_glcm_SumSquares",
]

##### NUEVO
def extract_radiomics_from_nii(nii_path: str, mask_path: str) -> Dict[str, float]:
    """
    Extrae las 42 características radiómicas definidas en RADIOMICS_FEATURES
    a partir de una imagen T1 (.nii / .nii.gz) y su máscara binaria,
    utilizando PyRadiomics.

    Parámetros
    ----------
    nii_path : str
        Ruta al volumen T1 estructural en formato NIfTI.
    mask_path : str
        Ruta al volumen de máscara binaria (0/1) en formato NIfTI.

    Retorna
    -------
    Dict[str, float]
        Diccionario {nombre_feature: valor_float} sólo con las 42 features
        que espera el modelo de ElasticNet.
    """

    # 1. Crear extractor radiomics (puedes ajustar parámetros con un YAML si lo desean)
    extractor = featureextractor.RadiomicsFeatureExtractor()

    # Opcional: puedes desactivar features que no uses, pero como luego filtramos
    # por RADIOMICS_FEATURES, no es estrictamente necesario.

    # 2. Ejecutar extracción sobre imagen + máscara
    result = extractor.execute(nii_path, mask_path)
    # result es un dict con muchas claves:
    # - diagnostics_...
    # - original_firstorder_...
    # - original_glcm_...
    # etc.

    # 3. Filtrar sólo las 42 features que usa el clasificador
    features: Dict[str, float] = {}
    missing = []

    for feat in RADIOMICS_FEATURES:
        if feat not in result:
            missing.append(feat)
        else:
            try:
                features[feat] = float(result[feat])
            except Exception:
                # Si hay algún problema de casteo, lo registramos como missing
                missing.append(feat)

    if missing:
        # Aquí puedes elegir: o lanzar error duro, o loggear y seguir.
        # Para el proyecto de grado prefiero ser explícito.
        raise RuntimeError(
            f"Faltan {len(missing)} características radiomics en el resultado de PyRadiomics: {missing}"
        )

    return features



def parse_kv_text(text: str) -> Dict[str, str]:
    """
    Parsea un archivo .txt en formato:
    clave=valor
    clave2=valor2
    """
    data: Dict[str, str] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if "=" not in line:
            raise HTTPException(status_code=400, detail=f"Línea inválida: '{line}' (usa clave=valor)")
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip()
        if not k:
            raise HTTPException(status_code=400, detail=f"Clave vacía en línea: '{line}'")
        data[k] = v
    return data


def vectorize_radiomics(sample: Dict[str, str]) -> np.ndarray:
    """
    Construye el vector de 42 features en el ORDEN que espera el modelo.
    Todas las features se leen como float.
    """
    missing = [k for k in RADIOMICS_FEATURES if k not in sample]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan {len(missing)} claves radiomics en el archivo .txt: {missing}",
        )

    values: List[float] = []
    for feat in RADIOMICS_FEATURES:
        raw_val = sample[feat]
        try:
            val = float(raw_val)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Valor inválido para '{feat}': '{raw_val}' (debe ser numérico)",
            )
        values.append(val)

    x = np.array([values], dtype=float)  # shape (1, 42)
    return x


def load_model():
    """
    Carga el Pipeline de sklearn con StandardScaler + LogisticRegression ElasticNet.
    """
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f"Modelo no encontrado en {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model

####### DEFINING ENDPOINTS ########

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint de inferencia:
    - Recibe un archivo .txt con las 42 features radiomics en formato clave=valor.
    - Devuelve clase predicha y probabilidad de REF.
    """
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Sube un archivo con extensión .txt")

    content_bytes = await file.read()
    try:
        content = content_bytes.decode("utf-8", errors="ignore")
    except Exception:
        raise HTTPException(status_code=400, detail="No se pudo decodificar el archivo como texto")

    # 1) Parsear clave=valor
    sample = parse_kv_text(content)

    # 2) Vectorizar según el orden de columnas que usó el modelo
    X = vectorize_radiomics(sample)

    # 3) Cargar modelo real
    model = load_model()

    # 4) Inferencia
    try:
        # Clases del modelo: [0, 1] donde 1 = REF (según su definición)
        proba_ref = None
        if hasattr(model, "predict_proba"):
            proba_ref = float(model.predict_proba(X)[0, 1])
        pred_int = int(model.predict(X)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de inferencia en el modelo: {e}")

    predicted_class = "REF" if pred_int == 1 else "MMC_or_Control"

    return {
        "predicted_class": predicted_class,
        "probability_ref": round(proba_ref, 3) if proba_ref is not None else None,
        "raw_class_int": pred_int,
        "model_type": "radiomics_elasticnet_logreg",
    }

###### NUEVO
@app.post("/predict_from_nii")
async def predict_from_nii(
    image: UploadFile = File(..., description="Archivo .nii de la imagen T1"),
    mask: UploadFile = File(..., description="Archivo .nii de la máscara"),
):
    """
    Endpoint alterno de inferencia:
    - Recibe imagen T1 (.nii/.nii.gz) y su máscara.
    - Extrae las 42 características radiomics.
    - Reutiliza el mismo modelo elasticnet.pkl.
    """

    valid_exts = (".nii", ".nii.gz")

    # 1) Validar extensiones
    if not image.filename.endswith(valid_exts):
        raise HTTPException(
            status_code=400,
            detail="El archivo de imagen debe ser .nii o .nii.gz",
        )
    if not mask.filename.endswith(valid_exts):
        raise HTTPException(
            status_code=400,
            detail="El archivo de máscara debe ser .nii o .nii.gz",
        )

    # 2) Guardar archivos temporalmente en disco
    with tempfile.TemporaryDirectory() as tmpdir:
        image_path = os.path.join(tmpdir, image.filename)
        mask_path = os.path.join(tmpdir, mask.filename)

        with open(image_path, "wb") as f:
            f.write(await image.read())
        with open(mask_path, "wb") as f:
            f.write(await mask.read())

        # 3) Extraer features numéricas desde .nii + máscara
        numeric_features = extract_radiomics_from_nii(image_path, mask_path)

        # 4) Convertir a dict de strings para reutilizar vectorize_radiomics
        sample_str: Dict[str, str] = {
            k: str(numeric_features[k]) for k in RADIOMICS_FEATURES
        }

        # 5) Vectorizar igual que con el .txt
        X = vectorize_radiomics(sample_str)

        # 6) Cargar modelo y hacer inferencia
        model = load_model()
        try:
            proba_ref = None
            if hasattr(model, "predict_proba"):
                proba_ref = float(model.predict_proba(X)[0, 1])
            pred_int = int(model.predict(X)[0])
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error de inferencia en el modelo: {e}",
            )

    predicted_class = "REF" if pred_int == 1 else "MMC_or_Control"

    return {
        "predicted_class": predicted_class,
        "probability_ref": round(proba_ref, 3) if proba_ref is not None else None,
        "raw_class_int": pred_int,
        "model_type": "radiomics_elasticnet_logreg_from_nii",
    }

