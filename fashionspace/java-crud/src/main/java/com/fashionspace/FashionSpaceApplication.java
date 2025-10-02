package com.fashionspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação FashionSpace
 * Esta é a classe que inicia todo o sistema
 */
@SpringBootApplication
public class FashionSpaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FashionSpaceApplication.class, args);
        
        System.out.println("\n========================================");
        System.out.println("🚀 API FashionSpace iniciada!");
        System.out.println("📡 Servidor: http://localhost:8080");
        System.out.println("📊 Console H2: http://localhost:8080/h2-console");
        System.out.println("========================================\n");
    }
}
