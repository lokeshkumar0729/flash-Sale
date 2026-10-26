package com.lokesh.flashsale.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lokesh.flashsale.model.*;
import com.lokesh.flashsale.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StoreApiTest {

    private static final String PASSWORD = "Password@123";

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired UserRepository users;
    @Autowired ProductRepository products;
    @Autowired FlashSaleRepository flashSales;
    @Autowired OrderRepository orders;
    @Autowired PasswordEncoder encoder;

    private Product product;

    @BeforeEach
    void setUp() {
        orders.deleteAll();
        flashSales.deleteAll();
        products.deleteAll();
        users.deleteAll();

        users.save(new User("Admin", "admin@test.com", null, encoder.encode(PASSWORD), Role.ADMIN));
        users.save(new User("Cust", "cust@test.com", null, encoder.encode(PASSWORD), Role.CUSTOMER));

        Product p = new Product();
        p.setName("Headphones");
        p.setCategory("Electronics");
        p.setPrice(new BigDecimal("2000.00"));
        p.setOriginalPrice(new BigDecimal("4000.00"));
        p.setStock(10);
        p.getImages().add("https://example.com/h.png");
        product = products.save(p);

        FlashSale s = new FlashSale();
        s.setProduct(product);
        s.setSalePrice(new BigDecimal("1000.00"));
        s.setTotalQuantity(5);
        s.setPerUserLimit(2);
        s.setStartsAt(Instant.now().minus(Duration.ofMinutes(10)));
        s.setEndsAt(Instant.now().plus(Duration.ofHours(2)));
        flashSales.save(s);
    }

    // ---- catalog -------------------------------------------------------------------------------------------

    @Test
    void anyoneCanBrowseAndSeesTheFlashPrice() throws Exception {
        mvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].currentPrice", is(1000.0)))
                .andExpect(jsonPath("$.content[0].price", is(2000.0)))
                .andExpect(jsonPath("$.content[0].discountPercent", is(75)))
                .andExpect(jsonPath("$.content[0].flashSale.status", is("LIVE")))
                .andExpect(jsonPath("$.content[0].flashSale.remaining", is(5)));

        mvc.perform(get("/api/flash-sales/live"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    // ---- authentication and roles --------------------------------------------------------------------------

    @Test
    void registerThenLoginWorksAndDuplicateEmailIsRejected() throws Exception {
        String body = json(Map.of("name", "New Shopper", "email", "New@Test.com", "password", "Welcome@123"));
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.role", is("CUSTOMER")))
                .andExpect(jsonPath("$.user.email", is("new@test.com")));

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", "new@test.com", "password", "Welcome@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void repeatedWrongPasswordsGetRateLimited() throws Exception {
        String body = json(Map.of("email", "cust@test.com", "password", "wrong-password"));
        for (int i = 0; i < 5; i++) {
            mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void customersCannotUseAdminEndpointsAndGuestsCannotCheckOut() throws Exception {
        String customer = loginAs("cust@test.com");

        mvc.perform(get("/api/admin/stats").header("Authorization", bearer(customer)))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/admin/products").header("Authorization", bearer(customer))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json(orderBody(1))))
                .andExpect(status().isUnauthorized());
    }

    // ---- checkout ------------------------------------------------------------------------------------------

    @Test
    void orderIsPricedByTheServerAndRetriesWithTheSameKeyReturnTheSameOrder() throws Exception {
        String token = loginAs("cust@test.com");

        MvcResult first = mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                        .header("Idempotency-Key", "abc-123")
                        .contentType(MediaType.APPLICATION_JSON).content(json(orderBody(2))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PLACED")))
                .andExpect(jsonPath("$.items[0].unitPrice", is(1000.0)))
                .andExpect(jsonPath("$.items[0].flashPrice", is(true)))
                .andExpect(jsonPath("$.subtotal", is(2000.0)))
                .andExpect(jsonPath("$.savings", is(6000.0)))
                .andExpect(jsonPath("$.deliveryCharge", is(0.0)))
                .andReturn();
        long id = mapper.readTree(first.getResponse().getContentAsString()).get("id").asLong();

        mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                        .header("Idempotency-Key", "abc-123")
                        .contentType(MediaType.APPLICATION_JSON).content(json(orderBody(2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is((int) id)));

        // stock moved exactly once
        mvc.perform(get("/api/products/" + product.getId()))
                .andExpect(jsonPath("$.stock", is(8)))
                .andExpect(jsonPath("$.flashSale.remaining", is(3)));
    }

    @Test
    void exceedingThePerCustomerLimitIsRejectedWithAClearMessage() throws Exception {
        String token = loginAs("cust@test.com");

        mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON).content(json(orderBody(3))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("2 more")));
    }

    @Test
    void validationErrorsAreReportedPerField() throws Exception {
        String token = loginAs("cust@test.com");
        Map<String, Object> body = orderBody(1);
        body.put("address", Map.of("fullName", "", "phone", "123", "email", "nope", "addressLine", "x",
                "city", "c", "state", "s", "pincode", "12"));

        mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON).content(json(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors['address.phone']").exists())
                .andExpect(jsonPath("$.fieldErrors['address.pincode']").exists());
    }

    @Test
    void cancellingAnOrderReturnsStockAndAnotherCustomerCannotSeeIt() throws Exception {
        String token = loginAs("cust@test.com");
        MvcResult placed = mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON).content(json(orderBody(2))))
                .andExpect(status().isCreated()).andReturn();
        long id = mapper.readTree(placed.getResponse().getContentAsString()).get("id").asLong();

        users.save(new User("Other", "other@test.com", null, encoder.encode(PASSWORD), Role.CUSTOMER));
        mvc.perform(get("/api/orders/" + id).header("Authorization", bearer(loginAs("other@test.com"))))
                .andExpect(status().isNotFound());

        mvc.perform(post("/api/orders/" + id + "/cancel").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELLED")));
        mvc.perform(get("/api/products/" + product.getId()))
                .andExpect(jsonPath("$.stock", is(10)))
                .andExpect(jsonPath("$.flashSale.remaining", is(5)));
    }

    // ---- admin ---------------------------------------------------------------------------------------------

    @Test
    void adminAdvancesAnOrderAndInvalidJumpsAreRejected() throws Exception {
        String customer = loginAs("cust@test.com");
        String admin = loginAs("admin@test.com");
        MvcResult placed = mvc.perform(post("/api/orders").header("Authorization", bearer(customer))
                        .contentType(MediaType.APPLICATION_JSON).content(json(orderBody(1))))
                .andExpect(status().isCreated()).andReturn();
        long id = mapper.readTree(placed.getResponse().getContentAsString()).get("id").asLong();

        mvc.perform(patch("/api/admin/orders/" + id + "/status").header("Authorization", bearer(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(json(Map.of("status", "DELIVERED"))))
                .andExpect(status().isConflict());
        mvc.perform(patch("/api/admin/orders/" + id + "/status").header("Authorization", bearer(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(json(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CONFIRMED")));

        mvc.perform(get("/api/admin/stats").header("Authorization", bearer(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orders", is(1)))
                .andExpect(jsonPath("$.last7Days", hasSize(7)));
    }

    @Test
    void adminCannotCreateOverlappingOrInvalidFlashSales() throws Exception {
        String admin = loginAs("admin@test.com");
        Instant now = Instant.now();

        Map<String, Object> overlapping = Map.of("productId", product.getId(), "salePrice", 900, "totalQuantity", 3,
                "perUserLimit", 1, "startsAt", now.toString(), "endsAt", now.plus(Duration.ofHours(1)).toString());
        mvc.perform(post("/api/admin/flash-sales").header("Authorization", bearer(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(json(overlapping)))
                .andExpect(status().isConflict());

        Map<String, Object> notCheaper = Map.of("productId", product.getId(), "salePrice", 2500, "totalQuantity", 3,
                "perUserLimit", 1, "startsAt", now.plus(Duration.ofDays(2)).toString(),
                "endsAt", now.plus(Duration.ofDays(3)).toString());
        mvc.perform(post("/api/admin/flash-sales").header("Authorization", bearer(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(json(notCheaper)))
                .andExpect(status().isBadRequest());
    }

    // ---- helpers -------------------------------------------------------------------------------------------

    private Map<String, Object> orderBody(int quantity) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("items", List.of(Map.of("productId", product.getId(), "quantity", quantity)));
        body.put("address", Map.of("fullName", "Test Buyer", "phone", "9876543210", "email", "buyer@test.com",
                "addressLine", "12 Market Road", "city", "Visakhapatnam", "state", "Andhra Pradesh", "pincode", "530001"));
        body.put("paymentMethod", "COD");
        return body;
    }

    private String loginAs(String email) throws Exception {
        MvcResult result = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", PASSWORD))))
                .andExpect(status().isOk()).andReturn();
        return mapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private String json(Object value) throws Exception {
        return mapper.writeValueAsString(value);
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }
}
