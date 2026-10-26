package com.lokesh.flashsale.security;

import com.lokesh.flashsale.exception.ApiException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LoginRateLimiterTest {

    @Test
    void blocksAKeyAfterTooManyFailures() {
        LoginRateLimiter limiter = new LoginRateLimiter(3, 10);
        for (int i = 0; i < 3; i++) {
            limiter.checkAllowed("a@test.com|1.1.1.1");
            limiter.recordFailure("a@test.com|1.1.1.1");
        }
        assertThatThrownBy(() -> limiter.checkAllowed("a@test.com|1.1.1.1"))
                .isInstanceOf(ApiException.class)
                .satisfies(e -> assertThat(((ApiException) e).getStatus()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS));
    }

    @Test
    void otherKeysAreNotAffectedAndSuccessResetsTheCounter() {
        LoginRateLimiter limiter = new LoginRateLimiter(2, 10);
        limiter.recordFailure("a|ip");
        limiter.recordFailure("a|ip");
        assertThatCode(() -> limiter.checkAllowed("b|ip")).doesNotThrowAnyException();

        limiter.reset("a|ip");
        assertThatCode(() -> limiter.checkAllowed("a|ip")).doesNotThrowAnyException();
    }
}
