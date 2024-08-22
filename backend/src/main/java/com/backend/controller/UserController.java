package com.backend.controller;


import com.backend.domain.User;
import com.backend.dto.UserDTO;
import com.backend.service.UserService;
import com.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/check-userId")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String userId) {
        boolean isAvailable = userService.isUserIdAvailable(userId);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        boolean isAvailable = userService.isNicknameAvailable(nickname);
        return ResponseEntity.ok(isAvailable);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody UserDTO userDto) {
        userService.registerUser(userDto.getUserId(), userDto.getNickname(), userDto.getPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserDTO userDto) {
        User user = userService.authenticate(userDto.getUserId(), userDto.getPassword());
        if (user != null) {
            String token = jwtUtil.generateToken(user.getUserId());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<UserDTO> getUserInfo() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUserId(userId);
        if (user != null) {
            UserDTO userDto = new UserDTO();
            userDto.setUserId(user.getUserId());
            userDto.setNickname(user.getNickname());
            return ResponseEntity.ok(userDto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search-member")
    public String getNicknameByUserId(@RequestParam String receiverId){
        User user = userService.findByUserId(receiverId);
        if (user != null){
            return user.getNickname();
        }
        else{
            return null;
        }
    }
}