from fastapi import FastAPI
app = FastAPI(title="Sistema de Gestión de Minimercado API")


# Incluir los controladores 
app.include_router(inventory_controller.router)

@app.get("/")
def read_root():
    return {"message": "API funcionando"}