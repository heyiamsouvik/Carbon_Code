from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "Salesforce/codegen-2B-multi"

app = FastAPI(title="Code Optimization API")

class OptimizeRequest(BaseModel):
    code: str           # user-provided code
    max_new_tokens: int = 256
    temperature: float = 0.7
    top_p: float = 0.9

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else None
)

@app.post("/optimize")
def optimize_code(req: OptimizeRequest):
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code is required")

    # -------------------------------
    # Step 1: Create prompt for optimization
    # -------------------------------
    prompt = f"""Refactor and optimize the following code. Improve efficiency, readability, and maintain functionality.

Original code:
{req.code}

Optimized code:"""

    # -------------------------------
    # Step 2: Tokenize input
    # -------------------------------
    tokenized_input = tokenizer(
        prompt,
        return_tensors="pt"
    ).to(model.device)

    input_ids = tokenized_input["input_ids"]
    attention_mask = tokenized_input["attention_mask"]

    # -------------------------------
    # Step 3: Generate optimized code
    # -------------------------------
    with torch.no_grad():
        outputs = model.generate(
            **tokenized_input,
            max_new_tokens=req.max_new_tokens,
            temperature=req.temperature,
            top_p=req.top_p,
            do_sample=True
        )

    optimized_code = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {
        "original_code": req.code,
        "optimized_code": optimized_code,
        "input_tokens": input_ids.tolist(),
        "attention_mask": attention_mask.tolist()
    }
