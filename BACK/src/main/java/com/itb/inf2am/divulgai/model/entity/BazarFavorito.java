package com.itb.inf2am.divulgai.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bazares_favoritos", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "bazar_id"}))
public class BazarFavorito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "bazar_id", nullable = false)
    private Long bazarId;
    
    @Column(name = "data_favorito", nullable = false)
    private LocalDateTime dataFavorito;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", insertable = false, updatable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bazar_id", insertable = false, updatable = false)
    private Bazar bazar;
    
    public BazarFavorito() {
        this.dataFavorito = LocalDateTime.now();
    }
    
    public BazarFavorito(Long usuarioId, Long bazarId) {
        this();
        this.usuarioId = usuarioId;
        this.bazarId = bazarId;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public Long getBazarId() {
        return bazarId;
    }
    
    public void setBazarId(Long bazarId) {
        this.bazarId = bazarId;
    }
    
    public LocalDateTime getDataFavorito() {
        return dataFavorito;
    }
    
    public void setDataFavorito(LocalDateTime dataFavorito) {
        this.dataFavorito = dataFavorito;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Bazar getBazar() {
        return bazar;
    }
    
    public void setBazar(Bazar bazar) {
        this.bazar = bazar;
    }
}