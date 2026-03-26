from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, portfolio

app = FastAPI(
    title= "PrtfolioKKP API",
    description= "API สำหรับระบบรวม portfolio",
    version= "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
    
)

app.include_router(
    auth.router,
    prefix = "/auth",
    tags = ["Authentication"]
)

app.include_router(
    portfolio.router,
    prefix = "/portfolios",
    tags = ["Portfolios"]
)

@app.get("/")
async def root():
    return {"message": "PortfolioKKP API กำลังทำงาน"}