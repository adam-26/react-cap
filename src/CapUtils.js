import deepEqual from "deep-equal";
import {ATTRIBUTE_NAMES, HEAD_TAG_NAMES, TAG_NAMES} from "./HelmetConstants.js";
import {
    generateTitleAsReactComponent,
    convertElementAttributestoReactProps,
    generateTagsAsReactComponent,
    reducePropsToState,
    updateAttributes
} from "./HelmetUtils";

const getComponentForTag = (type, tags, options) => {
    switch (type) {
        case HEAD_TAG_NAMES.TITLE:
            return generateTitleAsReactComponent(
                type,
                tags.title,
                tags.titleAttributes,
                options
            );
        case ATTRIBUTE_NAMES.BODY:
        case ATTRIBUTE_NAMES.HTML:
            return convertElementAttributestoReactProps(tags);
        default:
            return generateTagsAsReactComponent(type, tags, options);
    }
};

const mapStateToAttributes = (
    {bodyAttributes, htmlAttributes},
    componentOptions
) => {
    const components = {
        bodyAttributes: [],
        htmlAttributes: []
    };

    if (bodyAttributes) {
        components.bodyAttributes = getComponentForTag(
            ATTRIBUTE_NAMES.BODY,
            bodyAttributes,
            componentOptions
        );
    }

    if (htmlAttributes) {
        components.htmlAttributes = getComponentForTag(
            ATTRIBUTE_NAMES.HTML,
            htmlAttributes,
            componentOptions
        );
    }

    return components;
};

const mapStateToHead = (
    {
        baseTag,
        linkTags,
        metaTags,
        noscriptTags,
        scriptTags,
        styleTags,
        title,
        titleAttributes
    },
    componentOptions
) => {
    const components = {
        base: [],
        link: [],
        meta: [],
        noscript: [],
        script: [],
        style: [],
        title: []
    };

    if (baseTag) {
        components.base = getComponentForTag(
            HEAD_TAG_NAMES.BASE,
            baseTag,
            componentOptions
        );
    }

    if (linkTags) {
        components.link = getComponentForTag(
            HEAD_TAG_NAMES.LINK,
            linkTags,
            componentOptions
        );
    }

    if (metaTags) {
        components.meta = getComponentForTag(
            HEAD_TAG_NAMES.META,
            metaTags,
            componentOptions
        );
    }

    if (noscriptTags) {
        components.noscript = getComponentForTag(
            HEAD_TAG_NAMES.NOSCRIPT,
            noscriptTags,
            componentOptions
        );
    }

    if (scriptTags) {
        components.script = getComponentForTag(
            HEAD_TAG_NAMES.SCRIPT,
            scriptTags,
            componentOptions
        );
    }

    if (styleTags) {
        components.style = getComponentForTag(
            HEAD_TAG_NAMES.STYLE,
            styleTags,
            componentOptions
        );
    }

    if (title) {
        components.title = getComponentForTag(
            HEAD_TAG_NAMES.TITLE,
            {title: title || "", titleAttributes},
            componentOptions
        );
    }

    return components;
};

const mapStateToComponents = (state, options) => {
    return Object.assign(
        mapStateToAttributes(state, options),
        mapStateToHead(state, options)
    );
};

const renderAttributes = ({htmlAttributes, bodyAttributes}) => {
    updateAttributes(TAG_NAMES.BODY, bodyAttributes);
    updateAttributes(TAG_NAMES.HTML, htmlAttributes);
};

export {
    reducePropsToState,
    mapStateToComponents,
    mapStateToAttributes,
    mapStateToHead,
    deepEqual,
    renderAttributes,
    HEAD_TAG_NAMES
};
