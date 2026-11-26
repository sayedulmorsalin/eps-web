import { getSupabaseClient } from './client';

/**
 * Uploads a product image to Supabase Storage (product-images bucket).
 */
export async function uploadProductImage(file: File, productId: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const ext = file.name.split('.').pop() || 'png';
  const filePath = `products/${productId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('Failed to upload product image to Supabase Storage:', error);
    return null;
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Uploads a customer profile image to Supabase Storage.
 */
export async function uploadProfileImage(file: File, userId: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const ext = file.name.split('.').pop() || 'png';
  const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('Failed to upload profile image to Supabase Storage:', error);
    return null;
  }

  const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
  return data.publicUrl;
}
