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
            'name' => ['required', 'string'],
            'total_result' => ['nullable', 'string', 'max:255'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'ads_count' => ['nullable', 'integer'],
            'links_count' => ['nullable', 'integer'],
            'page_content' => ['nullable', 'string'],
            'contents' => ['required', 'array'],
            'contents.*.title' => ['string'],
            'contents.*.link' => ['string'],
            'contents.*.htmlRaw' => ['string'],
        ];
    }
}
