/**
 * Cloudinary Image Upload Utility Service
 * Uploads all reporter avatars, news cover photos, editor inline images, and ad banners
 * directly to Cloudinary storage.
 */

export async function uploadImageToCloudinary(
  imageInput: File | string,
  folder = 'the_recap_media'
): Promise<string> {
  let base64Data = '';

  if (typeof imageInput === 'string') {
    // If it's already an http/https Cloudinary URL or web image, return as is if already remote
    if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
      if (imageInput.includes('cloudinary.com')) {
        return imageInput;
      }
    }
    base64Data = imageInput;
  } else if (imageInput instanceof File) {
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageInput);
    });
  }

  if (!base64Data) {
    throw new Error('কোনো বৈধ ছবি পাওয়া যায়নি!');
  }

  const response = await fetch('/api/upload-cloudinary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Data,
      folder,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.url) {
    throw new Error(data.error || 'Cloudinary-এ ছবি আপলোড ব্যর্থ হয়েছে!');
  }

  return data.url;
}

export async function checkCloudinaryConnection(): Promise<{
  success: boolean;
  cloudName?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/cloudinary-status');
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, cloudName: data.cloudName };
    }
    return { success: false, error: data.error || 'Cloudinary connection failed' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error connecting to Cloudinary' };
  }
}
