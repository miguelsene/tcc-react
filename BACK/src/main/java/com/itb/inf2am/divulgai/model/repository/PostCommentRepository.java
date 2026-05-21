package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> findByPostIdOrderByDataCriacaoDesc(Long postId);
}
