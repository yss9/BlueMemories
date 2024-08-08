package com.backend.service;

import com.jav.bluememories.domain.User;
import com.jav.bluememories.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean isUserIdAvailable(String userId) {
        return !userRepository.existsByUserId(userId);
    }

    public boolean isNicknameAvailable(String nickname) {
        return !userRepository.existsByNickname(nickname);
    }

    public void registerUser(String userId, String nickname, String password) {
        User user = new User();
        user.setUserId(userId);
        user.setNickname(nickname);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
    public User authenticate(String userId, String password) {
        User user = userRepository.findByUserId(userId);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
}