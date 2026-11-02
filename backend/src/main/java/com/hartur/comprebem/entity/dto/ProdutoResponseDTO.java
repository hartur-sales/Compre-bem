package com.hartur.comprebem.entity.dto;

import com.hartur.comprebem.entity.Produto;

public record ProdutoResponseDTO(
        String produtoId,
        String nome,
        Double preco,
        String descricao,
        String categoria,
        Integer quantidade,
        String imagem
) {
    public ProdutoResponseDTO(Produto produto) {
        this(
                String.valueOf(produto.getId()),
                produto.getNome(),
                produto.getPreco().doubleValue(),
                produto.getDescricao(),
                produto.getCategoria(),
                produto.getQuantidade(),
                produto.getImagem() != null
                        ? produto.getImagem()
                        : "https://picsum.photos/seed/"
                                + produto.getId()
                                + "/200"
        );
    }
}
