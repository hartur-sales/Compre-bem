package com.murilo.comprebem.controller;

import com.murilo.comprebem.entity.dto.CriarProdutoDTO;
import com.murilo.comprebem.entity.dto.ProdutoResponseDTO;
import com.murilo.comprebem.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 19/10/2026
 * @brief Class ProdutoController
 */
@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {
    private final ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody @Valid CriarProdutoDTO dto) {
        ProdutoResponseDTO novoProduto = produtoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        var produtos = produtoService.listarTodos();
        return ResponseEntity.ok().body(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> obterPorId(@PathVariable Long id) {
        var produto = produtoService.buscar(id);
        return ResponseEntity.ok().body(produto);
    }

    @GetMapping("/buscar/{nome}")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorNome(@PathVariable String nome) {
        var produtos = produtoService.buscarPorNome(nome);
        return ResponseEntity.ok().body(produtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(@RequestBody @Valid CriarProdutoDTO dto, @PathVariable Long id) {
        ProdutoResponseDTO produtoAtualizado = produtoService.atualizar(id, dto);
        return ResponseEntity.ok().body(produtoAtualizado);
    }
}