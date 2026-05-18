import { collection, serverTimestamp, getDocs, query, orderBy, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import areasData from '../data/areas.json';
import { Area } from '../types';

export const getAreas = async (): Promise<Area[]> => {
  try {
    const areasRef = collection(db, 'areas');
    const q = query(areasRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Area));
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
};

export const clearAreas = async () => {
  try {
    const areasRef = collection(db, 'areas');
    const snapshot = await getDocs(areasRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error clearing areas:', error);
    throw error;
  }
};

const areaMetadata: Record<string, { id: string, keywords: string[] }> = {
  "Canggu": {
    id: "canggu_area",
    keywords: ["Canggu", "Pererenan", "Berawa", "Batu Bolong", "Echo Beach", "Seseh", "Nelayan", "Finns", "Atlas", "Babakan"]
  },
  "Seminyak": {
    id: "seminyak_area",
    keywords: ["Seminyak", "Kerobokan", "Petitenget", "Double Six", "Umalas", "Batu Belig", "Ku De Ta", "Potato Head", "Oberoi"]
  },
  "Kuta": {
    id: "kuta_area",
    keywords: ["Kuta", "Legian", "Beachwalk", "Poppies Lane", "Discovery Mall", "Waterbom", "Dewi Sri", "Sunset Road"]
  },
  "Uluwatu": {
    id: "bukit_uluwatu",
    keywords: ["Uluwatu", "Bingin", "Pecatu", "Padang Padang", "Dreamland", "Melasti", "Ungasan", "Balangan", "Savaya", "Single Fin"]
  },
  "Jimbaran": {
    id: "bukit_jimbaran",
    keywords: ["Jimbaran", "Kedonganan", "Sidewalk", "Four Seasons", "Ayana", "Muaya Beach", "Sumbul"]
  },
  "Sanur": {
    id: "sanur_area",
    keywords: ["Sanur", "Sindhu", "Mertasari", "Sanur Port", "Grand Lucky Sanur", "Danau Tamblingan", "Renon"]
  },
  "Ubud": {
    id: "ubud_area",
    keywords: ["Ubud", "Monkey Forest", "Sayan", "Tegallalang", "Penestanan", "Campuhan", "Kedewatan", "Peliatan"]
  },
  "Denpasar": {
    id: "denpasar_area",
    keywords: ["Denpasar", "Renon", "Sanur Kauh", "Teuku Umar", "Gatot Subroto", "Bajra Sandhi", "Panjer"]
  },
  "Nusa Dua": {
    id: "nusadua_area",
    keywords: ["Nusa Dua", "Tanjung Benoa", "Benoa", "Sawangan", "Bali Collection", "Mulia", "ITDC"]
  }
};

export const seedFinalAreas = async () => {
  try {
    const areasRef = collection(db, 'areas');
    const districtNames = Object.keys(areaMetadata);
    
    for (const name of districtNames) {
      const metadata = areaMetadata[name];
      
      const areaData = {
        id: metadata.id,
        name: name,
        keywords: metadata.keywords
      };
      
      await addDoc(areasRef, areaData);
    }
    return true;
  } catch (error) {
    console.error('Error seeding final areas:', error);
    throw error;
  }
};


