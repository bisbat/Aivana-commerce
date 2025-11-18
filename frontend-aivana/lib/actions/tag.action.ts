import { Tag } from "../types/tag";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fetch all categories
export async function getAllTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always get fresh data
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  export async function createTag(name: string, description: string): Promise<Tag> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create tag: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }