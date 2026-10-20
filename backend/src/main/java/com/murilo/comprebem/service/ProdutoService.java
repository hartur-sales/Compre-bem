package com.murilo.comprebem.service;

import com.murilo.comprebem.entity.Produto;
import com.murilo.comprebem.entity.dto.CriarProdutoDTO;
import com.murilo.comprebem.entity.dto.ProdutoResponseDTO;
import com.murilo.comprebem.exception.EntidadeNotFound;
import com.murilo.comprebem.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 19/10/2026
 * @brief Class ProdutoService
 */
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

        produto.setImagem("https://picsum.photos/seed/" + produto.getId() + "/200");

        return new ProdutoResponseDTO(produto);
    }

    public List<ProdutoResponseDTO> listarTodos() {
        var produtos = produtoRepository.findAll();
        return produtos.stream().map(ProdutoResponseDTO::new).toList();
    }

    public ProdutoResponseDTO buscar(Long id) {
        Produto produto = buscarPorId(id);
        return new ProdutoResponseDTO(produto);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElseThrow(
                () -> new EntidadeNotFound("Produto não encontrado")
        );
    }

    public List<ProdutoResponseDTO> buscarPorNome(String nome) {
        return produtoRepository.findAllByNomeContainingIgnoreCase(nome)
                .stream()
                .map(ProdutoResponseDTO::new)
                .toList();
    }

    public ProdutoResponseDTO atualizar(Long id, CriarProdutoDTO produto) {
        Produto produtoExistente = buscarPorId(id);

        produtoExistente.setNome(produto.nome());
        produtoExistente.setPreco(BigDecimal.valueOf(produto.preco()));
        produtoExistente.setDescricao(produto.descricao());
        produtoExistente.setCategoria(produto.categoria());
        produtoExistente.setQuantidade(produto.quantidade());

        return new ProdutoResponseDTO(produtoRepository.save(produtoExistente));
    }

    public void deletar(Long id) {
        Produto produtoExistente = buscarPorId(id);
        produtoRepository.delete(produtoExistente);
    }
}
