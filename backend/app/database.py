from typing import Dict, List, Optional
from datetime import datetime
import json
from .models import *

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[int, dict] = {}
        self.user_profiles: Dict[int, dict] = {}
        self.next_of_kin: Dict[int, dict] = {}
        self.medical_info: Dict[int, dict] = {}
        self.certificates: Dict[int, dict] = {}
        self.vessels: Dict[int, dict] = {}
        self.crew_assignments: Dict[int, dict] = {}
        self.maintenance_records: Dict[int, dict] = {}
        self.safety_records: Dict[int, dict] = {}
        self.qhse_records: Dict[int, dict] = {}
        
        self._next_id = 1
        
        self._seed_data()
    
    def _get_next_id(self) -> int:
        current_id = self._next_id
        self._next_id += 1
        return current_id
    
    def _seed_data(self):
        demo_vessel = {
            "id": self._get_next_id(),
            "name": "MV Ocean Explorer",
            "imo_number": "IMO1234567",
            "vessel_type": "Container Ship",
            "flag_state": "Panama",
            "gross_tonnage": 50000.0,
            "length": 200.0,
            "beam": 32.0,
            "year_built": 2015,
            "is_active": True,
            "created_at": datetime.now()
        }
        self.vessels[demo_vessel["id"]] = demo_vessel
        
        demo_maintenance = {
            "id": self._get_next_id(),
            "vessel_id": demo_vessel["id"],
            "title": "Engine Oil Change",
            "description": "Routine engine oil change for main engine",
            "maintenance_type": "Routine",
            "scheduled_date": datetime.now().date(),
            "completed_date": None,
            "status": "pending",
            "assigned_to": None,
            "cost": 2500.0,
            "created_by": 1,
            "created_at": datetime.now()
        }
        self.maintenance_records[demo_maintenance["id"]] = demo_maintenance
    
    def create_user(self, user_data: dict) -> dict:
        user_id = self._get_next_id()
        user_data["id"] = user_id
        user_data["created_at"] = datetime.now()
        self.users[user_id] = user_data
        return user_data
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        for user in self.users.values():
            if user["email"] == email:
                return user
        return None
    
    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        return self.users.get(user_id)
    
    def update_user_profile(self, user_id: int, profile_data: dict) -> dict:
        self.user_profiles[user_id] = profile_data
        return profile_data
    
    def get_user_profile(self, user_id: int) -> Optional[dict]:
        return self.user_profiles.get(user_id)
    
    def create_certificate(self, cert_data: dict) -> dict:
        cert_id = self._get_next_id()
        cert_data["id"] = cert_id
        cert_data["created_at"] = datetime.now()
        self.certificates[cert_id] = cert_data
        return cert_data
    
    def get_user_certificates(self, user_id: int) -> List[dict]:
        return [cert for cert in self.certificates.values() if cert["user_id"] == user_id]
    
    def get_vessels(self) -> List[dict]:
        return list(self.vessels.values())
    
    def get_vessel_by_id(self, vessel_id: int) -> Optional[dict]:
        return self.vessels.get(vessel_id)
    
    def create_maintenance_record(self, maintenance_data: dict) -> dict:
        maintenance_id = self._get_next_id()
        maintenance_data["id"] = maintenance_id
        maintenance_data["created_at"] = datetime.now()
        self.maintenance_records[maintenance_id] = maintenance_data
        return maintenance_data
    
    def get_maintenance_records(self, vessel_id: Optional[int] = None) -> List[dict]:
        if vessel_id:
            return [record for record in self.maintenance_records.values() if record["vessel_id"] == vessel_id]
        return list(self.maintenance_records.values())
    
    def create_safety_record(self, safety_data: dict) -> dict:
        safety_id = self._get_next_id()
        safety_data["id"] = safety_id
        safety_data["created_at"] = datetime.now()
        self.safety_records[safety_id] = safety_data
        return safety_data
    
    def get_safety_records(self, vessel_id: Optional[int] = None) -> List[dict]:
        if vessel_id:
            return [record for record in self.safety_records.values() if record["vessel_id"] == vessel_id]
        return list(self.safety_records.values())

db = InMemoryDatabase()
