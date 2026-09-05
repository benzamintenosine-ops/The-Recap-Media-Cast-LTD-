import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  WriterProfile,
  ManagerProfile,
  AdminProfile,
  CategoryConfig,
  WithdrawalRequest,
  SystemNotification,
  UserProfile
} from '../types';

// ==================== WRITERS (প্রতিবেদকবৃন্দ) ====================
const WRITERS_COLLECTION = 'writers';

export function subscribeToWriters(onUpdate: (writers: WriterProfile[]) => void) {
  const colRef = collection(db, WRITERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const writersList: WriterProfile[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          postOffice: data.postOffice || '',
          postCode: data.postCode || '',
          thana: data.thana || '',
          district: data.district || '',
          division: data.division || '',
          nidNumber: data.nidNumber || '',
          mobile: data.mobile || '',
          age: typeof data.age === 'number' ? data.age : 25,
          avatarUrl: data.avatarUrl || '',
          secretCodeUsed: data.secretCodeUsed || '',
          managerId: data.managerId || '',
          managerName: data.managerName || '',
          status: data.status || 'approved',
          createdAt: data.createdAt || new Date().toISOString(),
          isBanned: !!data.isBanned,
          isRestricted: !!data.isRestricted,
          postLimitPerDay: typeof data.postLimitPerDay === 'number' ? data.postLimitPerDay : undefined,
          rejectionReason: data.rejectionReason || ''
        };
      });

      // Update cache
      try {
        localStorage.setItem('recap_writers', JSON.stringify(writersList));
      } catch (e) {}

      onUpdate(writersList);
    },
    (error) => {
      console.warn('Writers subscription note:', error?.message || error);
      try {
        const cached = localStorage.getItem('recap_writers');
        if (cached) onUpdate(JSON.parse(cached));
      } catch (e) {}
    }
  );
}

export async function saveWriterToFirebase(writer: WriterProfile): Promise<void> {
  try {
    const docRef = doc(db, WRITERS_COLLECTION, writer.id);
    await setDoc(docRef, writer, { merge: true });
  } catch (err) {
    console.warn('Could not save writer to Firestore:', err);
  }
}

export async function deleteWriterFromFirebase(writerId: string): Promise<void> {
  try {
    const docRef = doc(db, WRITERS_COLLECTION, writerId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete writer from Firestore:', err);
  }
}

export async function updateWriterInFirebase(writerId: string, updates: Partial<WriterProfile>): Promise<void> {
  try {
    const docRef = doc(db, WRITERS_COLLECTION, writerId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Could not update writer in Firestore:', err);
  }
}

// ==================== MANAGERS (ব্যবস্থাপকবৃন্দ) ====================
const MANAGERS_COLLECTION = 'managers';

export function subscribeToManagers(onUpdate: (managers: ManagerProfile[]) => void) {
  const colRef = collection(db, MANAGERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const managersList: ManagerProfile[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          avatarUrl: data.avatarUrl || '',
          secretCodeUsed: data.secretCodeUsed || '',
          referralCode: data.referralCode || '',
          maxReportersLimit: typeof data.maxReportersLimit === 'number' ? data.maxReportersLimit : 10,
          createdAt: data.createdAt || new Date().toISOString(),
          address: data.address || '',
          designation: data.designation || '',
          age: data.age || 30
        } as ManagerProfile;
      });

      try {
        localStorage.setItem('recap_managers', JSON.stringify(managersList));
      } catch (e) {}

      onUpdate(managersList);
    },
    (error) => {
      console.warn('Managers subscription note:', error?.message || error);
      try {
        const cached = localStorage.getItem('recap_managers');
        if (cached) onUpdate(JSON.parse(cached));
      } catch (e) {}
    }
  );
}

export async function saveManagerToFirebase(manager: ManagerProfile): Promise<void> {
  try {
    const docRef = doc(db, MANAGERS_COLLECTION, manager.id);
    await setDoc(docRef, manager, { merge: true });
  } catch (err) {
    console.warn('Could not save manager to Firestore:', err);
  }
}

export async function deleteManagerFromFirebase(managerId: string): Promise<void> {
  try {
    const docRef = doc(db, MANAGERS_COLLECTION, managerId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete manager from Firestore:', err);
  }
}

export async function updateManagerInFirebase(managerId: string, updates: Partial<ManagerProfile>): Promise<void> {
  try {
    const docRef = doc(db, MANAGERS_COLLECTION, managerId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Could not update manager in Firestore:', err);
  }
}

// ==================== CATEGORIES (সংবাদের ক্যাটাগরি) ====================
const SETTINGS_COLLECTION = 'settings';
const CATEGORIES_DOC = 'categories_list';

export function subscribeToCategories(onUpdate: (categories: CategoryConfig[]) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          try {
            localStorage.setItem('recap_categories', JSON.stringify(data.items));
          } catch (e) {}
          onUpdate(data.items);
        }
      }
    },
    (error) => {
      console.warn('Categories subscription note:', error?.message || error);
    }
  );
}

export async function saveCategoriesToFirebase(categories: CategoryConfig[]): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    await setDoc(docRef, { items: categories }, { merge: true });
  } catch (err) {
    console.warn('Could not save categories to Firestore:', err);
  }
}

// ==================== WITHDRAWALS (টাকা উত্তোলন রিকোয়েস্ট) ====================
const WITHDRAWALS_COLLECTION = 'withdrawals';

export function subscribeToWithdrawals(onUpdate: (withdrawals: WithdrawalRequest[]) => void) {
  const colRef = collection(db, WITHDRAWALS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WithdrawalRequest[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          writerId: data.writerId || '',
          writerName: data.writerName || '',
          writerMobile: data.writerMobile || '',
          paymentMethod: data.paymentMethod || data.gateway || 'bKash',
          accountNumber: data.accountNumber || data.writerMobile || '',
          amount: data.amount || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt || new Date().toISOString(),
          completedAt: data.completedAt || undefined,
          senderAccount: data.senderAccount || undefined,
          transactionId: data.transactionId || undefined
        } as WithdrawalRequest;
      });

      try {
        localStorage.setItem('recap_withdrawals', JSON.stringify(list));
      } catch (e) {}

      onUpdate(list);
    },
    (error) => {
      console.warn('Withdrawals subscription note:', error?.message || error);
    }
  );
}

export async function saveWithdrawalToFirebase(withdrawal: WithdrawalRequest): Promise<void> {
  try {
    const docRef = doc(db, WITHDRAWALS_COLLECTION, withdrawal.id);
    await setDoc(docRef, withdrawal);
  } catch (err) {
    console.warn('Could not save withdrawal to Firestore:', err);
  }
}

export async function updateWithdrawalInFirebase(withdrawalId: string, updates: Partial<WithdrawalRequest>): Promise<void> {
  try {
    const docRef = doc(db, WITHDRAWALS_COLLECTION, withdrawalId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Could not update withdrawal in Firestore:', err);
  }
}

// ==================== NOTIFICATIONS (বিজ্ঞপ্তিসমূহ) ====================
const NOTIFICATIONS_COLLECTION = 'notifications';

export function subscribeToNotifications(onUpdate: (notifications: SystemNotification[]) => void) {
  const colRef = collection(db, NOTIFICATIONS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SystemNotification[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          message: data.message || '',
          senderName: data.senderName || 'The Recap Media Cast Ltd',
          recipientWriterId: data.recipientWriterId || 'ALL',
          createdAt: data.createdAt || new Date().toISOString(),
          read: !!data.read,
          type: data.type || 'general'
        } as SystemNotification;
      });

      try {
        localStorage.setItem('recap_notifications', JSON.stringify(list));
      } catch (e) {}

      onUpdate(list);
    },
    (error) => {
      console.warn('Notifications subscription note:', error?.message || error);
    }
  );
}

export async function saveNotificationToFirebase(notification: SystemNotification): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
    await setDoc(docRef, notification);
  } catch (err) {
    console.warn('Could not save notification to Firestore:', err);
  }
}

// ==================== ADMINS (সুপার অ্যাডমিনবৃন্দ) ====================
const ADMINS_COLLECTION = 'admins';

export function subscribeToAdmins(onUpdate: (admins: AdminProfile[]) => void) {
  const colRef = collection(db, ADMINS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AdminProfile[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          designation: data.designation || 'প্রধান অ্যাডমিন',
          bio: data.bio || '',
          password: data.password || '',
          postOffice: data.postOffice || '',
          postCode: data.postCode || '',
          thana: data.thana || '',
          district: data.district || '',
          division: data.division || '',
          nidNumber: data.nidNumber || '',
          mobile: data.mobile || '',
          age: typeof data.age === 'number' ? data.age : 32,
          avatarUrl: data.avatarUrl || '',
          secretCodeUsed: data.secretCodeUsed || '',
          createdAt: data.createdAt || new Date().toISOString()
        } as AdminProfile;
      });

      try {
        localStorage.setItem('recap_admins', JSON.stringify(list));
      } catch (e) {}

      onUpdate(list);
    },
    (error) => {
      console.warn('Admins subscription note:', error?.message || error);
      try {
        const cached = localStorage.getItem('recap_admins');
        if (cached) onUpdate(JSON.parse(cached));
      } catch (e) {}
    }
  );
}

export async function saveAdminToFirebase(admin: AdminProfile): Promise<void> {
  try {
    const docRef = doc(db, ADMINS_COLLECTION, admin.id);
    await setDoc(docRef, admin, { merge: true });
  } catch (err) {
    console.warn('Could not save admin to Firestore:', err);
  }
}

export async function deleteAdminFromFirebase(adminId: string): Promise<void> {
  try {
    const docRef = doc(db, ADMINS_COLLECTION, adminId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete admin from Firestore:', err);
  }
}

export async function updateAdminInFirebase(adminId: string, updates: Partial<AdminProfile>): Promise<void> {
  try {
    const docRef = doc(db, ADMINS_COLLECTION, adminId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Could not update admin in Firestore:', err);
  }
}

// ==================== READERS (নিয়মিত পাঠকবৃন্দ) ====================
const READERS_COLLECTION = 'readers';

export function subscribeToReaders(onUpdate: (readers: UserProfile[]) => void) {
  const colRef = collection(db, READERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: UserProfile[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          mobile: data.mobile || '',
          role: data.role || 'viewer',
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email || '')}`,
          bio: data.bio || '',
          bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
          offlineSaved: Array.isArray(data.offlineSaved) ? data.offlineSaved : [],
          joinedAt: data.joinedAt || new Date().toISOString()
        } as UserProfile;
      });

      try {
        localStorage.setItem('recap_registered_readers', JSON.stringify(list));
      } catch (e) {}

      onUpdate(list);
    },
    (error) => {
      console.warn('Readers subscription note:', error?.message || error);
      try {
        const cached = localStorage.getItem('recap_registered_readers');
        if (cached) onUpdate(JSON.parse(cached));
      } catch (e) {}
    }
  );
}

export async function saveReaderToFirebase(reader: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, READERS_COLLECTION, reader.id);
    await setDoc(docRef, reader, { merge: true });
  } catch (err) {
    console.warn('Could not save reader to Firestore:', err);
  }
}

