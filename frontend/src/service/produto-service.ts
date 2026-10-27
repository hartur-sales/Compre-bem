import { get, post } from './api';
import type {
  PaginaProdutos,
  ProdutoApi,
  ProdutoParaCriar,
} from '../types/produto';

export function getProdutos(
  pagina: number,
  busca: string
): Promise<PaginaProdutos> {
  const filtro = busca.trim() === ''
    ? ''
    : `&busca=${encodeURIComponent(busca.trim())}`;

  return get<PaginaProdutos>(
    `/produtos?page=${pagina}&size=20${filtro}`
  );
}

export function getProduto(id: number): Promise<ProdutoApi> {
  return get<ProdutoApi>(`/produtos/${id}`);
}

export function criarProduto(
  produto: ProdutoParaCriar
): Promise<ProdutoApi> {
  return post<ProdutoApi>('/produtos', produto);
}
