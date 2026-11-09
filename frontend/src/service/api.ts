import { Platform } from 'react-native';

const servidor =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://localhost:8080';

export const API_URL = `${servidor}/api/v1`;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function obterMensagemErro(
  corpo: unknown,
  status: number
): string {
  if (
    typeof corpo === 'object' &&
    corpo !== null &&
    'mensagem' in corpo &&
    typeof corpo.mensagem === 'string'
  ) {
    return corpo.mensagem;
  }

  if (
    typeof corpo === 'object' &&
    corpo !== null &&
    'message' in corpo &&
    typeof corpo.message === 'string'
  ) {
    return corpo.message;
  }

  if (status === 404) {
    return 'Produto não encontrado.';
  }

  if (status === 400) {
    return 'Os dados informados são inválidos.';
  }

  return `Erro no servidor. Código: ${status}.`;
}

async function requisitar<T>(
  endpoint: string,
  opcoes?: RequestInit
): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${endpoint}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...opcoes?.headers,
      },
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o servidor está ligado.'
    );
  }

  const texto = await resposta.text();

  let corpo: unknown = undefined;

  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = texto;
    }
  }

  if (!resposta.ok) {
    throw new ApiError(
      resposta.status,
      obterMensagemErro(corpo, resposta.status)
    );
  }

  return corpo as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return requisitar<T>(endpoint, {
    method: 'GET',
  });
}

export async function post<T>(
  endpoint: string,
  corpo: unknown
): Promise<T> {
  return requisitar<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(corpo),
  });
}

export async function put<T>(
  endpoint: string,
  corpo: unknown
): Promise<T> {
  return requisitar<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(corpo),
  });
}

export async function del(endpoint: string): Promise<void> {
  await requisitar<void>(endpoint, {
    method: 'DELETE',
  });
}
