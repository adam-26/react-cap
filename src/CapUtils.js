import deepEqual from "deep-equal";
import {ATTRIBUTE_NAMES, HEAD_TAG_NAMES} from "./HelmetConstants.js";
import {
    generateTitleAsReactComponent,
    convertElementAttributestoReactProps,
    generateTagsAsReactComponent,
    reducePropsToState
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

const mapStateToComponents = ({
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    scriptTags,
    styleTags,
    title = "",
    titleAttributes
}, componentOptions) => ({
    base: getComponentForTag(HEAD_TAG_NAMES.BASE, baseTag, componentOptions),
    bodyAttributes: getComponentForTag(
        ATTRIBUTE_NAMES.BODY,
        bodyAttributes,
        componentOptions
    ),
    htmlAttributes: getComponentForTag(
        ATTRIBUTE_NAMES.HTML,
        htmlAttributes,
        componentOptions
    ),
    link: getComponentForTag(HEAD_TAG_NAMES.LINK, linkTags, componentOptions),
    meta: getComponentForTag(HEAD_TAG_NAMES.META, metaTags, componentOptions),
    noscript: getComponentForTag(
        HEAD_TAG_NAMES.NOSCRIPT,
        noscriptTags,
        componentOptions
    ),
    script: getComponentForTag(
        HEAD_TAG_NAMES.SCRIPT,
        scriptTags,
        componentOptions
    ),
    style: getComponentForTag(
        HEAD_TAG_NAMES.STYLE,
        styleTags,
        componentOptions
    ),
    title: getComponentForTag(HEAD_TAG_NAMES.TITLE, {title, titleAttributes}, componentOptions)
});

export {reducePropsToState, mapStateToComponents, deepEqual, HEAD_TAG_NAMES};
