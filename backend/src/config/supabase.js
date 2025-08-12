import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Storage configuration
const STORAGE_ENDPOINT = 'https://zxetkysuahfjolouwpgh.storage.supabase.co/storage/v1/s3';
const STORAGE_REGION = 'ap-southeast-1';
const STORAGE_BUCKET = 'invoice-generator'; // Default bucket name

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Not Set');
  console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Not Set');
  console.error('   Please check your .env file');
}

// Create Supabase client lazily when needed
let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not set. Please check your .env file.');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      storage: {
        // Custom storage configuration
        endpoint: STORAGE_ENDPOINT,
        region: STORAGE_REGION
      }
    });
  }
  return supabase;
};

// Storage utility functions
export const uploadImage = async (file, folder, fileName) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(`${folder}/${fileName}`, file, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
};

export const getImageUrl = (folder, fileName) => {
  try {
    const client = getSupabaseClient();
    const { data } = client.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`${folder}/${fileName}`);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Supabase getImageUrl error:', error);
    throw error;
  }
};

export const deleteImage = async (folder, fileName) => {
  try {
    const client = getSupabaseClient();
    const { error } = await client.storage
      .from(STORAGE_BUCKET)
      .remove([`${folder}/${fileName}`]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
};

export { getSupabaseClient, STORAGE_ENDPOINT, STORAGE_REGION, STORAGE_BUCKET };
