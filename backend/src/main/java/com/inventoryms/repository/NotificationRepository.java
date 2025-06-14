package com.inventoryms.repository;

import com.inventoryms.entity.Notification;
import com.inventoryms.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Page<Notification> findByUserIdAndReadOrderByCreatedAtDesc(Long userId, Boolean read, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.read = false")
    Long countUnreadByUserId(@Param("userId") Long userId);
    
    Page<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type, Pageable pageable);
}