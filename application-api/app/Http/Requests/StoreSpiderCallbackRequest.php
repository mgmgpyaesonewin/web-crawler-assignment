<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSpiderCallbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'keyword' => ['required', 'string', 'max:255'],
            'total_result' => ['string', 'max:255'],
            'contents' => ['required', 'array'],
            'contents.*.title' => ['string', 'max:255'],
            'contents.*.link' => ['string', 'max:255'],
            'contents.*.htmlRaw' => ['string', 'max:255'],
        ];
    }
}
