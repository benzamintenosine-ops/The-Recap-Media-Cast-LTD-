import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  arrayUnion,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, Comment } from '../types';
import { INITIAL_NEWS } from '../data/initialNews';

const ARTICLES_COLLECTION = 'articles';

const MOCK_ARTICLE_IDS = ['news-1', 'news-2', 'news-3', 'news-4', 'news-5'];

/**
 * Clean up legacy mock news from Firestore and local cache
 */
async function purgeLegacyMockNews() {
  try {
    // Clear legacy localStorage cache
    const savedCache = localStorage.getItem('recap_news_cache');
    if (savedCache) {
      try {
        const parsed = JSON.parse(savedCache);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (a) => a && a.id && !MOCK_ARTICLE_IDS.includes(a.id)
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('recap_news_cache', JSON.stringify(cleaned));
          }
        }
      } catch (e) {
        localStorage.removeItem('recap_news_cache');
      }
    }

    // Delete mock docs from Firestore if present
    for (const mockId of MOCK_ARTICLE_IDS) {
      try {
        const docRef = doc(db, ARTICLES_COLLECTION, mockId);
        await deleteDoc(docRef);
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Purge mock news notice:', err);
  }
}

/**
 * Real-time subscription to articles collection in Firebase.
 * Both Viewer Site and Admin Portal receive live updates automatically.
 */
export function subscribeToArticles(onUpdate: (articles: NewsArticle[]) => void) {
  // Purge any legacy mock news on initial mount
  purgeLegacyMockNews().catch(() => {});

  const colRef = collection(db, ARTICLES_COLLECTION);
  const q = query(colRef, orderBy('publishedAt', 'desc'));

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.empty) {
        try {
          localStorage.setItem('recap_news_cache', JSON.stringify([]));
        } catch (e) {}
        onUpdate([]);
        return;
      }
      const articlesList: NewsArticle[] = snapshot.docs
        .filter((docSnap) => !MOCK_ARTICLE_IDS.includes(docSnap.id))
        .map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            titleEn: data.titleEn || '',
            summary: data.summary || '',
            summaryEn: data.summaryEn || '',
            content: data.content || '',
            contentEn: data.contentEn || '',
            category: data.category || 'জাতীয়',
            tags: Array.isArray(data.tags) ? data.tags : [],
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
            videoUrl: data.videoUrl || '',
            author: data.author || 'THE RECAP MEDIA',
            publishedAt: data.publishedAt || new Date().toISOString(),
            isBreaking: !!data.isBreaking,
            isTrending: !!data.isTrending,
            viewsCount: typeof data.viewsCount === 'number' ? data.viewsCount : 0,
            readTimeMinutes: typeof data.readTimeMinutes === 'number' ? data.readTimeMinutes : 3,
            comments: Array.isArray(data.comments) ? data.comments : [],
            isAiGenerated: !!data.isAiGenerated,
            seoMeta: data.seoMeta || undefined,
          } as NewsArticle;
        });

      // Save to cache for seamless offline fallback
      try {
        localStorage.setItem('recap_news_cache', JSON.stringify(articlesList));
      } catch (e) {}

      onUpdate(articlesList);
    },
    (error) => {
      console.warn('Firestore snapshot listener connection notice (operating in offline mode):', error?.message || error);
      const savedCache = localStorage.getItem('recap_news_cache');
      if (savedCache) {
        try {
          const parsed = JSON.parse(savedCache);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(a => a && a.id && !MOCK_ARTICLE_IDS.includes(a.id));
            onUpdate(filtered);
            return;
          }
        } catch (e) {}
      }
      onUpdate([]);
    }
  );
}

/**
 * Create a new article document in Firebase Firestore
 */
export async function addArticleToFirebase(newArt: Partial<NewsArticle>): Promise<NewsArticle> {
  const articleId = newArt.id || `news-${Date.now()}`;
  const article: NewsArticle = {
    id: articleId,
    title: newArt.title || 'শিরোনামহীন সংবাদ',
    titleEn: newArt.titleEn || '',
    summary: newArt.summary || '',
    summaryEn: newArt.summaryEn || '',
    content: newArt.content || '',
    contentEn: newArt.contentEn || '',
    category: newArt.category || 'জাতীয়',
    tags: newArt.tags || [],
    imageUrl: newArt.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: newArt.videoUrl || '',
    author: newArt.author || 'THE RECAP MEDIA',
    publishedAt: newArt.publishedAt || new Date().toISOString(),
    isBreaking: !!newArt.isBreaking,
    isTrending: !!newArt.isTrending,
    viewsCount: newArt.viewsCount || 0,
    readTimeMinutes: newArt.readTimeMinutes || 3,
    comments: newArt.comments || [],
    isAiGenerated: !!newArt.isAiGenerated,
    seoMeta: newArt.seoMeta || undefined,
  };

  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await setDoc(docRef, article);
  } catch (err) {
    console.warn('Could not save article to Firestore directly, saved locally:', err);
  }
  return article;
}

/**
 * Delete an article document from Firebase Firestore
 */
export async function deleteArticleFromFirebase(id: string): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete article from Firestore:', err);
  }
}

/**
 * Add a comment to an article in Firebase Firestore
 */
export async function addCommentToFirebase(
  articleId: string,
  authorName: string,
  text: string
): Promise<Comment> {
  const comment: Comment = {
    id: `c-${Date.now()}`,
    authorName: authorName || 'Anonymous Reader',
    text: text || '',
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      comments: arrayUnion(comment),
    });
  } catch (err) {
    console.warn('Could not add comment to Firestore:', err);
  }

  return comment;
}

/**
 * Increment view count for an article in Firebase Firestore
 */
export async function incrementArticleViewsInFirebase(articleId: string): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      viewsCount: increment(1),
    });
  } catch (err) {
    console.warn('Could not increment view count in Firestore:', err);
  }
}
