<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Keyword extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'total_result', 'user_id', 'ads_count', 'links_count', 'page_content'];

    public function contents(): HasMany
    {
        return $this->hasMany(Content::class);
    }
}
