<?php

namespace Peppermint\MailBuilder\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class MailBuilderImageController extends Controller
{
    /**
     * Stores an image dropped into the builder and returns its public URL.
     *
     * @return JsonResponse{url: string}
     */
    public function store(Request $request): JsonResponse
    {
        $config = config('mail-builder.uploads');

        $validated = $request->validate([
            'image' => [
                'required',
                'file',
                'mimes:'.implode(',', $config['mimes']),
                'max:'.$config['max_kilobytes'],
            ],
        ]);

        $path = $validated['image']->store($config['path'], $config['disk']);

        return response()->json([
            'url' => Storage::disk($config['disk'])->url($path),
        ]);
    }
}
