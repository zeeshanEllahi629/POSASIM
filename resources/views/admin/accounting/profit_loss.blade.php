@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                    <h5 class="card-title mb-0"><i class="fa fa-chart-bar me-2"></i>Profit & Loss Statement</h5>
                    <form method="GET" class="d-flex align-items-center gap-2">
                        <label class="fw-bold mb-0">Year:</label>
                        <select name="year" class="form-select form-select-sm w-auto" onchange="this.form.submit()">
                            @for($i = date('Y'); $i >= date('Y') - 5; $i--)
                                <option value="{{ $i }}" {{ $year == $i ? 'selected' : '' }}>{{ $i }}</option>
                            @endfor
                        </select>
                    </form>
                </div>

                <!-- Monthly P&L Table -->
                <div class="table-responsive">
                    <table class="table table-bordered table-hover align-middle text-center">
                        <thead class="table-light">
                            <tr>
                                <th class="text-start">Month</th>
                                <th>Total Income (Sales)</th>
                                <th>Total Outgoings (Purchases + Expenses)</th>
                                <th>Net Profit / Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            @php
                                $totalYearIncome = 0;
                                $totalYearOutgoings = 0;
                                $totalYearProfit = 0;
                            @endphp
                            
                            @foreach($monthlyData as $data)
                                @php
                                    $totalYearIncome += $data['income'];
                                    $totalYearOutgoings += $data['expenses'];
                                    $totalYearProfit += $data['profit'];
                                @endphp
                                <tr>
                                    <td class="text-start fw-bold">{{ $data['month'] }}</td>
                                    <td class="text-success">{{ helper::currency_format($data['income']) }}</td>
                                    <td class="text-danger">{{ helper::currency_format($data['expenses']) }}</td>
                                    <td>
                                        @if($data['profit'] >= 0)
                                            <span class="badge bg-success fs-6">+{{ helper::currency_format($data['profit']) }}</span>
                                        @else
                                            <span class="badge bg-danger fs-6">{{ helper::currency_format($data['profit']) }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot class="table-dark">
                            <tr>
                                <th class="text-start fs-5">Year Total</th>
                                <th class="text-success fs-5">{{ helper::currency_format($totalYearIncome) }}</th>
                                <th class="text-danger fs-5">{{ helper::currency_format($totalYearOutgoings) }}</th>
                                <th class="fs-5">
                                    @if($totalYearProfit >= 0)
                                        <span class="text-success">+{{ helper::currency_format($totalYearProfit) }}</span>
                                    @else
                                        <span class="text-danger">{{ helper::currency_format($totalYearProfit) }}</span>
                                    @endif
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="mt-4 text-end">
                    <button class="btn btn-outline-success" onclick="window.print()"><i class="fa fa-print me-1"></i> Print Report</button>
                    <button class="btn btn-primary"><i class="fa fa-file-excel me-1"></i> Export to Excel</button>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('style')
<style>
    @media print {
        body * { visibility: hidden; }
        .card, .card * { visibility: visible; }
        .card { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
        .btn, form { display: none !important; }
    }
</style>
@endsection
