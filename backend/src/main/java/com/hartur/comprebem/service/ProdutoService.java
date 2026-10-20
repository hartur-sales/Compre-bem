package com.hartur.comprebem.service;

import com.hartur.comprebem.entity.Produto;
import com.hartur.comprebem.entity.dto.CriarProdutoDTO;
import com.hartur.comprebem.entity.dto.ProdutoResponseDTO;
import com.hartur.comprebem.exception.EntidadeNotFound;
import com.hartur.comprebem.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private static final int TAMANHO_PADRAO = 20;
    private static final int TAMANHO_MAXIMO = 50;

    private final ProdutoRepository produtoRepository;

    public Page<ProdutoResponseDTO> listarTodos(
            String busca,
            int page,
            int size
    ) {
        int paginaCorrigida = Math.max(page, 0);

        int tamanhoCorrigido = size <= 0
                ? TAMANHO_PADRAO
                : Math.min(size, TAMANHO_MAXIMO);

        Pageable pageable = PageRequest.of(
                paginaCorrigida,
                tamanhoCorrigido,
                Sort.by(Sort.Direction.ASC, "nome")
        );

        Page<Produto> produtos;

        if (busca == null || busca.isBlank()) {
            produtos = produtoRepository.findAll(pageable);
        } else {
            produtos = produtoRepository
                    .findByNomeContainingIgnoreCase(
                            busca.trim(),
                            pageable
                    );
        }

        return produtos.map(ProdutoResponseDTO::new);
    }

    public ProdutoResponseDTO buscar(Long id) {
        Produto produto = buscarPorId(id);
        return new ProdutoResponseDTO(produto);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(
                        () -> new EntidadeNotFound(
                                "Produto não encontrado"
                        )
                );
    }

    public ProdutoResponseDTO criar(CriarProdutoDTO produtoDTO) {
        Produto produto = new Produto();

        produto.setNome(produtoDTO.nome());
        produto.setPreco(
                BigDecimal.valueOf(produtoDTO.preco())
        );
        produto.setDescricao(produtoDTO.descricao());
        produto.setCategoria(produtoDTO.categoria());
        produto.setQuantidade(produtoDTO.quantidade());

        produto = produtoRepository.save(produto);

        produto.setImagem(
                "https://picsum.photos/seed/"
                        + produto.getId()
                        + "/200"
        );

        produto = produtoRepository.save(produto);

        return new ProdutoResponseDTO(produto);
    }

    public ProdutoResponseDTO atualizar(
            Long id,
            CriarProdutoDTO produtoDTO
    ) {
        Produto produtoExistente = buscarPorId(id);

        produtoExistente.setNome(produtoDTO.nome());
        produtoExistente.setPreco(
                BigDecimal.valueOf(produtoDTO.preco())
        );
        produtoExistente.setDescricao(produtoDTO.descricao());
        produtoExistente.setCategoria(produtoDTO.categoria());
        produtoExistente.setQuantidade(produtoDTO.quantidade());

        if (produtoExistente.getImagem() == null) {
            produtoExistente.setImagem(
                    "https://picsum.photos/seed/"
                            + produtoExistente.getId()
                            + "/200"
            );
        }

        Produto produtoAtualizado = produtoRepository.save(
                produtoExistente
        );

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    public void deletar(Long id) {
        Produto produtoExistente = buscarPorId(id);
        produtoRepository.delete(produtoExistente);
    }
}
