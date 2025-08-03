<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e(config('app.name')); ?> - Register</title>
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

            <h3 class="mb-3">Sign Up</h3>
            <p class="mb-4">Fill up below details and create your Account.</p>

            <form method="post" action="<?php echo e(route('checklogin')); ?>">
                <?php echo csrf_field(); ?>
                <div class="mb-2">
                    <label for="name" class="form-label">Full Name *</label>
                    <input type="text" class="form-control" name="name" id="name" placeholder="Full Name" required>
                </div>
                <div class="row mb-2 mt-3">
                    <div class="col-md-6">
                        <div class="">
                            <label for="email" class="form-label">Email *</label>
                            <input type="email" class="form-control" name="email" id="email" placeholder="Email" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="">
                            <label for="mobile" class="form-label">Mobile *</label>
                            <input type="text" class="form-control" name="mobile" id="mobile" placeholder="Mobile" required>
                        </div>
                    </div>
                </div>
                <div class="row mb-2 mt-3">
                    <div class="col-md-6">
                        <div class="">
                            <label for="password" class="form-label">Password *</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="">
                            <label for="confirm_password" class="form-label">Confirm Password *</label>
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required>
                        </div>
                    </div>
                </div>

                <div class="d-grid mb-3 mt-4">
                    <button type="submit" class="btn btn-danger">Sign Up</button>
                </div>
            </form>

            <div class="text-center">
                Already have an account? <a href="<?php echo e(url('/login')); ?>" class="text-danger text-decoration-none">Sign In</a>
            </div>
        </div>

        <div class="col-md-7 col-lg-8 bg-image d-none d-md-block"></div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/auth/register.blade.php ENDPATH**/ ?>