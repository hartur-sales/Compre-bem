package com.hartur.comprebem.config;

import com.hartur.comprebem.entity.Produto;
import com.hartur.comprebem.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class CargaInicial {

    private static final String[] CATEGORIAS = {
            "Eletrônicos",
            "Roupas",
            "Alimentos",
            "Livros",
            "Brinquedos"
    };

    @Bean
    CommandLineRunner popularProdutos(ProdutoRepository produtoRepository) {
        return args -> {
            long quantidadeAtual = produtoRepository.count();

            if (quantidadeAtual >= 60) {
                return;
            }

            for (int i = (int) quantidadeAtual + 1; i <= 60; i++) {
                Produto produto = new Produto();

                produto.setNome("Produto " + i);
                produto.setPreco(BigDecimal.valueOf(i * 10L));
                produto.setDescricao("Descrição do Produto " + i);
                produto.setCategoria(
                        CATEGORIAS[(i - 1) % CATEGORIAS.length]
                );
                produto.setQuantidade(100);
                produto.setImagem(
                        "https://picsum.photos/seed/produto" + i + "/200"
                );

                produtoRepository.save(produto);
            }
        };
    }
}
