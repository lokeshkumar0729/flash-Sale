package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.ProductResponse;
import com.lokesh.flashsale.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlist;

    public WishlistController(WishlistService wishlist) {
        this.wishlist = wishlist;
    }

    @GetMapping
    public List<ProductResponse> list(Authentication auth) {
        return wishlist.list(auth.getName());
    }

    @PutMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void add(@PathVariable Long productId, Authentication auth) {
        wishlist.add(auth.getName(), productId);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long productId, Authentication auth) {
        wishlist.remove(auth.getName(), productId);
    }
}
