package com.blog.service;

import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public Post createPost(Post post) {
        User author = userRepository.findById(post.getAuthor().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setAuthor(author);
        return postRepository.save(post);
    }
    
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }
    
    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByAuthorId(userId);
    }
    
    public List<Post> searchPosts(String keyword) {
        return postRepository.findByTitleContainingIgnoreCase(keyword);
    }
    
    public Post updatePost(Long id, Post postDetails) {
        Post post = getPostById(id);
        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        return postRepository.save(post);
    }
    
    public void deletePost(Long id) {
        Post post = getPostById(id);
        postRepository.delete(post);
    }
}