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
        Schema::table('primms', function (Blueprint $table) {
            $table->renameColumn('link_colab', 'kode_program');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('primms', function (Blueprint $table) {
            $table->renameColumn('kode_program', 'link_colab');
        });
    }
};
