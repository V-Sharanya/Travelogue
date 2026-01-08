from pydantic import BaseModel

class PlaceCreate(BaseModel):
    title: str
    description: str
    location: str
    category: str

class PlaceOut(PlaceCreate):
    id: int

    class Config:
        from_attributes = True
