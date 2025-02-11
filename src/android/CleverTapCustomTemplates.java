package com.clevertap.cordova;

import android.content.Context;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException;
import com.clevertap.android.sdk.inapp.customtemplates.FunctionPresenter;
import com.clevertap.android.sdk.inapp.customtemplates.TemplatePresenter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class CleverTapCustomTemplates {

    private static final TemplatePresenter templatePresenter = new TemplatePresenter() {
        @Override
        public void onPresent(CustomTemplateContext.TemplateContext context) {
            Map<String, Object> result = new HashMap<>();
            result.put("name", context.getTemplateName());
            CleverTapEventEmitter.sendEvent(CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_PRESENT, result);
        }

        @Override
        public void onClose(CustomTemplateContext.TemplateContext context) {
            Map<String, Object> result = new HashMap<>();
            result.put("name", context.getTemplateName());
            CleverTapEventEmitter.sendEvent(CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_CLOSE, result);
        }
    };

    private static final FunctionPresenter functionPresenter = context -> {
        Map<String, Object> result = new HashMap<>();
        result.put("name", context.getTemplateName());
        CleverTapEventEmitter.sendEvent(CleverTapEvent.CLEVERTAP_CUSTOM_FUNCTION_PRESENT, result);
    };

    public static void registerCustomTemplates(Context context, String... jsonAssets) {
        for (String jsonAsset : jsonAssets) {
            String jsonDefinitions = readAsset(context, jsonAsset);
            CleverTapAPI.registerCustomInAppTemplates(jsonDefinitions, templatePresenter, functionPresenter);
        }
    }

    private static String readAsset(Context context, String asset) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(context.getAssets().open(asset), StandardCharsets.UTF_8))) {
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
            return builder.toString();
        } catch (IOException e) {
            throw new CustomTemplateException("Could not read json asset", e);
        }
    }
}
