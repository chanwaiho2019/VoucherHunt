package com.liteapp.voucherhunt.helpers

import android.graphics.drawable.Drawable
import android.media.Image
import android.util.Log
import java.io.InputStream
import java.net.URL

fun LoadImageFromWebOperations(url: String?): Drawable? {
    return try {
        val inputStream: InputStream = URL(url).getContent() as InputStream
        val fileName = url!!.substring(url!!.lastIndexOf("/") + 1)
        Log.d("LoadImage", fileName)
        return Drawable.createFromStream(inputStream, fileName)

    } catch (e: Exception) {
        Log.d("LoadImage", e.toString())
        return null
    }
}
