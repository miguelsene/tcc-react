package com.itb.inf2am.divulgai.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class EsqueciSenhaDTO {

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
