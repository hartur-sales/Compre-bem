import { Platform } from 'react-native';

const servidor =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const API_URL = `${servidor}/api/v1`;

export async function get<T>(endpoint: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${endpoint}`);

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}.`);
  }

  return resposta.json() as Promise<T>;
}

export async function post<T>(
  endpoint: string,
  corpo: unknown
): Promise<T> {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(corpo),
  });

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}.`);
  }

  return resposta.json() as Promise<T>;
}
