export const SERVIDOR_URL = "http://localhost:8080";
const API_URL = `${SERVIDOR_URL}/api/v1`;

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<T>;
}
