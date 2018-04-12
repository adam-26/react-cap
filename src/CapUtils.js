import deepEqual from "deep-equal";
import {ATTRIBUTE_NAMES, TAG_NAMES} from "./HelmetConstants.js";
import {
    generateTitleAsReactComponent,
    convertElementAttributestoReactProps,
    generateTagsAsReactComponent,
    reducePropsToState
} from "./HelmetUtils";

const getComponentForTag = (type, tags, encode, typeComponents) => {
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
            return generateTagsAsReactComponent(type, tags, typeComponents);
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
    titleAttributes,
    typeComponents
}) => ({
    base: getComponentForTag(TAG_NAMES.BASE, baseTag, encode, typeComponents),
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
    link: getComponentForTag(TAG_NAMES.LINK, linkTags, encode, typeComponents),
    meta: getComponentForTag(TAG_NAMES.META, metaTags, encode, typeComponents),
    noscript: getComponentForTag(
        TAG_NAMES.NOSCRIPT,
        noscriptTags,
        encode,
        typeComponents
    ),
    script: getComponentForTag(
        TAG_NAMES.SCRIPT,
        scriptTags,
        encode,
        typeComponents
    ),
    style: getComponentForTag(
        TAG_NAMES.STYLE,
        styleTags,
        encode,
        typeComponents
    ),
    title: getComponentForTag(TAG_NAMES.TITLE, {title, titleAttributes}, encode)
});

export {reducePropsToState, mapStateToComponents, deepEqual};
