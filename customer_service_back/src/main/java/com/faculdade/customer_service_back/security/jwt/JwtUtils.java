package com.faculdade.customer_service_back.security.jwt;

import com.faculdade.customer_service_back.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Específico para JJWT 0.12+
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.util.Date;

@Component // Marca esta classe como um componente Spring, tornando-a elegível para injeção
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    @Value("${app.jwt.cookie-name}")
    private String jwtCookieName; // Opcional, para transporte via cookie

    // Método para obter a chave de assinatura (SecretKey) a partir da string do segredo
    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        // Alternativamente, se o teu segredo não estiver em Base64:
        // return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        // Certifica-te que o segredo tem o tamanho mínimo para o algoritmo (ex: HS512 requer 64 bytes)
    }

    // Gera um token JWT a partir dos detalhes do utilizador autenticado
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // Define o "subject" do token (nome do utilizador)
                .setIssuedAt(new Date()) // Data de emissão
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Data de expiração
                .signWith(key(), SignatureAlgorithm.HS512) // Assina com a chave e algoritmo HS512
                // Podes adicionar claims personalizadas aqui com .claim("chave", "valor")
                .compact(); // Constrói o token
    }

    // Gera um token JWT diretamente a partir de um nome de utilizador
    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Obtém o nome de utilizador (subject) a partir de um token JWT
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Valida um token JWT
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) { // Assinatura inválida (JJWT 0.12+)
            logger.error("Assinatura JWT inválida: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Token JWT malformado: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token JWT não suportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Corpo (claims) do JWT está vazio ou nulo: {}", e.getMessage());
        }
        return false;
    }

    // --- Métodos Opcionais para transporte de JWT via Cookies ---
    // Se não fores usar cookies para JWT, podes omitir estes.

    // Obtém o JWT de um cookie HTTP
    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookieName);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    // Gera um cookie HTTP-only contendo o JWT
    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUsername(userPrincipal.getUsername());
        return ResponseCookie.from(jwtCookieName, jwt)
                .path("/api") // O cookie será válido para o caminho /api
                .maxAge(24 * 60 * 60) // 24 horas em segundos
                .httpOnly(true) // Protege contra XSS (não acessível por JavaScript no cliente)
                // .secure(true) // Descomentar em produção para enviar apenas sobre HTTPS
                .build();
    }

    // Gera um cookie para limpar o JWT (ao fazer logout)
    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(jwtCookieName, null).path("/api").maxAge(0).build();
    }
}