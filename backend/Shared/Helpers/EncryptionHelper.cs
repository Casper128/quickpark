using System;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Helpers;

public static class EncryptionHelper
{
    public static string Hash(string value)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(value);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
