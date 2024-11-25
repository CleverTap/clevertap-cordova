package com.clevertap.cordova

import android.content.Context
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException
import com.clevertap.android.sdk.inapp.customtemplates.FunctionPresenter
import com.clevertap.android.sdk.inapp.customtemplates.TemplatePresenter
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets

object CleverTapCustomTemplates {
    private val templatePresenter: TemplatePresenter = object : TemplatePresenter {
        override fun onPresent(context: CustomTemplateContext.TemplateContext) {
            CleverTapEventEmitter.sendEvent("CleverTapCustomTemplatePresent", context.templateName)
        }

        override fun onClose(context: CustomTemplateContext.TemplateContext) {
            CleverTapEventEmitter.sendEvent("CleverTapCustomTemplateClose", context.templateName)
        }
    }

    private val functionPresenter = FunctionPresenter {
        CleverTapEventEmitter.sendEvent("CleverTapCustomFunctionPresent", it.templateName)
    }

    fun registerCustomTemplates(context: Context, vararg jsonAssets: String) {
        for (jsonAsset in jsonAssets) {
            val jsonDefinitions = readAsset(context, jsonAsset)
            CleverTapAPI.registerCustomInAppTemplates(
                jsonDefinitions, templatePresenter, functionPresenter
            )
        }
    }

    private fun readAsset(context: Context, asset: String): String {
        try {
            BufferedReader(
                InputStreamReader(
                    context.assets.open(asset), StandardCharsets.UTF_8
                )
            ).use { reader ->
                val builder = StringBuilder()
                var line: String?
                while ((reader.readLine().also { line = it }) != null) {
                    builder.append(line)
                }
                return builder.toString()
            }
        } catch (e: IOException) {
            throw CustomTemplateException("Could not read json asset", e)
        }
    }
}