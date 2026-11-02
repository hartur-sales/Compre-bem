import type { ImageSourcePropType } from 'react-native';

export type Produto = {
  produtoId: string;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  quantidade: number;
  imagem: ImageSourcePropType;
};

export type ProdutoParaCriar = {
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  quantidade: number;
};

export type ProdutoApi = Omit<Produto, 'imagem'> & {
  imagem?: string | null;
};

export type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};
