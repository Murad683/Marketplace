package az.marketplace.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Swagger hamıya açıq
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Auth hamıya açıq
                        .requestMatchers("/auth/**").permitAll()

                        // Kategoriyalar:
                        // GET /categories -> hamı görə bilər
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        // POST /categories -> yalnız MERCHANT
                        .requestMatchers(HttpMethod.POST, "/categories/**").hasRole("MERCHANT")

                        // Məhsullar:
                        // GET /products -> açıq
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        // Yarat / dəyiş / sil -> yalnız MERCHANT
                        .requestMatchers(HttpMethod.POST, "/products/**").hasRole("MERCHANT")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("MERCHANT")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("MERCHANT")

                        // /merchant/** -> yalnız MERCHANT
                        .requestMatchers("/merchant/**").hasRole("MERCHANT")

                        // Cart / Orders / Wishlist -> yalnız CUSTOMER
                        .requestMatchers("/cart/**").hasRole("CUSTOMER")
                        .requestMatchers("/orders/**").hasRole("CUSTOMER")
                        .requestMatchers("/wishlist/**").hasRole("CUSTOMER")

                        // qalan hər şey -> sadəcə login olmalıdır
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}