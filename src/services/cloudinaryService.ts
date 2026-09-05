/**
 * Cloudinary Image Upload Utility Service
 * Uploads all reporter avatars, news cover photos, editor inline images, and ad banners
 * directly to Cloudinary storage with automatic client-side compression and resilient fallback.
 */

// Helper to compress and resize images client-side before upload to prevent quota/payload overflow
export async function compressImageClientSide(
  dataUrlOrFile: string | File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const handleLoadedImage = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : img.src);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onload = handleLoadedImage;
      img.onerror = () => {
        if (typeof dataUrlOrFile === 'string') {
          resolve(dataUrlOrFile);
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(dataUrlOrFile);
        }
      };

      if (typeof dataUrlOrFile === 'string') {
        img.src = dataUrlOrFile;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(dataUrlOrFile);
      }
    } catch {
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
    }
  });
}

export async function uploadImageToCloudinary(
  imageInput: File | string,
  folder = 'the_recap_media',
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.78
): Promise<string> {
  // If it's already an http/https Cloudinary URL or remote CDN image, return immediately
  if (typeof imageInput === 'string' && (imageInput.startsWith('http://') || imageInput.startsWith('https://'))) {
    if (imageInput.includes('cloudinary.com') || imageInput.includes('images.unsplash.com')) {
      return imageInput;
    }
  }

  // Compress image client-side before sending to prevent heavy network payloads & timeouts
  let compressedBase64 = '';
  try {
    compressedBase64 = await compressImageClientSide(imageInput, maxWidth, maxHeight, quality);
  } catch {
    if (typeof imageInput === 'string') compressedBase64 = imageInput;
  }

  if (!compressedBase64) {
    throw new Error('কোনো বৈধ ছবি পাওয়া যায়নি!');
  }

  // Attempt Cloudinary upload with a strict 10s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/upload-cloudinary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: compressedBase64,
        folder,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        return data.url;
      }
    }
  } catch (netErr) {
    console.warn('Cloudinary upload timed out or encountered network issue, falling back to optimized local storage:', netErr);
  }

  // Safe fallback: Return the compact compressed data URL (<150KB) so the user's action never fails or halts loading
  return compressedBase64;
}

export async function checkCloudinaryConnection(): Promise<{
  success: boolean;
  cloudName?: string;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('/api/cloudinary-status', { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, cloudName: data.cloudName };
    }
    return { success: false, error: data.error || 'Cloudinary connection failed' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error connecting to Cloudinary' };
  }
}
