from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import logisticmodel as lm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up templates directory
templates = Jinja2Templates(directory="templates")

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/scan")
def read_scan(request: Request):
    return templates.TemplateResponse("scanner.html", {"request": request})

class Img(BaseModel):
    imgUrl: str

@app.post("/post")
async def post_image(img: Img):
    result = lm.scan(img.imgUrl)
    return JSONResponse(content=result)

# Optional: Serve static files (e.g., CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")




if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Default to 8000 if PORT is not set
    uvicorn.run(app, host="0.0.0.0", port=port)
