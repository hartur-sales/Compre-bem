package com.hartur.comprebem.service;

import com.hartur.comprebem.entity.Produto;
import com.hartur.comprebem.entity.dto.CriarProdutoDTO;
import com.hartur.comprebem.entity.dto.ProdutoResponseDTO;
import com.hartur.comprebem.exception.EntidadeNotFound;
import com.hartur.comprebem.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    private final ProdutoRepository produtoRepository;

    public ProdutoResponseDTO criar(CriarProdutoDTO produtoDTO) {
        Produto produto = new Produto();

        produto.setNome(produtoDTO.nome());
        produto.setPreco(BigDecimal.valueOf(produtoDTO.preco()));
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

    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(ProdutoResponseDTO::new)
                .toList();
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

    public List<ProdutoResponseDTO> buscarPorNome(String nome) {
        return produtoRepository
                .findAllByNomeContainingIgnoreCase(nome)
                .stream()
                .map(ProdutoResponseDTO::new)
                .toList();
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

        return new ProdutoResponseDTO(
                produtoRepository.save(produtoExistente)
        );
    }

    public void deletar(Long id) {
        Produto produtoExistente = buscarPorId(id);
        produtoRepository.delete(produtoExistente);
    }
}
