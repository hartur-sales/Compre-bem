import { Produto } from "../types/produto";
import { get } from "./api";

export function getProdutos(pagina: number, filtro: string): Promise<Produto[]> {
  return get<Produto[]>(`/produtos?page=${pagina}&size=20&filtro=${filtro}`);
}
