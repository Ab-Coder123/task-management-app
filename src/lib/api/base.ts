const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://taskmanager-backend-flax.vercel.app';

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Get token from localStorage auth-storage (Zustand persisted state)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        token = parsed.state?.token || null;
      }
    } catch (e) {
      console.error('Error reading auth token', e);
    }
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.bodyData) {
    config.body = JSON.stringify(options.bodyData);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  // Some backend endpoints return plain text (e.g. "new task added successfully")
  // instead of JSON. Check content-type before parsing to avoid parse errors.
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  // Return raw text cast as T for plain-text responses
  const text = await response.text();
  return text as unknown as T;
}
