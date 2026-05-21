package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostIdAndUsuarioId(Long postId, Long usuarioId);
    Optional<PostLike> findByPostIdAndUsuarioId(Long postId, Long usuarioId);
    void deleteByPostIdAndUsuarioId(Long postId, Long usuarioId);
    long countByPostId(Long postId);
}
