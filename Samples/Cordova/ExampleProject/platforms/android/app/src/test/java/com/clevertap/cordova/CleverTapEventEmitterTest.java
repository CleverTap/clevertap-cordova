package com.clevertap.cordova;

import static org.junit.Assert.assertEquals;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class CleverTapEventEmitterTest {


    @Test
    public void testPayloadEqualityForURI() {
        URI data = URI.create("https://www.google.com/");

        String expectedResult = ("{'deeplink':'" + data + "'}").replace("'", "\"");
        Map<String, Object> result = new HashMap<>();
        result.put("deeplink", data);

        String actualResult = CleverTapEventEmitter.toJSONString(result);

        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testPayloadEqualityForString() {
        String cleverTapID = "__i423rasfas";

        String expectedResult = ("{'CleverTapID':" + "'" + cleverTapID + "'" + "}").replace("'", "\"");
        Map<String, Object> result = new HashMap<>();
        result.put("CleverTapID", cleverTapID);

        String actualResult = CleverTapEventEmitter.toJSONString(result);

        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testPayloadEqualityForBoolean() {
        boolean data = true;

        String expectedResult = ("{'accepted':" + data + "}").replace("'", "\"");
        Map<String, Object> result = new HashMap<>();
        result.put("accepted", data);

        String actualResult = CleverTapEventEmitter.toJSONString(result);

        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testPayloadEqualityForJSONArray() throws JSONException {
        JSONArray data = new JSONArray().put("a").put(1).put(2.4);
        String expectedResult = ("{'units':" + data + "}").replace("'", "\"");
        Map<String, Object> result = new HashMap<>();
        result.put("units", data);

        String actualResult = CleverTapEventEmitter.toJSONString(result);

        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testPayloadEqualityForJSONObject() throws JSONException {
        JSONObject data1 = new JSONObject();
        data1.put("keyString", "value");
        data1.put("keyInt", 2);

        JSONObject data2 = new JSONObject();
        data2.put("keyFloat", 2.4);
        data2.put("keyObject", new JSONObject().put("subKey", 2));
        data2.put("keyArray", new JSONArray().put(1).put(2));

        String expectedResult = ("{'customExtras2':" + data2 + ",");
        expectedResult += ("'customExtras1':" + data1 + "}");
        expectedResult = expectedResult.replace("'", "\"");

        Map<String, Object> result = new HashMap<>();
        result.put("customExtras1", data1);
        result.put("customExtras2", data2);

        String actualResult = CleverTapEventEmitter.toJSONString(result);

        assertEquals(expectedResult, actualResult);
    }


//    @Test
//    public void testJSONEqualityForJSoNArrayData() throws JSONException {
//        Object data = new JSONArray().put("data1").put("data2");
//        String oldJson = oldImplementation(data);
//        Map<String, Object> newJson = newImplementation(data);
//
//        // Normalize JSON for comparison
//        JSONObject oldJsonObject = new JSONObject(oldJson);
//        String newJsonObject = CleverTapEventEmitter.toJSONString(newJson);
//
//        assertEquals(oldJsonObject.toString(), newJsonObject);
//    }
}
