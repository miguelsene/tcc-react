package com.itb.inf2am.divulgai.controller;
import
org.springframework.web.bind.annotation.GetMapping;
import
org.springframework.web.bind.annotation.RestController;
import
org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequestMapping ("/api")
public class HealthController{
    @GetMapping ("/ping")
    public String ping () {
        return "ok";
    }
}