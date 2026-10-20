package com.hartur.comprebem.entity.dto;

import com.hartur.comprebem.entity.Produto;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        Double preco,
        String descricao,
        String categoria,
        Integer quantidade,
        String imagem
) {
    public ProdutoResponseDTO(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getPreco().doubleValue(),
                produto.getDescricao(),
                produto.getCategoria(),
                produto.getQuantidade(),
                produto.getImagem()
        );
    }
}
