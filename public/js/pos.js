/**
 * POS System JavaScript
 * Complete billing interface with cart, payment, hold/recall, and barcode support
 */
(function($) {
    'use strict';

    // ==================== POS APPLICATION ====================
    const POS = {
        cart: [],
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        discountType: 'fixed',
        grandTotal: 0,
        selectedCustomer: null,
        selectedPaymentMethod: '1',
        heldCartId: null,
        barcodeBuffer: '',
        barcodeTimer: null,
        searchTimer: null,

        // ==================== INITIALIZATION ====================
        init: function() {
            this.bindEvents();
            this.setupKeyboardShortcuts();
            this.setupBarcodeScannerListener();
            this.startClock();
            this.loadTodaySummary();
            console.log('POS System initialized');
        },

        // ==================== EVENT BINDINGS ====================
        bindEvents: function() {
            const self = this;

            // Product cards click
            $(document).on('click', '.product-card', function() {
                self.handleProductClick($(this));
            });

            // Category tabs
            $(document).on('click', '.cat-tab', function() {
                $('.cat-tab').removeClass('active');
                $(this).addClass('active');
                self.loadProductsByCategory($(this).data('category'));
            });

            // Search
            $('#pos-search').on('input', function() {
                const query = $(this).val().trim();
                clearTimeout(self.searchTimer);
                if (query.length >= 2) {
                    self.searchTimer = setTimeout(() => self.searchProducts(query), 300);
                } else if (query.length === 0) {
                    self.loadProductsByCategory('all');
                }
            });

            // Cart quantity controls
            $(document).on('click', '.qty-btn-plus', function() {
                const index = $(this).closest('.cart-item').data('index');
                self.updateQuantity(index, self.cart[index].quantity + 1);
            });
            $(document).on('click', '.qty-btn-minus', function() {
                const index = $(this).closest('.cart-item').data('index');
                if (self.cart[index].quantity > 1) {
                    self.updateQuantity(index, self.cart[index].quantity - 1);
                } else {
                    self.removeFromCart(index);
                }
            });
            $(document).on('click', '.cart-item-remove', function() {
                const index = $(this).closest('.cart-item').data('index');
                self.removeFromCart(index);
            });

            // Action buttons
            $('#btn-clear-cart').on('click', () => self.clearCart());
            $('#btn-hold').on('click', () => self.holdCart());
            $('#btn-recall').on('click', () => self.showHeldCarts());
            $('#btn-pay').on('click', () => self.showPaymentModal());
            $('#btn-discount').on('click', () => self.showModal('discount-modal'));
            $('#btn-remove-discount').on('click', () => self.removeDiscount());

            // Customer
            $('#btn-select-customer').on('click', () => self.showModal('customer-modal'));
            $('#btn-clear-customer').on('click', () => self.clearCustomer());
            $('#customer-search').on('input', function() {
                const q = $(this).val().trim();
                clearTimeout(self.searchTimer);
                if (q.length >= 2) {
                    self.searchTimer = setTimeout(() => self.searchCustomers(q), 300);
                }
            });

            // Payment modal
            $('#btn-confirm-payment').on('click', () => self.processPayment());
            $(document).on('click', '.payment-method', function() {
                $('.payment-method').removeClass('active');
                $(this).addClass('active');
                self.selectedPaymentMethod = $(this).data('method');
                if (self.selectedPaymentMethod == '1') {
                    $('#cash-section').show();
                } else {
                    $('#cash-section').hide();
                }
            });
            $('#amount-received').on('input', function() {
                self.calculateChange();
            });
            $(document).on('click', '.quick-cash', function() {
                const amount = $(this).data('amount');
                if (amount === 'exact') {
                    $('#amount-received').val(self.grandTotal.toFixed(2));
                } else {
                    $('#amount-received').val(amount);
                }
                self.calculateChange();
            });

            // Discount modal
            $(document).on('click', '.discount-type', function() {
                $('.discount-type').removeClass('active');
                $(this).addClass('active');
                self.discountType = $(this).data('type');
            });
            $('#btn-apply-discount').on('click', () => self.applyDiscount());

            // Modal controls
            $(document).on('click', '.modal-overlay, .modal-close, [data-dismiss="modal"]', function() {
                self.closeAllModals();
            });
            $(document).on('click', '.modal-content', function(e) {
                e.stopPropagation();
            });

            // Held cart actions
            $(document).on('click', '.btn-recall-cart', function() {
                self.recallCart($(this).data('id'));
            });
            $(document).on('click', '.btn-delete-cart', function() {
                self.deleteHeldCart($(this).data('id'));
            });

            // Variation selection
            $(document).on('click', '.variation-item', function() {
                self.addVariationToCart($(this));
            });

            // Customer selection
            $(document).on('click', '.customer-item', function() {
                self.selectCustomer($(this));
            });

            // Success overlay
            $('#btn-new-sale').on('click', () => self.newSale());
            $('#btn-print-receipt').on('click', function() {
                const orderId = $(this).data('order-id');
                self.printReceipt(orderId);
            });
        },

        // ==================== KEYBOARD SHORTCUTS ====================
        setupKeyboardShortcuts: function() {
            const self = this;
            $(document).on('keydown', function(e) {
                // Don't trigger shortcuts when typing in inputs
                if ($(e.target).is('input, textarea, select')) {
                    if (e.key === 'Escape') {
                        self.closeAllModals();
                        $(e.target).blur();
                    }
                    return;
                }

                switch(e.key) {
                    case 'F1':
                        e.preventDefault();
                        $('#pos-search').focus();
                        break;
                    case 'F2':
                        e.preventDefault();
                        self.holdCart();
                        break;
                    case 'F3':
                        e.preventDefault();
                        self.showHeldCarts();
                        break;
                    case 'F5':
                        e.preventDefault();
                        self.showPaymentModal();
                        break;
                    case 'F8':
                        e.preventDefault();
                        self.clearCart();
                        break;
                    case 'Escape':
                        self.closeAllModals();
                        break;
                }
            });
        },

        // ==================== BARCODE SCANNER ====================
        setupBarcodeScannerListener: function() {
            const self = this;
            $(document).on('keypress', function(e) {
                if ($(e.target).is('input, textarea')) return;

                clearTimeout(self.barcodeTimer);
                if (e.key === 'Enter' && self.barcodeBuffer.length > 3) {
                    self.searchProducts(self.barcodeBuffer);
                    self.barcodeBuffer = '';
                    return;
                }
                self.barcodeBuffer += e.key;
                self.barcodeTimer = setTimeout(() => { self.barcodeBuffer = ''; }, 100);
            });
        },

        // ==================== PRODUCT ACTIONS ====================
        handleProductClick: function($card) {
            const hasVariation = $card.data('has-variation');
            const itemId = $card.data('id');

            if (hasVariation == 1) {
                this.showVariationModal(itemId);
            } else {
                const item = {
                    id: itemId,
                    name: $card.data('name'),
                    price: parseFloat($card.data('price')),
                    quantity: 1,
                    variation_id: null,
                    variation_name: '',
                    image: $card.data('image') || '',
                    addons_name: '',
                    addons_price: '',
                    addons_total: 0,
                    extras_name: '',
                    extras_price: '',
                    extras_total: 0
                };
                this.addToCart(item);
            }
        },

        showVariationModal: function(itemId) {
            const self = this;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/item-details',
                data: { item_id: itemId },
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        const item = res.item;
                        const variations = res.variations;
                        $('#variation-item-name').text(item.item_name);
                        let html = '';
                        if (variations && variations.length > 0) {
                            variations.forEach(v => {
                                html += `<div class="variation-item" 
                                    data-item-id="${item.id}" 
                                    data-item-name="${item.item_name}" 
                                    data-variation-id="${v.id}" 
                                    data-variation-name="${v.name}" 
                                    data-price="${v.price}"
                                    data-image="${item.image || ''}">
                                    <span class="var-name">${v.name}</span>
                                    <span class="var-price">${self.formatCurrency(v.price)}</span>
                                </div>`;
                            });
                        } else {
                            html = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No variations available</p>';
                        }
                        $('#variation-list').html(html);
                        self.showModal('variation-modal');
                    }
                }
            });
        },

        addVariationToCart: function($el) {
            const item = {
                id: $el.data('item-id'),
                name: $el.data('item-name') + ' - ' + $el.data('variation-name'),
                price: parseFloat($el.data('price')),
                quantity: 1,
                variation_id: $el.data('variation-id'),
                variation_name: $el.data('variation-name'),
                image: $el.data('image') || '',
                addons_name: '',
                addons_price: '',
                addons_total: 0,
                extras_name: '',
                extras_price: '',
                extras_total: 0
            };
            this.addToCart(item);
            this.closeAllModals();
        },

        searchProducts: function(query) {
            const self = this;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/search',
                data: { query: query },
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        self.renderProducts(res.items);
                    }
                }
            });
        },

        loadProductsByCategory: function(categoryId) {
            const self = this;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/items-by-category',
                data: { category_id: categoryId },
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        self.renderProducts(res.items);
                    }
                }
            });
        },

        renderProducts: function(items) {
            const grid = $('#products-grid');
            if (!items || items.length === 0) {
                grid.html(`<div class="empty-products"><i class="fas fa-box-open"></i><p>No products found</p></div>`);
                return;
            }
            let html = '';
            items.forEach(item => {
                const imgUrl = item.image
                    ? (item.item_image && item.item_image.image_url ? item.item_image.image_url : '')
                    : '';
                const catName = item.category_info ? item.category_info.category_name : '';
                html += `
                <div class="product-card" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-has-variation="${item.has_variation}" data-image="${item.image || ''}">
                    <div class="product-img">
                        ${imgUrl ? `<img src="${imgUrl}" alt="${item.item_name}" loading="lazy">` : `<div class="no-img"><i class="fas fa-utensils"></i></div>`}
                        ${item.item_type == 1 ? '<span class="badge-veg"><i class="fas fa-leaf"></i></span>' : ''}
                        ${item.item_type == 2 ? '<span class="badge-nonveg"><i class="fas fa-drumstick-bite"></i></span>' : ''}
                    </div>
                    <div class="product-info">
                        <h4 class="product-name">${item.item_name}</h4>
                        <div class="product-meta">
                            <span class="product-cat">${catName}</span>
                            <span class="product-price">${this.formatCurrency(item.price)}</span>
                        </div>
                    </div>
                </div>`;
            });
            grid.html(html);
        },

        // ==================== CART OPERATIONS ====================
        addToCart: function(item) {
            // Check if same item + variation already exists
            const existingIndex = this.cart.findIndex(ci =>
                ci.id === item.id && ci.variation_id === item.variation_id
            );

            if (existingIndex > -1) {
                this.cart[existingIndex].quantity += 1;
            } else {
                this.cart.push(item);
            }

            this.calculateTotals();
            this.renderCart();
            this.showNotification(`${item.name} added to cart`, 'success');
        },

        removeFromCart: function(index) {
            this.cart.splice(index, 1);
            this.calculateTotals();
            this.renderCart();
        },

        updateQuantity: function(index, qty) {
            if (qty < 1) return;
            this.cart[index].quantity = qty;
            this.calculateTotals();
            this.renderCart();
        },

        clearCart: function() {
            if (this.cart.length === 0) return;
            if (!confirm('Clear all items from cart?')) return;
            this.cart = [];
            this.discountAmount = 0;
            this.heldCartId = null;
            this.calculateTotals();
            this.renderCart();
            $('#discount-row').hide();
            this.showNotification('Cart cleared', 'info');
        },

        calculateTotals: function() {
            this.subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Calculate tax
            this.taxAmount = 0;
            if (POS_CONFIG.taxes && POS_CONFIG.taxes.length > 0) {
                POS_CONFIG.taxes.forEach(tax => {
                    if (tax.type === 'percentage' || tax.type === 1) {
                        this.taxAmount += (this.subtotal * parseFloat(tax.tax || 0)) / 100;
                    } else {
                        this.taxAmount += parseFloat(tax.tax || 0);
                    }
                });
            }

            // Calculate discount
            let discount = 0;
            if (this.discountAmount > 0) {
                if (this.discountType === 'percentage') {
                    discount = (this.subtotal * this.discountAmount) / 100;
                } else {
                    discount = this.discountAmount;
                }
            }

            this.grandTotal = Math.max(0, this.subtotal + this.taxAmount - discount);

            // Update UI
            $('#cart-subtotal').text(this.formatCurrency(this.subtotal));
            $('#cart-tax').text(this.formatCurrency(this.taxAmount));
            $('#cart-discount').text('-' + this.formatCurrency(discount));
            $('#cart-grand-total').text(this.formatCurrency(this.grandTotal));
        },

        renderCart: function() {
            const container = $('#cart-items');
            const empty = $('#cart-empty');

            if (this.cart.length === 0) {
                container.html(`<div class="cart-empty" id="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Cart is empty</p>
                    <span>Add items to get started</span>
                </div>`);
                return;
            }

            let html = '';
            this.cart.forEach((item, index) => {
                const lineTotal = item.price * item.quantity;
                html += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${this.formatCurrency(item.price)} each</div>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn qty-btn-minus"><i class="fas fa-minus"></i></button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn qty-btn-plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <span class="cart-item-total">${this.formatCurrency(lineTotal)}</span>
                    <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
                </div>`;
            });
            container.html(html);
        },

        // ==================== DISCOUNT ====================
        applyDiscount: function() {
            const amount = parseFloat($('#discount-amount').val());
            if (isNaN(amount) || amount <= 0) {
                this.showNotification('Enter a valid discount amount', 'error');
                return;
            }

            this.discountAmount = amount;
            this.discountType = $('.discount-type.active').data('type');
            this.calculateTotals();
            $('#discount-row').show();
            this.closeAllModals();
            this.showNotification('Discount applied', 'success');
        },

        removeDiscount: function() {
            this.discountAmount = 0;
            this.calculateTotals();
            $('#discount-row').hide();
            this.showNotification('Discount removed', 'info');
        },

        // ==================== CUSTOMER ====================
        searchCustomers: function(query) {
            const self = this;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/customers',
                data: { query: query },
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1 && res.customers.length > 0) {
                        let html = '';
                        res.customers.forEach(c => {
                            html += `
                            <div class="customer-item" data-id="${c.id}" data-name="${c.name}" data-phone="${c.mobile || ''}" data-email="${c.email || ''}">
                                <div class="ci-icon"><i class="fas fa-user"></i></div>
                                <div class="ci-info">
                                    <h4>${c.name}</h4>
                                    <span>${c.mobile || ''} ${c.email ? '| ' + c.email : ''}</span>
                                </div>
                            </div>`;
                        });
                        $('#customer-list').html(html);
                    } else {
                        $('#customer-list').html('<div class="customer-list-empty"><i class="fas fa-user-slash"></i><p>No customers found</p></div>');
                    }
                }
            });
        },

        selectCustomer: function($el) {
            this.selectedCustomer = {
                id: $el.data('id'),
                name: $el.data('name'),
                phone: $el.data('phone'),
                email: $el.data('email')
            };
            $('#selected-customer-name').text(this.selectedCustomer.name);
            $('#btn-clear-customer').show();
            this.closeAllModals();
            this.showNotification('Customer: ' + this.selectedCustomer.name, 'success');
        },

        clearCustomer: function() {
            this.selectedCustomer = null;
            $('#selected-customer-name').text('Walk-in Customer');
            $('#btn-clear-customer').hide();
        },

        // ==================== HOLD / RECALL ====================
        holdCart: function() {
            if (this.cart.length === 0) {
                this.showNotification('Cart is empty', 'error');
                return;
            }
            const self = this;
            const data = {
                items: this.cart,
                customer_id: this.selectedCustomer ? this.selectedCustomer.id : null,
                subtotal: this.subtotal,
                tax_amount: this.taxAmount,
                discount_amount: this.discountAmount,
                grand_total: this.grandTotal,
                notes: ''
            };

            $.ajax({
                url: POS_CONFIG.baseUrl + '/hold-cart',
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        self.cart = [];
                        self.discountAmount = 0;
                        self.heldCartId = null;
                        self.calculateTotals();
                        self.renderCart();
                        $('#discount-row').hide();
                        $('#held-badge').text(res.held_count || 0);
                        self.showNotification('Cart held: ' + res.reference_no, 'success');
                    } else {
                        self.showNotification(res.message || 'Failed to hold cart', 'error');
                    }
                },
                error: function() {
                    self.showNotification('Failed to hold cart', 'error');
                }
            });
        },

        showHeldCarts: function() {
            const self = this;
            this.showModal('held-carts-modal');
            $('#held-carts-list').html('<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>');

            $.ajax({
                url: POS_CONFIG.baseUrl + '/held-carts',
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1 && res.carts.length > 0) {
                        let html = '';
                        res.carts.forEach(cart => {
                            const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
                            const itemCount = items ? items.length : 0;
                            const time = new Date(cart.created_at).toLocaleTimeString();
                            html += `
                            <div class="held-cart-item">
                                <div class="held-cart-info">
                                    <h4>${cart.reference_no}</h4>
                                    <span>${itemCount} items · ${self.formatCurrency(cart.total)} · ${time}</span>
                                </div>
                                <div class="held-cart-actions">
                                    <button class="btn-recall-cart" data-id="${cart.id}"><i class="fas fa-undo"></i> Recall</button>
                                    <button class="btn-delete-cart" data-id="${cart.id}"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>`;
                        });
                        $('#held-carts-list').html(html);
                    } else {
                        $('#held-carts-list').html('<div class="customer-list-empty"><i class="fas fa-inbox"></i><p>No held carts</p></div>');
                    }
                },
                error: function() {
                    $('#held-carts-list').html('<div class="customer-list-empty"><i class="fas fa-exclamation-triangle"></i><p>Failed to load</p></div>');
                }
            });
        },

        recallCart: function(id) {
            const self = this;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/recall-cart/' + id,
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        const cart = res.cart;
                        const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
                        self.cart = items || [];
                        self.heldCartId = cart.id;
                        self.discountAmount = parseFloat(cart.discount_amount) || 0;
                        self.calculateTotals();
                        self.renderCart();
                        if (self.discountAmount > 0) $('#discount-row').show();
                        self.closeAllModals();
                        self.showNotification('Cart recalled: ' + cart.reference_no, 'success');
                    }
                }
            });
        },

        deleteHeldCart: function(id) {
            const self = this;
            if (!confirm('Delete this held cart?')) return;
            $.ajax({
                url: POS_CONFIG.baseUrl + '/held-cart/' + id,
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        $('#held-badge').text(res.held_count || 0);
                        self.showHeldCarts(); // Refresh list
                        self.showNotification('Held cart deleted', 'info');
                    }
                }
            });
        },

        // ==================== PAYMENT ====================
        showPaymentModal: function() {
            if (this.cart.length === 0) {
                this.showNotification('Cart is empty', 'error');
                return;
            }
            $('#payment-total').text(this.formatCurrency(this.grandTotal));
            $('#amount-received').val('');
            $('#change-display').hide();
            $('#payment-notes').val('');
            this.showModal('payment-modal');
            setTimeout(() => $('#amount-received').focus(), 300);
        },

        calculateChange: function() {
            const received = parseFloat($('#amount-received').val()) || 0;
            const change = received - this.grandTotal;
            if (received > 0) {
                $('#change-display').show();
                $('#change-amount').text(this.formatCurrency(Math.max(0, change)));
                if (change < 0) {
                    $('#change-display').css('border-color', 'var(--danger)');
                    $('#change-amount').css('color', 'var(--danger)');
                } else {
                    $('#change-display').css('border-color', 'var(--primary)');
                    $('#change-amount').css('color', 'var(--primary)');
                }
            } else {
                $('#change-display').hide();
            }
        },

        processPayment: function() {
            const self = this;
            const paymentMethod = this.selectedPaymentMethod;

            // For cash, validate amount received
            if (paymentMethod == '1') {
                const received = parseFloat($('#amount-received').val()) || 0;
                if (received < this.grandTotal) {
                    this.showNotification('Insufficient amount received', 'error');
                    return;
                }
            }

            // Disable button
            $('#btn-confirm-payment').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processing...');

            const data = {
                items: this.cart,
                customer_id: this.selectedCustomer ? this.selectedCustomer.id : null,
                customer_name: this.selectedCustomer ? this.selectedCustomer.name : 'Walk-in Customer',
                customer_phone: this.selectedCustomer ? this.selectedCustomer.phone : '',
                customer_email: this.selectedCustomer ? this.selectedCustomer.email : '',
                payment_method: paymentMethod,
                subtotal: this.subtotal,
                tax_amount: this.taxAmount,
                discount_amount: this.discountAmount,
                grand_total: this.grandTotal,
                notes: $('#payment-notes').val(),
                held_cart_id: this.heldCartId
            };

            $.ajax({
                url: POS_CONFIG.baseUrl + '/process-payment',
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        self.closeAllModals();
                        self.showSuccessOverlay(res.order_id, res.order_number);
                        self.loadTodaySummary();
                    } else {
                        self.showNotification(res.message || 'Payment failed', 'error');
                    }
                },
                error: function(xhr) {
                    const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Payment failed';
                    self.showNotification(msg, 'error');
                },
                complete: function() {
                    $('#btn-confirm-payment').prop('disabled', false).html('<i class="fas fa-check-circle"></i> Confirm Payment');
                }
            });
        },

        showSuccessOverlay: function(orderId, orderNumber) {
            $('#success-order-number').text('Order #' + orderNumber);
            $('#btn-print-receipt').data('order-id', orderId);
            $('#success-overlay').fadeIn(300);
        },

        newSale: function() {
            this.cart = [];
            this.discountAmount = 0;
            this.heldCartId = null;
            this.selectedCustomer = null;
            this.calculateTotals();
            this.renderCart();
            this.clearCustomer();
            $('#discount-row').hide();
            $('#success-overlay').fadeOut(300);
        },

        printReceipt: function(orderId) {
            window.open(POS_CONFIG.baseUrl + '/print-receipt/' + orderId, '_blank', 'width=400,height=600');
        },

        // ==================== MODALS ====================
        showModal: function(modalId) {
            $('#' + modalId).addClass('active');
        },

        closeAllModals: function() {
            $('.pos-modal').removeClass('active');
        },

        // ==================== NOTIFICATIONS ====================
        showNotification: function(message, type) {
            type = type || 'success';
            const iconMap = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
            const toast = $(`
                <div class="toast ${type}">
                    <i class="fas ${iconMap[type]} toast-icon"></i>
                    <span>${message}</span>
                </div>
            `);
            $('#toast-container').append(toast);
            setTimeout(() => toast.fadeOut(300, () => toast.remove()), 3000);
        },

        // ==================== UTILITIES ====================
        formatCurrency: function(amount) {
            const num = parseFloat(amount) || 0;
            const formatted = num.toFixed(2);
            const symbol = POS_CONFIG.currencySymbol || '$';
            if (POS_CONFIG.currencyPosition === 'right') {
                return formatted + symbol;
            }
            return symbol + formatted;
        },

        startClock: function() {
            const updateClock = () => {
                const now = new Date();
                $('#current-time').text(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                $('#current-date').text(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
            };
            updateClock();
            setInterval(updateClock, 1000);
        },

        loadTodaySummary: function() {
            $.ajax({
                url: POS_CONFIG.baseUrl + '/today-summary',
                headers: { 'X-CSRF-TOKEN': POS_CONFIG.csrfToken },
                success: function(res) {
                    if (res.status === 1) {
                        $('#today-sales-count').text(res.total_sales || 0);
                        $('#today-revenue').text(POS_CONFIG.currencySymbol + (res.total_revenue || '0.00'));
                    }
                }
            });
        }
    };

    // ==================== INITIALIZE ON DOM READY ====================
    $(document).ready(function() {
        POS.init();
    });

})(jQuery);
