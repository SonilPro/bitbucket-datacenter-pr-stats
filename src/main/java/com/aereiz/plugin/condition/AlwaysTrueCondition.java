package com.aereiz.plugin.condition;

import com.atlassian.plugin.web.Condition;
import com.atlassian.webresource.api.QueryParams;
import com.atlassian.webresource.api.url.UrlBuilder;
import com.atlassian.webresource.spi.condition.UrlReadingCondition;

import java.util.Map;

import static java.util.Collections.emptyMap;

public class AlwaysTrueCondition implements Condition, UrlReadingCondition {

    private static final String ALWAYS_TRUE_CONDITION_ENABLED = "alwaysTrueConditionEnabled";

    @Override
    public void init(Map<String, String> map) {
    }

    @Override
    public boolean shouldDisplay(Map<String, Object> map) {
        return true;
    }

    /**
     * Needs to be the same result as {@link #shouldDisplay(Map)}
     */
    @Override
    public void addToUrl(UrlBuilder urlBuilder) {
        urlBuilder.addToQueryString(ALWAYS_TRUE_CONDITION_ENABLED, Boolean.toString(shouldDisplay(emptyMap())));
    }

    /**
     * Needs to be the same result as {@link #shouldDisplay(Map)}
     */
    @Override
    public boolean shouldDisplay(QueryParams queryParams) {
        return Boolean.parseBoolean(queryParams.get(ALWAYS_TRUE_CONDITION_ENABLED));
    }
}
