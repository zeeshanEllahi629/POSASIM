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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('users', 'loyalty_points')) {
                $table->integer('loyalty_points')->default(0)->after('type');
            }
            if (!Schema::hasColumn('users', 'loyalty_tier')) {
                $table->string('loyalty_tier', 50)->default('Bronze')->after('loyalty_points');
            }
            if (!Schema::hasColumn('users', '2fa_enabled')) {
                $table->tinyInteger('2fa_enabled')->default(0);
            }
            if (!Schema::hasColumn('users', '2fa_secret')) {
                $table->string('2fa_secret')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columnsToDrop = [];
            
            if (Schema::hasColumn('users', 'branch_id')) $columnsToDrop[] = 'branch_id';
            if (Schema::hasColumn('users', 'loyalty_points')) $columnsToDrop[] = 'loyalty_points';
            if (Schema::hasColumn('users', 'loyalty_tier')) $columnsToDrop[] = 'loyalty_tier';
            if (Schema::hasColumn('users', '2fa_enabled')) $columnsToDrop[] = '2fa_enabled';
            if (Schema::hasColumn('users', '2fa_secret')) $columnsToDrop[] = '2fa_secret';
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
