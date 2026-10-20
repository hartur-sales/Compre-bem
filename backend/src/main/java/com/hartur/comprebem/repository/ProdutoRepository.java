package com.hartur.comprebem.repository;

import com.hartur.comprebem.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Hartur
 * @date 19/10/2026
 * @brief Interface ProdutoRepository
 */
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findAllByNomeContainingIgnoreCase(String nome);
}
