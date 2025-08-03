<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e(config('app.name')); ?> - Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
        }
        .bg-image {
            background-image: url(<?php echo e(url('storage/app/public/web-assets/images/login-bg.jpg')); ?>);
            background-size: cover;
            background-position: center;
        }
    </style>
</head>

<body>
<div class="container-fluid vh-100">
    <div class="row h-100">
        <div class="col-md-5 col-lg-4 d-flex flex-column justify-content-center bg-dark text-white p-5">
            <div class="mb-4">
                <h2 class="d-flex align-items-center gap-2">
                    <span>🍽️</span> <?php echo e(config('app.name')); ?>

                </h2>
            </div>

            <h3 class="mb-3">Login to continue</h3>
            <p class="mb-4">Enter your registered email address and password below</p>

            <form method="post" action="<?php echo e(route('checklogin')); ?>">
                <?php echo csrf_field(); ?>
                <div class="mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" name="email" class="form-control" id="email" placeholder="Email" required>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password *</label>
                    <input type="password" name="password" class="form-control" id="password" placeholder="Password" required>
                </div>

                <div class="mb-3 text-end">
                    <a href="#" class="text-danger text-decoration-none">Forgot Password?</a>
                </div>

                <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-danger">Sign In</button>
                </div>
            </form>

            <div class="text-center">
                Don't have an account? <a href="<?php echo e(url('/register')); ?>" class="text-danger text-decoration-none">Sign Up</a>
            </div>
        </div>

        <div class="col-md-7 col-lg-8 bg-image d-none d-md-block"></div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/auth/login.blade.php ENDPATH**/ ?>