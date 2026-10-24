namespace backend.Common;

public static class ValidationExtensions
{
    /// <summary>
    /// Sanitizes user input by trimming whitespace and normalizing nulls.
    /// </summary>
    public static string? Sanitize(this string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return null;
        }

        return input.Trim();
    }

    /// <summary>
    /// Validates if an image URL is a valid absolute HTTP or HTTPS URL.
    /// </summary>
    public static bool IsValidImageUrl(this string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return false;
        }

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
