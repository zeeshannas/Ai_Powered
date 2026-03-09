<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiRequest extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'input_text',
        'output_text'
    ];
}
