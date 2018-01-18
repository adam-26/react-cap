import deepEqual from "deep-equal";
import {ATTRIBUTE_NAMES, TAG_NAMES} from "./HelmetConstants.js";
import {
    generateTitleAsReactComponent,
    convertElementAttributestoReactProps,
    generateTagsAsReactComponent,
    handleClientStateChange,
    reducePropsToState
} from "./HelmetUtils";

const getComponentForTag = (type, tags, encode) => {
    switch (type) {
        case TAG_NAMES.TITLE:
            return generateTitleAsReactComponent(
                type,
                tags.title,
                tags.titleAttributes,
                encode
            );
        case ATTRIBUTE_NAMES.BODY:
        case ATTRIBUTE_NAMES.HTML:
            return convertElementAttributestoReactProps(tags);
        default:
            return generateTagsAsReactComponent(type, tags);
    }
};

const mapStateToComponents = ({
    baseTag,
    bodyAttributes,
    encode,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    scriptTags,
    styleTags,
    title = "",
    titleAttributes
}) => ({
    base: getComponentForTag(TAG_NAMES.BASE, baseTag, encode),
    bodyAttributes: getComponentForTag(
        ATTRIBUTE_NAMES.BODY,
        bodyAttributes,
        encode
    ),
    htmlAttributes: getComponentForTag(
        ATTRIBUTE_NAMES.HTML,
        htmlAttributes,
        encode
    ),
    link: getComponentForTag(TAG_NAMES.LINK, linkTags, encode),
    meta: getComponentForTag(TAG_NAMES.META, metaTags, encode),
    noscript: getComponentForTag(TAG_NAMES.NOSCRIPT, noscriptTags, encode),
    script: getComponentForTag(TAG_NAMES.SCRIPT, scriptTags, encode),
    style: getComponentForTag(TAG_NAMES.STYLE, styleTags, encode),
    title: getComponentForTag(TAG_NAMES.TITLE, {title, titleAttributes}, encode)
});

export {
    reducePropsToState,
    handleClientStateChange,
    mapStateToComponents,
    deepEqual
};
