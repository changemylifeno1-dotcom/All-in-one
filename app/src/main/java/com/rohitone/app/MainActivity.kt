package com.rohitone.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.ActivityManager
import android.content.ContentUris
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.StatFs
import android.provider.MediaStore
import android.util.Log
import android.util.Size
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var splashOverlay: FrameLayout
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var hasFallbackLoaded = false

    private val filePickerLauncher: ActivityResultLauncher<Intent> =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                val data = result.data
                val results: Array<Uri>? = when {
                    data?.clipData != null -> {
                        val count = data.clipData!!.itemCount
                        Array(count) { i -> data.clipData!!.getItemAt(i).uri }
                    }
                    data?.data != null -> arrayOf(data.data!!)
                    else -> null
                }
                fileUploadCallback?.onReceiveValue(results)
            } else {
                fileUploadCallback?.onReceiveValue(null)
            }
            fileUploadCallback = null
        }

    private val requestPermissionsLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { results ->
            val allGranted = results.values.all { it }
            Log.d("ROHIT_ONE", "Storage permissions updated: allGranted=$allGranted")
            runOnUiThread {
                webView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('rohit-permissions-updated', { detail: { granted: $allGranted } }));",
                    null
                )
            }
        }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enforce true AMOLED Black System Bars
        window.statusBarColor = Color.BLACK
        window.navigationBarColor = Color.BLACK
        window.setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        )

        // Root container with black AMOLED background to prevent white screen flash
        val rootLayout = FrameLayout(this).apply {
            setBackgroundColor(Color.BLACK)
        }

        // Initialize WebView with pure black background immediately
        webView = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
        }

        // Top horizontal progress bar for page load feedback
        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            isIndeterminate = false
            max = 100
            progress = 0
            visibility = View.VISIBLE
        }

        // Branded Native Splash Overlay ensuring ZERO blank white screen
        splashOverlay = createSplashOverlay()

        rootLayout.addView(webView, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        rootLayout.addView(progressBar, FrameLayout.LayoutParams.MATCH_PARENT, 8)
        rootLayout.addView(splashOverlay, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        setContentView(rootLayout)

        requestNeededPermissions()
        setupWebView()
        setupBackPressHandling()

        // Load application bundle
        loadApplication()
    }

    private fun createSplashOverlay(): FrameLayout {
        val layout = FrameLayout(this).apply {
            setBackgroundColor(Color.BLACK)
        }

        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER
            )
        }

        val title = TextView(this).apply {
            text = "ROHIT ONE"
            setTextColor(Color.WHITE)
            textSize = 24f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
        }

        val subtitle = TextView(this).apply {
            text = "प्रारंभ हो रहा है... / Starting..."
            setTextColor(Color.parseColor("#A1A1AA"))
            textSize = 12f
            setPadding(0, 16, 0, 24)
            gravity = Gravity.CENTER
        }

        val spinner = ProgressBar(this).apply {
            indeterminateTintList = android.content.res.ColorStateList.valueOf(Color.parseColor("#6366F1"))
        }

        content.addView(title)
        content.addView(subtitle)
        content.addView(spinner)
        layout.addView(content)

        return layout
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
            .build()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            loadsImagesAutomatically = true
            useWideViewPort = true
            loadWithOverviewMode = true
            builtInZoomControls = false
            displayZoomControls = false
            userAgentString = userAgentString + " RohitOneApp/1.0.0"
        }

        // Inject Native Media & Storage Bridge
        webView.addJavascriptInterface(RohitNativeBridge(this), "RohitNativeBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                val url = request?.url ?: return super.shouldInterceptRequest(view, request)

                // 1. Intercept real phone media requests (video, photo, audio, documents, and thumbnails)
                if (url.host == "appassets.androidplatform.net" && url.path?.startsWith("/local-media/") == true) {
                    val response = handleLocalMediaIntercept(url)
                    if (response != null) return response
                }

                // 2. Intercept bundled assets
                val intercepted = assetLoader.shouldInterceptRequest(url)
                if (intercepted != null) return intercepted

                return super.shouldInterceptRequest(view, request)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                view?.setBackgroundColor(Color.BLACK)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                // Gracefully fade out splash screen when web content is ready
                splashOverlay.animate()
                    .alpha(0f)
                    .setDuration(300)
                    .withEndAction {
                        splashOverlay.visibility = View.GONE
                    }
                    .start()
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                Log.e("ROHIT_ONE", "WebView Error: ${error?.errorCode} - ${error?.description} on URL: ${request?.url}")

                // Fallback to direct file:/// scheme if domain interception has issues
                if (request?.isForMainFrame == true && !hasFallbackLoaded) {
                    hasFallbackLoaded = true
                    Log.w("ROHIT_ONE", "Switching to offline fallback: file:///android_asset/index.html")
                    view?.loadUrl("file:///android_asset/index.html")
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress >= 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                consoleMessage?.let {
                    Log.d("ROHIT_ONE_JS", "${it.message()} [${it.sourceId()}:${it.lineNumber()}]")
                }
                return true
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                }

                try {
                    filePickerLauncher.launch(Intent.createChooser(intent, "ROHIT ONE - फ़ाइल चुनें"))
                } catch (e: Exception) {
                    fileUploadCallback?.onReceiveValue(null)
                    fileUploadCallback = null
                    return false
                }
                return true
            }
        }
    }

    private fun handleLocalMediaIntercept(url: Uri): WebResourceResponse? {
        val path = url.path ?: return null
        val segments = path.trim('/').split('/')
        // Segments:
        // ["local-media", "thumb", "video", "1234"]
        // ["local-media", "video", "1234"]
        return try {
            if (segments.size >= 4 && segments[1] == "thumb") {
                val cat = segments[2]
                val mediaId = segments[3].toLongOrNull() ?: return null
                val contentUri = when (cat) {
                    "video" -> ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId)
                    "photo", "image" -> ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, mediaId)
                    else -> null
                }
                if (contentUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val thumbBmp = contentResolver.loadThumbnail(contentUri, Size(512, 512), null)
                    val baos = ByteArrayOutputStream()
                    thumbBmp.compress(Bitmap.CompressFormat.JPEG, 85, baos)
                    val bytes = baos.toByteArray()
                    val headers = mapOf(
                        "Access-Control-Allow-Origin" to "*",
                        "Cache-Control" to "public, max-age=86400"
                    )
                    WebResourceResponse("image/jpeg", "UTF-8", 200, "OK", headers, ByteArrayInputStream(bytes))
                } else null
            } else if (segments.size >= 3) {
                val cat = segments[1]
                val mediaId = segments[2].toLongOrNull() ?: return null
                val contentUri = when (cat) {
                    "video" -> ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId)
                    "photo", "image" -> ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, mediaId)
                    "audio" -> ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, mediaId)
                    "doc", "document" -> ContentUris.withAppendedId(MediaStore.Files.getContentUri("external"), mediaId)
                    else -> null
                }
                if (contentUri != null) {
                    val mimeType = contentResolver.getType(contentUri) ?: when (cat) {
                        "video" -> "video/mp4"
                        "photo", "image" -> "image/jpeg"
                        "audio" -> "audio/mpeg"
                        "doc", "document" -> "application/pdf"
                        else -> "application/octet-stream"
                    }
                    val inputStream = contentResolver.openInputStream(contentUri)
                    if (inputStream != null) {
                        val headers = mapOf(
                            "Access-Control-Allow-Origin" to "*",
                            "Accept-Ranges" to "bytes"
                        )
                        WebResourceResponse(mimeType, null, 200, "OK", headers, inputStream)
                    } else null
                } else null
            } else null
        } catch (e: Exception) {
            Log.e("ROHIT_ONE", "Error serving local media content for $url: ${e.message}")
            null
        }
    }

    private fun loadApplication() {
        val primaryUrl = "https://appassets.androidplatform.net/assets/index.html"
        webView.loadUrl(primaryUrl)
    }

    private fun setupBackPressHandling() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    fun hasStoragePermissions(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) == PackageManager.PERMISSION_GRANTED &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_VIDEO) == PackageManager.PERMISSION_GRANTED &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_AUDIO) == PackageManager.PERMISSION_GRANTED
        } else {
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
        }
    }

    fun requestNeededPermissions() {
        val permissions = mutableListOf<String>()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.READ_MEDIA_IMAGES)
            permissions.add(Manifest.permission.READ_MEDIA_VIDEO)
            permissions.add(Manifest.permission.READ_MEDIA_AUDIO)
        } else {
            permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE)
            permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        }

        val ungranted = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (ungranted.isNotEmpty()) {
            requestPermissionsLauncher.launch(ungranted.toTypedArray())
        }
    }

    fun queryDeviceMedia(categoryFilter: String): String {
        val itemsArray = JSONArray()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())

        try {
            // 1. VIDEOS
            if (categoryFilter == "all" || categoryFilter == "video") {
                val projection = arrayOf(
                    MediaStore.Video.Media._ID,
                    MediaStore.Video.Media.DISPLAY_NAME,
                    MediaStore.Video.Media.SIZE,
                    MediaStore.Video.Media.DATE_MODIFIED,
                    MediaStore.Video.Media.MIME_TYPE,
                    MediaStore.Video.Media.DURATION,
                    MediaStore.Video.Media.WIDTH,
                    MediaStore.Video.Media.HEIGHT,
                    MediaStore.Video.Media.BUCKET_DISPLAY_NAME
                )
                val sortOrder = "${MediaStore.Video.Media.DATE_MODIFIED} DESC"
                contentResolver.query(
                    MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                    projection,
                    null,
                    null,
                    sortOrder
                )?.use { cursor ->
                    val idCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media._ID)
                    val nameCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DISPLAY_NAME)
                    val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.SIZE)
                    val dateCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DATE_MODIFIED)
                    val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.MIME_TYPE)
                    val durCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DURATION)
                    val widthCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.WIDTH)
                    val heightCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.HEIGHT)
                    val bucketCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.BUCKET_DISPLAY_NAME)

                    while (cursor.moveToNext()) {
                        val id = cursor.getLong(idCol)
                        val name = cursor.getString(nameCol) ?: "Video_$id"
                        val size = cursor.getLong(sizeCol)
                        val dateSec = cursor.getLong(dateCol)
                        val mime = cursor.getString(mimeCol) ?: "video/mp4"
                        val durMs = cursor.getLong(durCol)
                        val width = cursor.getInt(widthCol)
                        val height = cursor.getInt(heightCol)
                        val bucket = cursor.getString(bucketCol) ?: "Movies"

                        val durationStr = if (durMs > 0) {
                            val totalSec = durMs / 1000
                            val h = totalSec / 3600
                            val m = (totalSec % 3600) / 60
                            val s = totalSec % 60
                            if (h > 0) String.format(Locale.US, "%02d:%02d:%02d", h, m, s)
                            else String.format(Locale.US, "%02d:%02d", m, s)
                        } else null

                        val resolutionStr = if (width > 0 && height > 0) "${width}x${height}" else null

                        val itemObj = JSONObject().apply {
                            put("id", "vid-$id")
                            put("name", name)
                            put("category", "video")
                            put("url", "https://appassets.androidplatform.net/local-media/video/$id")
                            put("thumbnail", "https://appassets.androidplatform.net/local-media/thumb/video/$id")
                            put("size", size)
                            put("dateModified", dateFormat.format(Date(dateSec * 1000L)))
                            put("mimeType", mime)
                            if (durationStr != null) put("duration", durationStr)
                            if (resolutionStr != null) put("resolution", resolutionStr)
                            put("folder", bucket)
                            put("isFavorite", false)
                        }
                        itemsArray.put(itemObj)
                    }
                }
            }

            // 2. PHOTOS
            if (categoryFilter == "all" || categoryFilter == "photo" || categoryFilter == "image") {
                val projection = arrayOf(
                    MediaStore.Images.Media._ID,
                    MediaStore.Images.Media.DISPLAY_NAME,
                    MediaStore.Images.Media.SIZE,
                    MediaStore.Images.Media.DATE_MODIFIED,
                    MediaStore.Images.Media.MIME_TYPE,
                    MediaStore.Images.Media.WIDTH,
                    MediaStore.Images.Media.HEIGHT,
                    MediaStore.Images.Media.BUCKET_DISPLAY_NAME
                )
                val sortOrder = "${MediaStore.Images.Media.DATE_MODIFIED} DESC"
                contentResolver.query(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    projection,
                    null,
                    null,
                    sortOrder
                )?.use { cursor ->
                    val idCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID)
                    val nameCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME)
                    val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.SIZE)
                    val dateCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_MODIFIED)
                    val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.MIME_TYPE)
                    val widthCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.WIDTH)
                    val heightCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.HEIGHT)
                    val bucketCol = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.BUCKET_DISPLAY_NAME)

                    while (cursor.moveToNext()) {
                        val id = cursor.getLong(idCol)
                        val name = cursor.getString(nameCol) ?: "IMG_$id"
                        val size = cursor.getLong(sizeCol)
                        val dateSec = cursor.getLong(dateCol)
                        val mime = cursor.getString(mimeCol) ?: "image/jpeg"
                        val width = cursor.getInt(widthCol)
                        val height = cursor.getInt(heightCol)
                        val bucket = cursor.getString(bucketCol) ?: "Camera"

                        val resolutionStr = if (width > 0 && height > 0) "${width}x${height}" else null

                        val itemObj = JSONObject().apply {
                            put("id", "img-$id")
                            put("name", name)
                            put("category", "photo")
                            put("url", "https://appassets.androidplatform.net/local-media/photo/$id")
                            put("thumbnail", "https://appassets.androidplatform.net/local-media/thumb/photo/$id")
                            put("size", size)
                            put("dateModified", dateFormat.format(Date(dateSec * 1000L)))
                            put("mimeType", mime)
                            if (resolutionStr != null) put("resolution", resolutionStr)
                            put("folder", bucket)
                            put("isFavorite", false)
                        }
                        itemsArray.put(itemObj)
                    }
                }
            }

            // 3. AUDIO
            if (categoryFilter == "all" || categoryFilter == "audio" || categoryFilter == "music") {
                val projection = arrayOf(
                    MediaStore.Audio.Media._ID,
                    MediaStore.Audio.Media.DISPLAY_NAME,
                    MediaStore.Audio.Media.SIZE,
                    MediaStore.Audio.Media.DATE_MODIFIED,
                    MediaStore.Audio.Media.MIME_TYPE,
                    MediaStore.Audio.Media.DURATION,
                    MediaStore.Audio.Media.ALBUM,
                    MediaStore.Audio.Media.ARTIST
                )
                val sortOrder = "${MediaStore.Audio.Media.DATE_MODIFIED} DESC"
                contentResolver.query(
                    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                    projection,
                    null,
                    null,
                    sortOrder
                )?.use { cursor ->
                    val idCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                    val nameCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME)
                    val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
                    val dateCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_MODIFIED)
                    val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.MIME_TYPE)
                    val durCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                    val albumCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)

                    while (cursor.moveToNext()) {
                        val id = cursor.getLong(idCol)
                        val name = cursor.getString(nameCol) ?: "Audio_$id"
                        val size = cursor.getLong(sizeCol)
                        val dateSec = cursor.getLong(dateCol)
                        val mime = cursor.getString(mimeCol) ?: "audio/mpeg"
                        val durMs = cursor.getLong(durCol)
                        val album = cursor.getString(albumCol) ?: "Music"

                        val durationStr = if (durMs > 0) {
                            val totalSec = durMs / 1000
                            val m = totalSec / 60
                            val s = totalSec % 60
                            String.format(Locale.US, "%02d:%02d", m, s)
                        } else null

                        val itemObj = JSONObject().apply {
                            put("id", "aud-$id")
                            put("name", name)
                            put("category", "audio")
                            put("url", "https://appassets.androidplatform.net/local-media/audio/$id")
                            put("size", size)
                            put("dateModified", dateFormat.format(Date(dateSec * 1000L)))
                            put("mimeType", mime)
                            if (durationStr != null) put("duration", durationStr)
                            put("folder", album)
                            put("isFavorite", false)
                        }
                        itemsArray.put(itemObj)
                    }
                }
            }

            // 4. DOCUMENTS
            if (categoryFilter == "all" || categoryFilter == "document") {
                val projection = arrayOf(
                    MediaStore.Files.FileColumns._ID,
                    MediaStore.Files.FileColumns.DISPLAY_NAME,
                    MediaStore.Files.FileColumns.SIZE,
                    MediaStore.Files.FileColumns.DATE_MODIFIED,
                    MediaStore.Files.FileColumns.MIME_TYPE
                )
                val selection = "${MediaStore.Files.FileColumns.MIME_TYPE} LIKE ? OR " +
                        "${MediaStore.Files.FileColumns.MIME_TYPE} LIKE ? OR " +
                        "${MediaStore.Files.FileColumns.DISPLAY_NAME} LIKE ? OR " +
                        "${MediaStore.Files.FileColumns.DISPLAY_NAME} LIKE ?"
                val selectionArgs = arrayOf(
                    "application/pdf",
                    "text/%",
                    "%.pdf",
                    "%.txt"
                )
                val sortOrder = "${MediaStore.Files.FileColumns.DATE_MODIFIED} DESC"

                contentResolver.query(
                    MediaStore.Files.getContentUri("external"),
                    projection,
                    selection,
                    selectionArgs,
                    sortOrder
                )?.use { cursor ->
                    val idCol = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns._ID)
                    val nameCol = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DISPLAY_NAME)
                    val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.SIZE)
                    val dateCol = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATE_MODIFIED)
                    val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.MIME_TYPE)

                    while (cursor.moveToNext()) {
                        val id = cursor.getLong(idCol)
                        val name = cursor.getString(nameCol) ?: "Document_$id"
                        val size = cursor.getLong(sizeCol)
                        val dateSec = cursor.getLong(dateCol)
                        val mime = cursor.getString(mimeCol) ?: "application/pdf"

                        val itemObj = JSONObject().apply {
                            put("id", "doc-$id")
                            put("name", name)
                            put("category", "document")
                            put("url", "https://appassets.androidplatform.net/local-media/doc/$id")
                            put("size", size)
                            put("dateModified", dateFormat.format(Date(dateSec * 1000L)))
                            put("mimeType", mime)
                            put("folder", "Documents")
                            put("isFavorite", false)
                        }
                        itemsArray.put(itemObj)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("ROHIT_ONE", "Error querying device media: ${e.message}")
        }

        return itemsArray.toString()
    }

    fun getStorageStatsJson(): String {
        return try {
            val stat = StatFs(Environment.getDataDirectory().path)
            val totalStorage = stat.totalBytes
            val freeStorage = stat.availableBytes
            val usedStorage = totalStorage - freeStorage

            val actManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val memInfo = ActivityManager.MemoryInfo()
            actManager.getMemoryInfo(memInfo)
            val totalRam = memInfo.totalMem
            val freeRam = memInfo.availMem
            val usedRam = totalRam - freeRam

            JSONObject().apply {
                put("totalStorage", totalStorage)
                put("freeStorage", freeStorage)
                put("usedStorage", usedStorage)
                put("totalRam", totalRam)
                put("freeRam", freeRam)
                put("usedRam", usedRam)
            }.toString()
        } catch (e: Exception) {
            Log.e("ROHIT_ONE", "Error computing storage stats: ${e.message}")
            "{}"
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    // Native Bridge class exposed to WebView JavaScript as window.RohitNativeBridge
    class RohitNativeBridge(private val activity: MainActivity) {
        @JavascriptInterface
        fun isNativeAndroid(): Boolean = true

        @JavascriptInterface
        fun checkStoragePermissions(): Boolean = activity.hasStoragePermissions()

        @JavascriptInterface
        fun requestStoragePermissions() {
            activity.runOnUiThread {
                activity.requestNeededPermissions()
            }
        }

        @JavascriptInterface
        fun getDeviceMedia(category: String): String {
            return activity.queryDeviceMedia(category)
        }

        @JavascriptInterface
        fun getStorageStats(): String {
            return activity.getStorageStatsJson()
        }

        @JavascriptInterface
        fun deleteMediaItem(contentUriStr: String): Boolean {
            return try {
                val uri = Uri.parse(contentUriStr)
                val deleted = activity.contentResolver.delete(uri, null, null)
                deleted > 0
            } catch (e: Exception) {
                Log.e("ROHIT_ONE", "Failed to delete item: ${e.message}")
                false
            }
        }
    }
}
