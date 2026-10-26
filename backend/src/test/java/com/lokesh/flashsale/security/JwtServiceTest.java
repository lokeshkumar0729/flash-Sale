package com.lokesh.flashsale.security;

import com.lokesh.flashsale.model.Role;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "unit-test-secret-unit-test-secret-1234";

    @Test
    void validTokenReturnsTheEmailItWasIssuedFor() {
        JwtService jwt = new JwtService(SECRET, 30);
        assertThat(jwt.validateAndGetEmail(jwt.generateToken("a@test.com", Role.CUSTOMER))).contains("a@test.com");
    }

    @Test
    void tamperedAndForeignAndExpiredTokensAreRejected() {
        JwtService jwt = new JwtService(SECRET, 30);
        String token = jwt.generateToken("a@test.com", Role.CUSTOMER);
        assertThat(jwt.validateAndGetEmail(token.substring(0, token.length() - 3) + "abc")).isEmpty();

        String foreign = new JwtService("another-secret-another-secret-12345678", 30).generateToken("a@test.com", Role.ADMIN);
        assertThat(jwt.validateAndGetEmail(foreign)).isEmpty();

        JwtService expired = new JwtService(SECRET, -5);
        assertThat(expired.validateAndGetEmail(expired.generateToken("a@test.com", Role.CUSTOMER))).isEmpty();
        assertThat(jwt.validateAndGetEmail("not-a-jwt")).isEmpty();
    }

    @Test
    void shortSecretPreventsStartup() {
        assertThatThrownBy(() -> new JwtService("too-short", 30))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least 32");
    }
}
