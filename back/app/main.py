from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import numpy as np
import os
import joblib

app = FastAPI(title="KMC Inference API (Radiomics)")

# Permitir llamadas desde el front local (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta del modelo ya copiado a back/models/elasticnet.pkl
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "elasticnet.pkl")
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
