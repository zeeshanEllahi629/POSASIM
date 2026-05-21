<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>POS - {{ @helper::appdata()->website_title ?? 'POS System' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="{{ url('public/css/pos.css') }}">
</head>
<body>
    <!-- ========== HEADER ========== -->
    <header class="pos-header">
        <div class="header-left">
            <div class="pos-logo">
                <i class="fas fa-cash-register"></i>
                <span>POS Terminal</span>
            </div>
        </div>
        <div class="header-center">
            <div class="header-stats">
                <div class="stat-item" id="stat-sales">
                    <i class="fas fa-receipt"></i>
                    <div>
                        <span class="stat-label">Sales</span>
                        <span class="stat-value" id="today-sales-count">0</span>
                    </div>
                </div>
                <div class="stat-item" id="stat-revenue">
                    <i class="fas fa-coins"></i>
                    <div>
                        <span class="stat-label">Revenue</span>
                        <span class="stat-value" id="today-revenue">{{ @helper::currency_format(0) }}</span>
                    </div>
                </div>
                <div class="stat-item" id="stat-clock">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="stat-label" id="current-date"></span>
                        <span class="stat-value" id="current-time"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="header-right">
            <div class="cashier-info">
                <i class="fas fa-user-circle"></i>
                <span>{{ Auth::user()->name }}</span>
            </div>
            <a href="{{ url('admin/home') }}" class="btn-exit" title="Exit POS">
                <i class="fas fa-arrow-right-from-bracket"></i>
            </a>
        </div>
    </header>

    <!-- ========== MAIN CONTENT ========== -->
    <div class="pos-container">
        <!-- ========== LEFT: PRODUCTS ========== -->
        <div class="pos-products">
            <!-- Search Bar -->
            <div class="search-section">
                <div class="search-box">
                    <i class="fas fa-barcode search-icon"></i>
                    <input type="text" id="pos-search" placeholder="Search products or scan barcode..." autocomplete="off">
                    <kbd class="search-shortcut">F1</kbd>
                </div>
            </div>

            <!-- Category Tabs -->
            <div class="category-tabs">
                <button class="cat-tab active" data-category="all">
                    <i class="fas fa-th-large"></i> All
                </button>
                @foreach($categories as $cat)
                <button class="cat-tab" data-category="{{ $cat->id }}">
                    {{ $cat->category_name }}
                </button>
                @endforeach
            </div>

            <!-- Products Grid -->
            <div class="products-grid" id="products-grid">
                @forelse($items as $item)
                <div class="product-card" data-id="{{ $item->id }}" data-name="{{ $item->item_name }}" data-price="{{ $item->price }}" data-has-variation="{{ $item->has_variation }}" data-image="{{ $item->image }}">
                    <div class="product-img">
                        @if($item->image)
                        <img src="{{ url(env('ASSETSPATHURL').'admin-assets/images/item/').'/'.$item->image }}" alt="{{ $item->item_name }}" loading="lazy">
                        @else
                        <div class="no-img"><i class="fas fa-utensils"></i></div>
                        @endif
                        @if($item->item_type == 1)
                        <span class="badge-veg"><i class="fas fa-leaf"></i></span>
                        @elseif($item->item_type == 2)
                        <span class="badge-nonveg"><i class="fas fa-drumstick-bite"></i></span>
                        @endif
                    </div>
                    <div class="product-info">
                        <h4 class="product-name">{{ $item->item_name }}</h4>
                        <div class="product-meta">
                            @if($item->category_info)
                            <span class="product-cat">{{ $item->category_info->category_name }}</span>
                            @endif
                            <span class="product-price">{{ @helper::currency_format($item->price) }}</span>
                        </div>
                    </div>
                </div>
                @empty
                <div class="empty-products">
                    <i class="fas fa-box-open"></i>
                    <p>No products found</p>
                </div>
                @endforelse
            </div>
        </div>

        <!-- ========== RIGHT: CART ========== -->
        <div class="pos-cart">
            <!-- Customer Selection -->
            <div class="customer-section">
                <button class="btn-customer" id="btn-select-customer">
                    <i class="fas fa-user-plus"></i>
                    <span id="selected-customer-name">Walk-in Customer</span>
                </button>
                <button class="btn-clear-customer" id="btn-clear-customer" style="display:none" title="Remove customer">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Cart Items -->
            <div class="cart-items" id="cart-items">
                <div class="cart-empty" id="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Cart is empty</p>
                    <span>Add items to get started</span>
                </div>
            </div>

            <!-- Totals -->
            <div class="cart-totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span id="cart-subtotal">{{ @helper::currency_format(0) }}</span>
                </div>
                <div class="total-row">
                    <span>Tax</span>
                    <span id="cart-tax">{{ @helper::currency_format(0) }}</span>
                </div>
                <div class="total-row discount-row" id="discount-row" style="display:none">
                    <span>
                        Discount
                        <button class="btn-remove-discount" id="btn-remove-discount" title="Remove discount"><i class="fas fa-times-circle"></i></button>
                    </span>
                    <span id="cart-discount">-{{ @helper::currency_format(0) }}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Grand Total</span>
                    <span id="cart-grand-total">{{ @helper::currency_format(0) }}</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="cart-actions">
                <div class="actions-row-top">
                    <button class="btn-action btn-discount" id="btn-discount" title="Apply Discount">
                        <i class="fas fa-percent"></i> Discount
                    </button>
                    <button class="btn-action btn-hold" id="btn-hold" title="Hold Cart (F2)">
                        <i class="fas fa-pause-circle"></i> Hold
                        <span class="held-badge" id="held-badge">{{ $heldCartsCount }}</span>
                    </button>
                    <button class="btn-action btn-recall" id="btn-recall" title="Recall Cart (F3)">
                        <i class="fas fa-history"></i> Recall
                    </button>
                </div>
                <div class="actions-row-bottom">
                    <button class="btn-action btn-clear" id="btn-clear-cart" title="Clear Cart (F8)">
                        <i class="fas fa-trash-alt"></i> Clear
                    </button>
                    <button class="btn-action btn-pay" id="btn-pay" title="Pay (F5)">
                        <i class="fas fa-credit-card"></i> Pay Now
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== PAYMENT MODAL ========== -->
    <div class="pos-modal" id="payment-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-payment">
            <div class="modal-header">
                <h3><i class="fas fa-credit-card"></i> Process Payment</h3>
                <button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="payment-total-display">
                    <span>Total Amount</span>
                    <h2 id="payment-total">{{ @helper::currency_format(0) }}</h2>
                </div>
                <div class="payment-methods">
                    <label class="payment-method-label">Payment Method</label>
                    <div class="payment-method-grid">
                        <button class="payment-method active" data-method="1">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>Cash</span>
                        </button>
                        <button class="payment-method" data-method="2">
                            <i class="fas fa-credit-card"></i>
                            <span>Card</span>
                        </button>
                        <button class="payment-method" data-method="3">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Mobile</span>
                        </button>
                        <button class="payment-method" data-method="4">
                            <i class="fas fa-wallet"></i>
                            <span>Wallet</span>
                        </button>
                    </div>
                </div>
                <div class="payment-cash-section" id="cash-section">
                    <div class="form-group">
                        <label>Amount Received</label>
                        <input type="number" id="amount-received" class="form-input" placeholder="0.00" step="0.01" autofocus>
                    </div>
                    <div class="change-display" id="change-display" style="display:none">
                        <span>Change</span>
                        <h3 id="change-amount">{{ @helper::currency_format(0) }}</h3>
                    </div>
                    <div class="quick-cash-buttons">
                        <button class="quick-cash" data-amount="exact">Exact</button>
                        <button class="quick-cash" data-amount="5">5</button>
                        <button class="quick-cash" data-amount="10">10</button>
                        <button class="quick-cash" data-amount="20">20</button>
                        <button class="quick-cash" data-amount="50">50</button>
                        <button class="quick-cash" data-amount="100">100</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Order Notes (Optional)</label>
                    <textarea id="payment-notes" class="form-input" rows="2" placeholder="Any notes..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-dismiss="modal">Cancel</button>
                <button class="btn-confirm" id="btn-confirm-payment">
                    <i class="fas fa-check-circle"></i> Confirm Payment
                </button>
            </div>
        </div>
    </div>

    <!-- ========== DISCOUNT MODAL ========== -->
    <div class="pos-modal" id="discount-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3><i class="fas fa-percent"></i> Apply Discount</h3>
                <button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="discount-type-toggle">
                    <button class="discount-type active" data-type="fixed">
                        <i class="fas fa-dollar-sign"></i> Fixed
                    </button>
                    <button class="discount-type" data-type="percentage">
                        <i class="fas fa-percent"></i> Percentage
                    </button>
                </div>
                <div class="form-group">
                    <label>Discount Amount</label>
                    <input type="number" id="discount-amount" class="form-input" placeholder="0.00" step="0.01" min="0">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-dismiss="modal">Cancel</button>
                <button class="btn-confirm" id="btn-apply-discount">
                    <i class="fas fa-check"></i> Apply
                </button>
            </div>
        </div>
    </div>

    <!-- ========== CUSTOMER MODAL ========== -->
    <div class="pos-modal" id="customer-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3><i class="fas fa-users"></i> Select Customer</h3>
                <button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" id="customer-search" class="form-input" placeholder="Search by name, phone or email...">
                </div>
                <div class="customer-list" id="customer-list">
                    <div class="customer-list-empty">
                        <i class="fas fa-search"></i>
                        <p>Search for a customer</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== HELD CARTS MODAL ========== -->
    <div class="pos-modal" id="held-carts-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-history"></i> Held Carts</h3>
                <button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="held-carts-list" id="held-carts-list">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Loading...
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== ITEM VARIATION MODAL ========== -->
    <div class="pos-modal" id="variation-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3><i class="fas fa-list-alt"></i> <span id="variation-item-name">Select Variation</span></h3>
                <button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="variation-list" id="variation-list"></div>
            </div>
        </div>
    </div>

    <!-- ========== SUCCESS OVERLAY ========== -->
    <div class="success-overlay" id="success-overlay" style="display:none">
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Payment Successful!</h2>
            <p id="success-order-number"></p>
            <div class="success-actions">
                <button class="btn-action btn-print-receipt" id="btn-print-receipt">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
                <button class="btn-action btn-new-sale" id="btn-new-sale">
                    <i class="fas fa-plus-circle"></i> New Sale
                </button>
            </div>
        </div>
    </div>

    <!-- ========== TOAST NOTIFICATIONS ========== -->
    <div class="toast-container" id="toast-container"></div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script>
        // Pass server data to JS
        const POS_CONFIG = {
            baseUrl: '{{ url("admin/pos") }}',
            csrfToken: '{{ csrf_token() }}',
            currencySymbol: '{{ @helper::appdata()->currency ?? "$" }}',
            currencyPosition: '{{ @helper::appdata()->currency_position ?? "left" }}',
            taxes: @json($taxes),
            categories: @json($categories),
            heldCartsCount: {{ $heldCartsCount }},
        };
    </script>
    <script src="{{ url('public/js/pos.js') }}"></script>
</body>
</html>
