package az.marketplace.controller;

import az.marketplace.dto.product.CategoryRequest;
import az.marketplace.dto.product.CategoryResponse;
import az.marketplace.service.CategoryService;
import az.marketplace.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CurrentUserService currentUserService;

    // hamıya açıq
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // yalnız MERCHANT
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        // təhlükəsizlik qatını da burada yoxlayırıq
        currentUserService.getCurrentMerchantOrThrow();
        return ResponseEntity.ok(categoryService.createCategory(request));
    }
}