<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order', function (Blueprint $table) {
            if (!Schema::hasColumn('order', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('order', 'is_pos_order')) {
                $table->tinyInteger('is_pos_order')->default(0);
            }
            if (!Schema::hasColumn('order', 'cashier_id')) {
                $table->unsignedBigInteger('cashier_id')->nullable();
            }
            if (!Schema::hasColumn('order', 'refund_status')) {
                $table->enum('refund_status', ['none', 'partial', 'full'])->default('none');
            }
            if (!Schema::hasColumn('order', 'refund_amount')) {
                $table->decimal('refund_amount', 10, 2)->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order', function (Blueprint $table) {
            if (Schema::hasColumn('order', 'branch_id')) {
                $table->dropColumn('branch_id');
            }
            if (Schema::hasColumn('order', 'is_pos_order')) {
                $table->dropColumn('is_pos_order');
            }
            if (Schema::hasColumn('order', 'cashier_id')) {
                $table->dropColumn('cashier_id');
            }
            if (Schema::hasColumn('order', 'refund_status')) {
                $table->dropColumn('refund_status');
            }
            if (Schema::hasColumn('order', 'refund_amount')) {
                $table->dropColumn('refund_amount');
            }
        });
    }
};
