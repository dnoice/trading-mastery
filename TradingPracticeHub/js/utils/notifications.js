// 📁/📄 TradingPracticeHub\js\utils\notifications.js

// Notification System

class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        this.container = document.getElementById('notificationContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', options = {}) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Set styles
        notification.style.cssText = `
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // Set background based on type
        const backgrounds = {
            success: 'linear-gradient(135deg, #00d395 0%, #0ecb81 100%)',
            error: 'linear-gradient(135deg, #f6465d 0%, #ee3158 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };

        notification.style.background = backgrounds[type] || backgrounds.info;

        // Add icon
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const icon = document.createElement('i');
        icon.className = `fas ${icons[type] || icons.info}`;
        icon.style.fontSize = '20px';

        // Add message
        const messageEl = document.createElement('span');
        messageEl.innerHTML = message;
        messageEl.style.flex = '1';

        // Add close button
        const closeBtn = document.createElement('i');
        closeBtn.className = 'fas fa-times';
        closeBtn.style.cssText = `
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';

        // Assemble notification
        notification.appendChild(icon);
        notification.appendChild(messageEl);
        notification.appendChild(closeBtn);

        // Add to container
        this.container.appendChild(notification);

        // Auto dismiss
        const duration = options.duration || 5000;
        const timer = setTimeout(() => {
            this.dismiss(notification);
        }, duration);

        // Click to dismiss
        notification.onclick = () => {
            clearTimeout(timer);
            this.dismiss(notification);
        };

        // Hover effect
        notification.onmouseover = () => {
            notification.style.transform = 'translateX(-5px)';
            notification.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        };
        notification.onmouseout = () => {
            notification.style.transform = 'translateX(0)';
            notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        };

        return notification;
    }

    dismiss(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    // Custom notification with HTML
    custom(html, options = {}) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-custom';
        notification.innerHTML = html;

        notification.style.cssText = `
            padding: 20px;
            background: var(--color-bg-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            color: var(--color-text-primary);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        if (options.position === 'center') {
            notification.style.cssText += `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
            `;
            document.body.appendChild(notification);
        } else {
            this.container.appendChild(notification);
        }

        const duration = options.duration || 5000;
        setTimeout(() => {
            this.dismiss(notification);
        }, duration);

        return notification;
    }
}

// Add animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create global instance
window.notify = new NotificationManager();
