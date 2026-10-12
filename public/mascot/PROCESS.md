# SPOT IT: mascot background extraction

Mode: built-in ImageGen, editing the supplied photograph with a transparent background. No CLI/API fallback was used.

Source: the plush mascot photograph on a pedestal, preserved in `public/references/spot-original.jpg`.

Output: `spot-plush.png`, an RGBA PNG used across the website and in the helper panel.

Exact generation prompt:

> Use case: background-extraction. Edit target: attached photo of the orange plush SPOT IT mascot. Extract ONLY the exact full-body plush mascot, removing city, people, sky, pedestal, lettering and ground. Preserve its exact rounded triangular silhouette, fuzzy orange fabric, seams, yellow face panel with slightly stepped upper edge, winking expression, black eye and eyebrows, orange cheeks, wide happy open mouth, short arms and yellow feet. Do not redesign, simplify, vectorize or change expression. Entire character fully visible, centered, tight square canvas with 6% clear padding, clean genuinely transparent alpha background, no white backdrop, no checkerboard, no text, no shadow from pedestal. A faithful high quality cutout of this exact character for a children's website.
