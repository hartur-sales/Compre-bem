package com.hartur.comprebem;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition
public class CompreBemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompreBemApplication.class, args);
    }

}
