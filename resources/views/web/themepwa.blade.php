<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ @helper::appdata()->title }} @yield('page_title')</title>
    <link rel="icon" href="{{ helper::image_path(@helper::appdata()->favicon) }}">
    <!-- Favicon icon -->
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'web-assets/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'web-assets/css/style.css') }}">
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'web-assets/css/responsive.css') }}">
    <style>
        :root {
            --bs-primary: {{ helper::appdata()->web_primary_color != null ? helper::appdata()->web_primary_color : '#F82647' }};
            --bs-secondary: {{ helper::appdata()->web_secondary_color != null ? helper::appdata()->web_secondary_color : '#FFC344' }};
        }
    </style>
</head>

<body>
    <div class="d-none d-xl-block">
        <div class="arrow">
            <div class="arrow__body"></div>
        </div>
    </div>
    <section class="bg-gradient-color2 h-100 custom-padding position-relative">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="h-100 d-flex gap-3 justify-content-center flex-column">
                        <div class="logo">
                            <a href="{{ URL::to('/') }}">
                                <img src="{{ helper::image_path(@helper::appdata()->logo) }}" height="50"
                                    alt="">
                            </a>
                        </div>
                        <h1 class="text-capitalize text-white fw-600 col-xl-10 col-12">
                            {{ trans('labels.pwa_tital') }}
                        </h1>
                        <p class="text-white text-capitalize col-xl-10 fw-400 col-12 fs-17">
                            {{ trans('labels.description_pwa') }}
                        </p>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="h-100 d-flex justify-content-center flex-column">
                        <div class="smartphone shadow-lg">
                            <div class="content">
                                <iframe src="{{ URL::to('/') }}"
                                    style="width:100%; border:none; height:100%"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script src="{{ url(env('ASSETSPATHURL') . 'web-assets/js/jquery/jquery-3.6.0.js') }}"></script><!-- jQuery JS -->
    <script src="{{ url(env('ASSETSPATHURL') . 'web-assets/js/bootstrap/bootstrap.bundle.min.js') }}"></script><!-- Bootstrap CSS -->
</body>

</html>
