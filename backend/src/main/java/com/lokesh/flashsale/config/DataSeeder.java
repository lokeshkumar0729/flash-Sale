package com.lokesh.flashsale.config;

import com.lokesh.flashsale.model.*;
import com.lokesh.flashsale.repository.FlashSaleRepository;
import com.lokesh.flashsale.repository.ProductRepository;
import com.lokesh.flashsale.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Inserts demo accounts, products and flash sales the first time the app starts against an empty database.
 * Turn it off in real deployments with SEED_DATA=false.
 */
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    static final String ADMIN_EMAIL = "admin@example.com";
    static final String ADMIN_PASSWORD = "Admin@123";
    static final String CUSTOMER_EMAIL = "customer@example.com";
    static final String CUSTOMER_PASSWORD = "Customer@123";

    private final UserRepository users;
    private final ProductRepository products;
    private final FlashSaleRepository flashSales;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users, ProductRepository products,
                      FlashSaleRepository flashSales, PasswordEncoder encoder) {
        this.users = users;
        this.products = products;
        this.flashSales = flashSales;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }
        users.save(new User("Lokesh Kumar", ADMIN_EMAIL, null, encoder.encode(ADMIN_PASSWORD), Role.ADMIN));
        users.save(new User("Demo Customer", CUSTOMER_EMAIL, "9876543210", encoder.encode(CUSTOMER_PASSWORD), Role.CUSTOMER));

        Product headphones = product("Wireless Headphones", "Electronics", 1999, 4999, 4.5, 256, 120,
                "High quality wireless headphones with immersive sound, active noise cancellation, and long battery life.",
                List.of("Active Noise Cancellation", "40-hour battery life", "Bluetooth 5.3", "Fast USB-C charging", "Built-in microphone"),
                List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900",
                        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900"));
        Product watch = product("Smart Watch", "Electronics", 2499, 5999, 4.3, 184, 85,
                "A stylish smart watch with health tracking, notifications, fitness monitoring, and a vibrant display.",
                List.of("AMOLED display", "Heart rate monitoring", "Fitness tracking", "7-day battery life", "Water resistant"),
                List.of("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
                        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900"));
        Product shoes = product("Running Shoes", "Fashion", 1499, 2999, 4.2, 321, 64,
                "Lightweight running shoes designed for comfort, everyday training, and long-distance running.",
                List.of("Lightweight construction", "Breathable upper", "Cushioned sole", "Durable rubber outsole", "Everyday running design"),
                List.of("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900"));
        product("Travel Backpack", "Accessories", 899, 1699, 4.1, 97, 42,
                "A spacious and durable backpack suitable for travel, college, office, and everyday use.",
                List.of("Large storage capacity", "Laptop compartment", "Water resistant material", "Padded shoulder straps", "Multiple organizer pockets"),
                List.of("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
                        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900"));
        product("Classic Analog Watch", "Accessories", 1299, 2499, 4.4, 142, 51,
                "A classic analog watch with a premium design that works well for both casual and formal occasions.",
                List.of("Classic analog movement", "Premium dial", "Adjustable strap", "Scratch resistant glass", "Everyday design"),
                List.of("https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900"));
        product("Premium Sunglasses", "Fashion", 999, 1999, 4.0, 76, 37,
                "Premium sunglasses with a lightweight frame and stylish design for everyday outdoor use.",
                List.of("UV protection", "Lightweight frame", "Scratch resistant lenses", "Comfortable fit", "Classic design"),
                List.of("https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900"));

        Instant now = Instant.now();
        FlashSale liveHeadphones = sale(headphones, 1299, 40, 2, now.minus(Duration.ofHours(1)), now.plus(Duration.ofHours(30)));
        FlashSale liveWatch = sale(watch, 1799, 25, 1, now.minus(Duration.ofHours(2)), now.plus(Duration.ofHours(8)));
        sale(shoes, 999, 15, 2, now.plus(Duration.ofHours(3)), now.plus(Duration.ofHours(27)));

        // Pretend some units were already bought so the "claimed" bars look real. This goes through the same
        // atomic statements checkout uses, so stock and sale counters stay consistent with each other.
        simulatePurchases(liveHeadphones, headphones, 26, now);
        simulatePurchases(liveWatch, watch, 19, now);

        log.info("Seeded demo data: admin {}, customer {}, 6 products, 3 flash sales", ADMIN_EMAIL, CUSTOMER_EMAIL);
    }

    private void simulatePurchases(FlashSale sale, Product product, int units, Instant now) {
        flashSales.claim(sale.getId(), units, now);
        products.decrementStock(product.getId(), units);
    }

    private Product product(String name, String category, int price, int originalPrice, double rating, int reviews,
                            int stock, String description, List<String> features, List<String> images) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setDescription(description);
        p.setPrice(BigDecimal.valueOf(price));
        p.setOriginalPrice(BigDecimal.valueOf(originalPrice));
        p.setRating(rating);
        p.setReviewCount(reviews);
        p.setStock(stock);
        p.getFeatures().addAll(features);
        p.getImages().addAll(images);
        return products.save(p);
    }

    private FlashSale sale(Product product, int price, int quantity, int perUserLimit, Instant start, Instant end) {
        FlashSale s = new FlashSale();
        s.setProduct(product);
        s.setSalePrice(BigDecimal.valueOf(price));
        s.setTotalQuantity(quantity);
        s.setPerUserLimit(perUserLimit);
        s.setStartsAt(start);
        s.setEndsAt(end);
        return flashSales.save(s);
    }
}
