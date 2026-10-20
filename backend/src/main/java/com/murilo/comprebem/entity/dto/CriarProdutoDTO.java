package com.murilo.comprebem.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CriarProdutoDTO(
        @NotBlank(message = "O nome do produto não pode ser vazio")
        @NotNull(message = "O nome do produto não pode ser nulo")
        @Size(max = 100, message = "O nome do produto não pode ter mais de 100 caracteres")
        String nome,
        @NotNull(message = "O preço do produto não pode ser nulo")
        @Positive(message = "O preço do produto deve ser maior que zero")
        Double preco,
        @NotBlank(message = "A descrição do produto não pode ser vazia")
        @NotNull(message = "A descrição do produto não pode ser nula")
        String descricao,
        @NotBlank(message = "A categoria do produto não pode ser vazia")
        @NotNull(message = "A categoria do produto não pode ser nula")
        @Size(max = 30, message = "A categoria do produto não pode ter mais de 30 caracteres")
        String categoria,
        @NotNull(message = "A quantidade do produto não pode ser nula")
        @Positive(message = "A quantidade do produto deve ser maior que zero")
        Integer quantidade
) {
}
