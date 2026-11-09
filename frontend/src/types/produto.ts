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

export type ProdutoParaSalvar = {
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  quantidade: number;
};

export type ProdutoApi = {
  produtoId: string;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  quantidade: number;
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
