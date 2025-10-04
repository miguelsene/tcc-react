package com.itb.inf2am.divulgai.controller;


// No spring é comum adicionarmos anotações (annotation) em classes, atributos e métodos
// Uma annotation é uma forma de adicionar informações (metadados) ao seu código que podem
// ser interpretadas pelo compilador ou em tempo de execução por ferramentas e frameworks
// como o Spring
// Uma annotation é uma palavra iniciada com '@' que você coloca acima de uma class, método,
// atributo ou parâmetro, para dar instruções extras ao Java ou a algum framework sobre como
// aquele elemento deve ser tratado.

import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

 @Autowired
 private UsuarioService usuarioService;

 @GetMapping("/ping")
 public ResponseEntity<String> ping() {
  return ResponseEntity.ok("API funcionando! Servidor ativo em: " + java.time.LocalDateTime.now());
 }

 @GetMapping("/test")
 public ResponseEntity<String> test() {
  return ResponseEntity.ok("Conexão OK - CORS funcionando!");
 }

 @GetMapping("/health")
 public ResponseEntity<Object> health() {
  Map<String, Object> response = new HashMap<>();
  response.put("status", "UP");
  response.put("timestamp", java.time.LocalDateTime.now());
  response.put("service", "FashionSpace API");
  return ResponseEntity.ok(response);
 }

 @GetMapping("/findAll")
 public ResponseEntity<List<Usuario>> findAll() {

  return ResponseEntity.ok(usuarioService.findAll());
 }

 // @RequestBody : Corpo da Requisição ( Recebendo um objeto JSON )
 // RespondeEntity: Toda resposta HTTP (status, cabeçalhos e corpo), aqui temos mais controle sobre o que é devolvido para o cliente
 // 1. Status HTTP ( 200 ok, 201 CREATED, 404 NOT FOUND etc...)
 // 2. Headers: ( cabeçalhos extras, como Location, Authorization etc...)
 // 3. Body: ( o objeto que será convertido em JSON/XML para o cliente )

 @PostMapping
 public ResponseEntity<Object> create(@RequestBody Usuario usuario) {
  if (usuarioService.emailExiste(usuario.getEmail())) {
   Map<String, String> response = new HashMap<>();
   response.put("message", "Email já cadastrado");
   return ResponseEntity.badRequest().body(response);
  }
  return ResponseEntity.ok(usuarioService.save(usuario));
 }
 
 @PostMapping("/login")
 public ResponseEntity<Object> login(@RequestBody Map<String, String> dados) {
  Usuario usuario = usuarioService.login(dados.get("email"), dados.get("senha"));
  if (usuario != null) {
   return ResponseEntity.ok(usuario);
  }
  Map<String, String> response = new HashMap<>();
  response.put("message", "Email ou senha incorretos");
  return ResponseEntity.status(401).body(response);
 }


 @GetMapping("/{id}")
 public ResponseEntity<Object> listarUsuarioPorId(@PathVariable String id) {
  try {
   return ResponseEntity.ok(usuarioService.findById(Long.parseLong(id)));
  } catch (NumberFormatException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 400);
   errorResponse.put("error", "Bad Request");
   errorResponse.put("message", "O id informado não é válido: " + id);
   return ResponseEntity.badRequest().body(errorResponse);


  } catch (RuntimeException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 404);
   errorResponse.put("error", "Not Found");
   errorResponse.put("message", "Usuario não encontrada com o id " + id);
   return ResponseEntity.status(404).body(errorResponse);

  }


 }

 @PutMapping("/{id}")
 public ResponseEntity<Object> atualizarUsuario(@PathVariable String id, @RequestBody Usuario usuario) {
  try {
   Long usuarioId = Long.parseLong(id);
   Usuario usuarioExistente = usuarioService.findById(usuarioId); // já lança exceção se não achar

   usuarioExistente.setNome(usuario.getNome());
   usuarioExistente.setEmail(usuario.getEmail());
   usuarioExistente.setSenha(usuario.getSenha());
   usuarioExistente.setTipoUsuario(usuario.getTipoUsuario());

   Usuario usuarioAtualizada = usuarioService.save(usuarioExistente);

   return ResponseEntity.ok(usuarioAtualizada);
  } catch (NumberFormatException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 400);
   errorResponse.put("error", "Bad Request");
   errorResponse.put("message", "O id informado não é válido: " + id);
   return ResponseEntity.badRequest().body(errorResponse);
  } catch (RuntimeException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 404);
   errorResponse.put("error", "Not Found");
   errorResponse.put("message", "Usuario não encontrada com o id " + id);
   return ResponseEntity.status(404).body(errorResponse);
  }
 }


 @DeleteMapping("/{id}")
 public ResponseEntity<Object> excluirUsuario(@PathVariable String id) {
  try {
   Long usuarioId = Long.parseLong(id);
   usuarioService.delete(usuarioId); // chama o service
   Map<String, String> response = new HashMap<>();
   response.put("message", "Usuario deletada com sucesso");
   return ResponseEntity.ok(response);
  } catch (NumberFormatException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 400);
   errorResponse.put("error", "Bad Request");
   errorResponse.put("message", "O id informado não é válido: " + id);
   return ResponseEntity.badRequest().body(errorResponse);
  } catch (RuntimeException e) {
   Map<String, Object> errorResponse = new HashMap<>();
   errorResponse.put("status", 404);
   errorResponse.put("error", "Not Found");
   errorResponse.put("message", "Usuario não encontrada com o id " + id);
   return ResponseEntity.status(404).body(errorResponse);
  }
 }
}

