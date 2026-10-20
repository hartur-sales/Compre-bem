package com.murilo.comprebem.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

/**
 *
 * @author Murilo Nunes <murilo_no@outlook.com>
 * @date 19/10/2026
 * @brief Class Produto
 */
@Entity
@Table(name = "produto")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false)
    private String descricao;

    @Column(length = 30)
    private String categoria;

    @Column(nullable = false)
    private Integer quantidade;

    private String imagem;
}
