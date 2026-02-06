from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import inventory_controller

app = FastAPI(
    title="Sistema de Gestión de Minimercado API",
    description="Backend para la gestión de inventario, ventas y caja [cite: 49]",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Incluir los controladores 
app.include_router(inventory_controller.router)

@app.get("/")
def read_root():
    return {"message": "API de Minimercado funcionando correctamente"}