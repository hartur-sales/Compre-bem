import { get, post } from './api';
import type {
  Page,
  ProdutoApi,
  ProdutoParaCriar,
} from '../types/produto';

export function getProdutos(
  pagina: number,
  busca: string
): Promise<Page<ProdutoApi>> {
  const filtro = busca.trim() === ''
    ? ''
    : `&busca=${encodeURIComponent(busca.trim())}`;

  return get<Page<ProdutoApi>>(
    `/produtos/filtro?page=${pagina}&size=20${filtro}`
  );
}

export function getProduto(produtoId: string): Promise<ProdutoApi> {
  return get<ProdutoApi>(`/produtos/${produtoId}`);
}

export function criarProduto(
  produto: ProdutoParaCriar
): Promise<ProdutoApi> {
  return post<ProdutoApi>('/produtos', produto);
}
