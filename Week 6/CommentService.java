package com.blog.service;

import com.blog.model.Comment;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.CommentRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public Comment createComment(Comment comment) {
        Post post = postRepository.findById(comment.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User author = userRepository.findById(comment.getAuthor().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        comment.setPost(post);
        comment.setAuthor(author);
        return commentRepository.save(comment);
    }
    
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
    
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }
    
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }
    
    public List<Comment> getCommentsByUser(Long userId) {
        return commentRepository.findByAuthorId(userId);
    }
    
    public Comment updateComment(Long id, Comment commentDetails) {
        Comment comment = getCommentById(id);
        comment.setContent(commentDetails.getContent());
        return commentRepository.save(comment);
    }
    
    public void deleteComment(Long id) {
        Comment comment = getCommentById(id);
        commentRepository.delete(comment);
    }
}