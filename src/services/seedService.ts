import { collection, getDocs, setDoc, doc, serverTimestamp, writeBatch, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BIKES } from '../constants';
import { Bike } from '../types';

export const seedBikes = async () => {
  try {
    const bikesRef = collection(db, 'bikes');
    const snapshot = await getDocs(bikesRef);
    
    // Create a batch for efficiency
    const batch = writeBatch(db);
    
    // Delete existing bikes first to ensure fresh seed
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Add new bikes from BIKES constant
    BIKES.forEach((bike, index) => {
      const bikeRef = doc(db, 'bikes', bike.id);
      batch.set(bikeRef, {
        ...bike,
        order: index,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
