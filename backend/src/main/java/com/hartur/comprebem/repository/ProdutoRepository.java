package com.hartur.comprebem.repository;

import com.hartur.comprebem.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository
        extends JpaRepository<Produto, Long> {

    Page<Produto> findByNomeContainingIgnoreCase(
            String busca,
            Pageable pageable
    );
}
