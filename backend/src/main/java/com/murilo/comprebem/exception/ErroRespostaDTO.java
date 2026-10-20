package com.murilo.comprebem.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroRespostaDTO(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        Map<String, String> campos
) {
    public ErroRespostaDTO(int status, String erro, String mensagem) {
        this(LocalDateTime.now(), status, erro, mensagem, null);
    }

    public ErroRespostaDTO(int status, String erro, String mensagem, Map<String, String> campos) {
        this(LocalDateTime.now(), status, erro, mensagem, campos);
    }
}