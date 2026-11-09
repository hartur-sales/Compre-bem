import {
  del,
  get,
  post,
  put,
} from './api';

import type {
  Page,
  ProdutoApi,
  ProdutoParaSalvar,
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

export function getProduto(
  produtoId: string
): Promise<ProdutoApi> {
  return get<ProdutoApi>(`/produtos/${produtoId}`);
}

export function criarProduto(
  produto: ProdutoParaSalvar
): Promise<ProdutoApi> {
  return post<ProdutoApi>('/produtos', produto);
}

export function atualizarProduto(
  produtoId: string,
  produto: ProdutoParaSalvar
): Promise<ProdutoApi> {
  return put<ProdutoApi>(
    `/produtos/${produtoId}`,
    produto
  );
}

export function excluirProduto(
  produtoId: string
): Promise<void> {
  return del(`/produtos/${produtoId}`);
}
