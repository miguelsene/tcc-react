package com.fashionspace.config;

import com.fashionspace.model.Bazar;
import com.fashionspace.repository.BazarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Inicializador de dados
 * Popula o banco com alguns bazares de exemplo
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BazarRepository bazarRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verificar se já existem dados
        if (bazarRepository.count() > 0) {
            System.out.println("✅ Banco de dados já contém dados");
            return;
        }

        System.out.println("📦 Populando banco de dados com dados iniciais...");

        // Criar alguns bazares de exemplo
        criarBazar(
            "Bazar da Moda Vintage",
            "Peças únicas e autênticas dos anos 70, 80 e 90. Encontre tesouros vintage com história e estilo.",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
            "Vintage",
            "01310-100", "Rua Augusta", "1234", "Consolação", "São Paulo, SP",
            "(11) 99999-1234",
            "Seg-Sex: 9h-18h, Sáb: 9h-15h",
            4.8, 127
        );

        criarBazar(
            "Outlet Independente",
            "Marcas independentes com preços especiais. Apoie designers locais e encontre peças exclusivas.",
            "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500",
            "Outlet",
            "22071-900", "Rua Visconde de Pirajá", "567", "Ipanema", "Rio de Janeiro, RJ",
            "(21) 98888-5678",
            "Seg-Dom: 10h-20h",
            4.5, 89
        );

        criarBazar(
            "Feira de Artesãos",
            "Peças artesanais únicas feitas à mão. Bolsas, acessórios e roupas com identidade brasileira.",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
            "Artesanal",
            "40070-110", "Largo do Pelourinho", "89", "Pelourinho", "Salvador, BA",
            "(71) 97777-9012",
            "Ter-Dom: 8h-17h",
            4.9, 203
        );

        criarBazar(
            "Luxo Fashion Store",
            "Peças de luxo e alta costura. Marcas internacionais e nacionais renomadas.",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
            "Bazar de Luxo",
            "04094-050", "Rua Oscar Freire", "1200", "Jardins", "São Paulo, SP",
            "(11) 95555-0001",
            "Seg-Sáb: 10h-20h",
            4.7, 156
        );

        criarBazar(
            "Sebo Cultural",
            "Livros raros, discos de vinil e peças vintage. Um tesouro cultural no coração da cidade.",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
            "Sebo",
            "30112-000", "Rua da Bahia", "456", "Centro", "Belo Horizonte, MG",
            "(31) 94444-0002",
            "Seg-Sex: 8h-18h, Sáb: 8h-14h",
            4.6, 78
        );

        criarBazar(
            "Kids Fashion",
            "Roupas infantis modernas e confortáveis. Do recém-nascido ao adolescente.",
            "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
            "Infantil",
            "80010-000", "Rua XV de Novembro", "789", "Centro", "Curitiba, PR",
            "(41) 93333-0003",
            "Seg-Sáb: 9h-19h",
            4.4, 92
        );

        criarBazar(
            "Fitness Wear",
            "Roupas esportivas de alta performance. Para academia, corrida e esportes em geral.",
            "https://images.unsplash.com/photo-1506629905607-c28b47d3b6b0?w=500",
            "Fitness",
            "60160-230", "Av. Beira Mar", "321", "Meireles", "Fortaleza, CE",
            "(85) 92222-0004",
            "Seg-Dom: 6h-22h",
            4.3, 134
        );

        System.out.println("✅ Banco de dados populado com sucesso!");
    }

    private void criarBazar(String nome, String descricao, String imagem, String categoria,
                           String cep, String rua, String numero, String bairro, String cidade,
                           String telefone, String horario, Double avaliacao, Integer totalAvaliacoes) {
        Bazar bazar = new Bazar();
        bazar.setNome(nome);
        bazar.setDescricao(descricao);
        bazar.setImagem(imagem);
        bazar.setCategoria(categoria);
        bazar.setCep(cep);
        bazar.setRua(rua);
        bazar.setNumero(numero);
        bazar.setBairro(bairro);
        bazar.setCidade(cidade);
        bazar.setTelefone(telefone);
        bazar.setHorario(horario);
        bazar.setAvaliacao(avaliacao);
        bazar.setTotalAvaliacoes(totalAvaliacoes);
        
        bazarRepository.save(bazar);
    }
}
