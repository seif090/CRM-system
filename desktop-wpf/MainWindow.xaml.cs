using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Windows;
using System.Windows.Input;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

namespace ErpCrmDesktop;

public partial class MainWindow : Window
{
    private HttpListener? _httpListener;
    private readonly int _port = 3000;
    private readonly string _appUrl;
    private readonly string _backendUrl;
    private readonly string? _frontendDist;

    private static readonly Dictionary<string, string> MimeTypes = new()
    {
        [".html"] = "text/html; charset=utf-8",
        [".js"] = "application/javascript",
        [".css"] = "text/css",
        [".json"] = "application/json",
        [".png"] = "image/png",
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg",
        [".svg"] = "image/svg+xml",
        [".ico"] = "image/x-icon",
        [".woff"] = "font/woff",
        [".woff2"] = "font/woff2",
        [".ttf"] = "font/ttf",
        [".map"] = "application/json",
        [".txt"] = "text/plain",
        [".xml"] = "application/xml",
        [".webmanifest"] = "application/manifest+json",
    };

    public MainWindow()
    {
        InitializeComponent();

        _appUrl = Environment.GetEnvironmentVariable("APP_URL") ?? "";
        _backendUrl = Environment.GetEnvironmentVariable("BACKEND_URL") ?? "http://localhost:8000";
        _frontendDist = FindFrontendDist();
    }

    private string? FindFrontendDist()
    {
        var exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? "";
        var candidates = new[]
        {
            Path.Combine(exeDir, "..", "..", "..", "..", "frontend", "dist"),
            Path.Combine(exeDir, "..", "..", "..", "..", "..", "frontend", "dist"),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "frontend", "dist"),
            Path.Combine(Directory.GetCurrentDirectory(), "frontend", "dist"),
        };

        foreach (var candidate in candidates)
        {
            var fullPath = Path.GetFullPath(candidate);
            if (File.Exists(Path.Combine(fullPath, "index.html")))
            {
                return fullPath;
            }
        }
        return null;
    }

    private async void Window_Loaded(object sender, RoutedEventArgs e)
    {
        try
        {
            var env = await CoreWebView2Environment.CreateAsync();
            await WebView.EnsureCoreWebView2Async(env);

            WebView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            WebView.CoreWebView2.Settings.IsStatusBarEnabled = false;

            WebView.CoreWebView2.NavigationStarting += (_, args) =>
            {
                StatusText.Text = "Loading...";
                UrlText.Text = args.Uri;
            };

            WebView.CoreWebView2.NavigationCompleted += (_, args) =>
            {
                StatusText.Text = args.IsSuccess ? "Ready" : "Navigation failed";
                if (args.IsSuccess)
                {
                    LoadingOverlay.Visibility = Visibility.Collapsed;
                    ErrorOverlay.Visibility = Visibility.Collapsed;
                    WebView.Visibility = Visibility.Visible;
                }
            };

            WebView.CoreWebView2.WebMessageReceived += (_, args) =>
            {
                if (args.WebMessageAsJson == "\"devtools\"")
                    WebView.CoreWebView2.OpenDevToolsWindow();
            };

            var targetUrl = await ResolveTargetUrl();
            if (targetUrl != null)
            {
                WebView.CoreWebView2.Navigate(targetUrl);
            }
            else
            {
                ShowError("No server available. Run the frontend dev server or set APP_URL.");
            }
        }
        catch (Exception ex)
        {
            ShowError($"WebView2 initialization failed: {ex.Message}\n\nInstall WebView2 Runtime from https://developer.microsoft.com/en-us/microsoft-edge/webview2/");
        }
    }

    private async Task<string?> ResolveTargetUrl()
    {
        if (!string.IsNullOrEmpty(_appUrl))
        {
            if (await IsReachable(_appUrl))
                return _appUrl;
            return null;
        }

        if (_frontendDist != null)
        {
            try
            {
                await StartLocalServer();
                var url = $"http://127.0.0.1:{_port}";
                if (await IsReachable(url))
                    return url;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to start local server: {ex.Message}");
            }
        }

        var fallback = "http://localhost:3000";
        if (await IsReachable(fallback))
            return fallback;

        return null;
    }

    private void ShowError(string message)
    {
        LoadingOverlay.Visibility = Visibility.Collapsed;
        WebView.Visibility = Visibility.Collapsed;
        ErrorOverlay.Visibility = Visibility.Visible;
        ErrorDetail.Text = message;
        StatusText.Text = "Error";
    }

    private async void Error_Retry(object sender, RoutedEventArgs e)
    {
        LoadingOverlay.Visibility = Visibility.Visible;
        ErrorOverlay.Visibility = Visibility.Collapsed;
        StatusText.Text = "Connecting...";

        var targetUrl = await ResolveTargetUrl();
        if (targetUrl != null)
        {
            WebView.CoreWebView2.Navigate(targetUrl);
        }
        else
        {
            ShowError("Still cannot connect. Make sure the server is running.");
        }
    }

    private async Task StartLocalServer()
    {
        if (_httpListener != null && _httpListener.IsListening) return;

        _httpListener = new HttpListener();
        _httpListener.Prefixes.Add($"http://127.0.0.1:{_port}/");
        _httpListener.Start();

        _ = Task.Run(async () =>
        {
            while (_httpListener?.IsListening == true)
            {
                try
                {
                    var context = await _httpListener.GetContextAsync();
                    _ = Task.Run(() => HandleRequest(context));
                }
                catch (ObjectDisposedException) { break; }
                catch (HttpListenerException) { break; }
                catch (Exception ex) { Debug.WriteLine($"Listener error: {ex.Message}"); }
            }
        });

        Debug.WriteLine($"Local server started on port {_port}");
    }

    private async void HandleRequest(HttpListenerContext context)
    {
        var request = context.Request;
        var response = context.Response;

        try
        {
            if (request.Url!.LocalPath.StartsWith("/api"))
            {
                await ProxyRequest(request, response);
                return;
            }

            var filePath = Path.Combine(_frontendDist!,
                request.Url.LocalPath.TrimStart('/') == "" ? "index.html" : request.Url.LocalPath.TrimStart('/'));

            if (!File.Exists(filePath))
            {
                filePath = Path.Combine(_frontendDist!, "index.html");
            }

            if (File.Exists(filePath))
            {
                var ext = Path.GetExtension(filePath).ToLowerInvariant();
                var contentType = MimeTypes.GetValueOrDefault(ext, "application/octet-stream");
                var bytes = await File.ReadAllBytesAsync(filePath);
                response.ContentType = contentType;
                response.ContentLength64 = bytes.Length;
                await response.OutputStream.WriteAsync(bytes);
            }
            else
            {
                response.StatusCode = 404;
                var bytes = System.Text.Encoding.UTF8.GetBytes("Not found");
                await response.OutputStream.WriteAsync(bytes);
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Request error: {ex.Message}");
            try
            {
                response.StatusCode = 500;
                var bytes = System.Text.Encoding.UTF8.GetBytes("Internal server error");
                await response.OutputStream.WriteAsync(bytes);
            }
            catch { }
        }
        finally
        {
            response.Close();
        }
    }

    private async Task ProxyRequest(HttpListenerRequest incoming, HttpListenerResponse outgoing)
    {
        try
        {
            var backendUri = new Uri(_backendUrl);
            var proxyUrl = new Uri(backendUri, incoming.Url!.PathAndQuery);

            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
            using var proxyRequest = new HttpRequestMessage
            {
                Method = new HttpMethod(incoming.HttpMethod),
                RequestUri = proxyUrl,
            };

            foreach (string headerName in incoming.Headers)
            {
                if (headerName.Equals("Host", StringComparison.OrdinalIgnoreCase)) continue;
                try { proxyRequest.Headers.TryAddWithoutValidation(headerName, incoming.Headers[headerName]); } catch { }
            }

            if (incoming.HasEntityBody)
            {
                using var bodyStream = new MemoryStream();
                await incoming.InputStream.CopyToAsync(bodyStream);
                bodyStream.Position = 0;
                proxyRequest.Content = new StreamContent(bodyStream);
                if (incoming.ContentType != null)
                    proxyRequest.Content.Headers.TryAddWithoutValidation("Content-Type", incoming.ContentType);
            }

            var backendResponse = await client.SendAsync(proxyRequest);
            outgoing.StatusCode = (int)backendResponse.StatusCode;

            foreach (var header in backendResponse.Headers)
                try { outgoing.Headers[header.Key] = string.Join(", ", header.Value); } catch { }
            foreach (var header in backendResponse.Content.Headers)
                try { outgoing.Headers[header.Key] = string.Join(", ", header.Value); } catch { }

            var responseBytes = await backendResponse.Content.ReadAsByteArrayAsync();
            outgoing.ContentType = backendResponse.Content.Headers.ContentType?.ToString() ?? "application/json";
            outgoing.ContentLength64 = responseBytes.Length;
            await outgoing.OutputStream.WriteAsync(responseBytes);
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Proxy error: {ex.Message}");
            outgoing.StatusCode = 502;
            var bytes = System.Text.Encoding.UTF8.GetBytes($"Backend unavailable: {ex.Message}");
            await outgoing.OutputStream.WriteAsync(bytes);
        }
    }

    private static async Task<bool> IsReachable(string url)
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };
            var response = await client.GetAsync(url);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
    {
        try { _httpListener?.Stop(); _httpListener?.Close(); } catch { }
    }

    private void Window_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.F5)
        {
            WebView.CoreWebView2?.Reload();
            e.Handled = true;
        }
        else if (e.Key == Key.F11)
        {
            ToggleFullScreen();
            e.Handled = true;
        }
        else if (e.Key == Key.F12)
        {
            WebView.CoreWebView2?.OpenDevToolsWindow();
            e.Handled = true;
        }
        else if (e.Key == Key.R && Keyboard.Modifiers.HasFlag(ModifierKeys.Control))
        {
            WebView.CoreWebView2?.Reload();
            e.Handled = true;
        }
        else if (e.Key == Key.OemPlus && Keyboard.Modifiers.HasFlag(ModifierKeys.Control))
        {
            ZoomIn();
            e.Handled = true;
        }
        else if (e.Key == Key.OemMinus && Keyboard.Modifiers.HasFlag(ModifierKeys.Control))
        {
            ZoomOut();
            e.Handled = true;
        }
        else if (e.Key == Key.D0 && Keyboard.Modifiers.HasFlag(ModifierKeys.Control))
        {
            ResetZoom();
            e.Handled = true;
        }
    }

    private bool _isFullScreen;
    private WindowState _prevWindowState;
    private WindowStyle _prevWindowStyle;

    private void ToggleFullScreen()
    {
        if (_isFullScreen)
        {
            WindowState = _prevWindowState;
            WindowStyle = _prevWindowStyle;
            _isFullScreen = false;
        }
        else
        {
            _prevWindowState = WindowState;
            _prevWindowStyle = WindowStyle;
            WindowStyle = WindowStyle.None;
            WindowState = WindowState.Maximized;
            _isFullScreen = true;
        }
    }

    private void ZoomIn()
    {
        if (WebView.CoreWebView2 != null)
            WebView.ZoomFactor = Math.Min(WebView.ZoomFactor + 0.1, 5.0);
    }

    private void ZoomOut()
    {
        if (WebView.CoreWebView2 != null)
            WebView.ZoomFactor = Math.Max(WebView.ZoomFactor - 0.1, 0.1);
    }

    private void ResetZoom()
    {
        if (WebView.CoreWebView2 != null)
            WebView.ZoomFactor = 1.0;
    }

    private void Menu_Reload(object sender, RoutedEventArgs e) => WebView.CoreWebView2?.Reload();
    private void Menu_Exit(object sender, RoutedEventArgs e) => Close();
    private void Menu_FullScreen(object sender, RoutedEventArgs e) => ToggleFullScreen();
    private void Menu_ZoomIn(object sender, RoutedEventArgs e) => ZoomIn();
    private void Menu_ZoomOut(object sender, RoutedEventArgs e) => ZoomOut();
    private void Menu_ZoomReset(object sender, RoutedEventArgs e) => ResetZoom();
    private void Menu_DevTools(object sender, RoutedEventArgs e) => WebView.CoreWebView2?.OpenDevToolsWindow();

    private void Menu_APIDocs(object sender, RoutedEventArgs e)
    {
        try { Process.Start(new ProcessStartInfo($"{_backendUrl}/docs") { UseShellExecute = true }); } catch { }
    }

    private void Menu_About(object sender, RoutedEventArgs e)
    {
        MessageBox.Show(
            "ERP & CRM System\nVersion 1.0.0\n\nFull-featured ERP & CRM with WhatsApp + AI integration.\n\nBackend: " + _backendUrl,
            "About ERP & CRM",
            MessageBoxButton.OK,
            MessageBoxImage.Information);
    }
}
