import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

const SETTINGS_COLLECTION = 'settings';
const SITE_SETTINGS_DOC = 'site_settings';

/**
 * Subscribe to real-time site settings (including ad banners) from Firestore
 */
export function subscribeToSiteSettings(onUpdate: (settings: Partial<SiteSettings>) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          onUpdate(data as Partial<SiteSettings>);
        }
      }
    },
    (error) => {
      console.warn('Firestore settings snapshot listener notice:', error?.message || error);
    }
  );
}

/**
 * Save / Update site settings (and ad banners) to Firestore
 */
export async function saveSiteSettingsToFirebase(newSettings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC);
    await setDoc(docRef, newSettings, { merge: true });
  } catch (err) {
    console.warn('Could not save site settings to Firestore:', err);
  }
}
