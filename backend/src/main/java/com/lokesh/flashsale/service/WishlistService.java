package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.Product;
import com.lokesh.flashsale.model.User;
import com.lokesh.flashsale.model.WishlistItem;
import com.lokesh.flashsale.repository.ProductRepository;
import com.lokesh.flashsale.repository.UserRepository;
import com.lokesh.flashsale.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlist;
    private final ProductRepository products;
    private final UserRepository users;
    private final ProductService productService;

    public WishlistService(WishlistRepository wishlist, ProductRepository products,
                           UserRepository users, ProductService productService) {
        this.wishlist = wishlist;
        this.products = products;
        this.users = users;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> list(String email) {
        User user = requireUser(email);
        List<Product> items = wishlist.findByUserIdOrderByIdDesc(user.getId()).stream()
                .map(WishlistItem::getProduct)
                .filter(Product::isActive)
                .toList();
        return productService.toResponses(items);
    }

    /**
     * Adding something that is already there is a no-op, so the call is safe to repeat. If two identical requests
     * race, the unique constraint rejects the second one and the API answers 409.
     */
    @Transactional
    public void add(String email, Long productId) {
        User user = requireUser(email);
        Product product = products.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        if (!wishlist.existsByUserIdAndProductId(user.getId(), productId)) {
            wishlist.saveAndFlush(new WishlistItem(user.getId(), product));
        }
    }

    @Transactional
    public void remove(String email, Long productId) {
        wishlist.deleteByUserAndProduct(requireUser(email).getId(), productId);
    }

    private User requireUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));
    }
}
