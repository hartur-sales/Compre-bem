package com.hartur.comprebem.controller;

import com.hartur.comprebem.entity.dto.CriarProdutoDTO;
import com.hartur.comprebem.entity.dto.ProdutoResponseDTO;
import com.hartur.comprebem.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/produtos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(
            @RequestBody @Valid CriarProdutoDTO dto
    ) {
        ProdutoResponseDTO novoProduto =
                produtoService.criar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoProduto);
    }

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listarTodos(
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ProdutoResponseDTO> produtos =
                produtoService.listarTodos(
                        busca,
                        page,
                        size
                );

        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> obterPorId(
            @PathVariable Long id
    ) {
        ProdutoResponseDTO produto =
                produtoService.buscar(id);

        return ResponseEntity.ok(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid CriarProdutoDTO dto
    ) {
        ProdutoResponseDTO produtoAtualizado =
                produtoService.atualizar(id, dto);

        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id
    ) {
        produtoService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
