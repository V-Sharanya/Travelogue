from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceOut
from app.core.security import get_current_user

router = APIRouter(prefix="/places", tags=["Places"])

@router.post("/", response_model=PlaceOut)
def create_place(
    place: PlaceCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    new_place = Place(**place.dict())
    db.add(new_place)
    db.commit()
    db.refresh(new_place)
    return new_place

@router.get("/", response_model=list[PlaceOut])
def get_places(db: Session = Depends(get_db)):
    return db.query(Place).all()

@router.get("/{place_id}", response_model=PlaceOut)
def get_place(place_id: int, db: Session = Depends(get_db)):
    return db.query(Place).filter(Place.id == place_id).first()
