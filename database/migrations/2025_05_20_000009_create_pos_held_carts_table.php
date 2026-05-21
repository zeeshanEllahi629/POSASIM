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
        Schema::create('pos_held_carts', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();
            $table->unsignedBigInteger('cashier_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->json('items');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['held', 'completed', 'cancelled'])->default('held');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_held_carts');
    }
};
