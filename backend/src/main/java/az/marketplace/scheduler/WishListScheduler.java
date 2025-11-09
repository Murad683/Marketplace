package az.marketplace.scheduler;

import az.marketplace.entity.WishList;
import az.marketplace.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class WishListScheduler {

    private final WishListRepository wishListRepository;

    // Gündə 1 dəfə: gecə 00:00
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional(readOnly = true)
    public void sendWishListReminders() {
        LocalDateTime threshold = LocalDateTime.now().minus(3, ChronoUnit.DAYS);
        List<WishList> oldItems = wishListRepository.findByCreatedAtBefore(threshold);
        for (WishList wl : oldItems) {
            Long customerId = wl.getCustomer().getId();
            Long productId = wl.getProduct().getId();
            log.info("Reminder for customer {} about product {}", customerId, productId);
        }
    }
}