import { 
  collection, 
  doc, 
  getDocs,
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Menu item operations
export const menuService = {
  // Get all menu items for a restaurant
  async getMenuItems(restaurantId) {
    try {
      const q = query(
        collection(db, 'menuItems'),
        where('restaurantId', '==', restaurantId),
        orderBy('category'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },

  // Add new menu item
  async addMenuItem(restaurantId, itemData) {
    try {
      const docRef = await addDoc(collection(db, 'menuItems'), {
        ...itemData,
        restaurantId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  // Update menu item
  async updateMenuItem(itemId, updates) {
    try {
      const itemRef = doc(db, 'menuItems', itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete menu item
  async deleteMenuItem(itemId) {
    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Get restaurant info
  async getRestaurant(restaurantId) {
    try {
      const docRef = doc(db, 'restaurants', restaurantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
  },

  // Update restaurant info
  async updateRestaurant(restaurantId, updates) {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      await updateDoc(restaurantRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  }
};