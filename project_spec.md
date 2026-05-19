# Foodefy Project Specification

## Overview
Foodefy is a web application built on the Laravel framework. Given the repository name and installed packages, it functions as a restaurant management, food delivery, and point-of-sale (POS) system.

## Tech Stack
### Backend
- **Framework:** Laravel 10.10+
- **Language:** PHP 8.1+
- **Authentication:** Laravel Sanctum (for APIs) and Laravel Socialite (for OAuth/social login)
- **PDF Generation:** DOMPDF (`barryvdh/laravel-dompdf`)
- **Excel/CSV Management:** Laravel Excel (`maatwebsite/excel`)
- **Web Installer:** Laravel Installer (`froiden/laravel-installer`)

### Frontend
- **Bundler:** Vite 5.0+
- **HTTP Client:** Axios
- **Integration:** Laravel Vite Plugin

## Payment Gateways Integration
The application is equipped to handle international and regional transactions, supporting multiple payment providers:
- **Stripe** (`stripe/stripe-php`)
- **PayPal** (`omnipay/paypal`)
- **Mollie** (`mollie/laravel-mollie`)
- **MyFatoorah** (`myfatoorah/laravel-package` - popular in the MENA region)
- **Xendit** (`xendit/xendit-php` - popular in Southeast Asia)

## Additional Capabilities
- **Cookie Consent:** Built-in compliance via `spatie/laravel-cookie-consent`
- **Spam Protection:** Google ReCaptcha v3 integration via `josiasmontag/laravel-recaptchav3`

## Development & Testing Tools
- **Testing Framework:** PHPUnit 10 & Pest support
- **Mocking:** Mockery
- **Code Formatting:** Laravel Pint
- **Local Environment:** Laravel Sail (Docker)
- **Debugging:** Spatie Laravel Ignition & Nunomaduro Collision

## System Architecture
The repository follows a standard Laravel MVC directory structure:
- `app/` - Core application logic, including Controllers, Models, and Middleware
- `routes/` - Definition of web and API endpoints
- `resources/` - Frontend assets (CSS/JS) and Blade templates
- `public/` - The document root containing compiled assets and `index.php`
- `config/` - Application configuration files
- `database/` - Database migrations, factories, and seeders
- `tests/` - PHPUnit test suites
- `admin-assets/` - Custom directory likely containing static assets for the administrative dashboard
