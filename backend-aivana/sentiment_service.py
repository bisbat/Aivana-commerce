from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# โหลด model ครั้งเดียวตอน start
model_name = "phoner45/wangchan-sentiment-thai-text-model"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

class PredictRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(req: PredictRequest):
    inputs = tokenizer(
        req.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_id = logits.argmax(dim=-1).item()
    predicted_label = model.config.id2label[predicted_id]
    probs = torch.softmax(logits, dim=-1).squeeze().cpu().tolist()

    label_probs = {
        model.config.id2label[i]: round(prob, 4)
        for i, prob in enumerate(probs)
    }

    return {
        "label": predicted_label,
        "confidence": label_probs[predicted_label],
        "all_probabilities": label_probs,
    }

@app.get("/health")
def health():
    return { "status": "ok" }