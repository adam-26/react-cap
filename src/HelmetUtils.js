import React from "react";
import objectAssign from "object-assign";
import {
    ATTRIBUTE_NAMES,
    HELMET_PROPS,
    REACT_TAG_MAP,
    TAG_NAMES,
    TAG_PROPERTIES,
    HELMET_IGNORE_ATTRIBUTE
} from "./HelmetConstants.js";

const getTitleFromPropsList = propsList => {
    const innermostTitle = getInnermostProperty(propsList, TAG_NAMES.TITLE);
    const innermostTemplate = getInnermostProperty(
        propsList,
        HELMET_PROPS.TITLE_TEMPLATE
    );

    if (innermostTemplate && innermostTitle) {
        // use function arg to avoid need to escape $ characters
        return innermostTemplate.replace(/%s/g, () => innermostTitle);
    }

    const innermostDefaultTitle = getInnermostProperty(
        propsList,
        HELMET_PROPS.DEFAULT_TITLE
    );

    return innermostTitle || innermostDefaultTitle || undefined;
};

const getOnChangeClientState = propsList => {
    return (
        getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) ||
        (() => {})
    );
};

const getAttributesFromPropsList = (tagType, propsList) => {
    return propsList
        .filter(props => typeof props[tagType] !== "undefined")
        .map(props => props[tagType])
        .reduce((tagAttrs, current) => {
            return {...tagAttrs, ...current};
        }, {});
};

const getBaseTagFromPropsList = (primaryAttributes, propsList) => {
    return propsList
        .filter(props => typeof props[TAG_NAMES.BASE] !== "undefined")
        .map(props => props[TAG_NAMES.BASE])
        .reverse()
        .reduce((innermostBaseTag, tag) => {
            if (!innermostBaseTag.length) {
                const keys = Object.keys(tag);

                for (let i = 0; i < keys.length; i++) {
                    const attributeKey = keys[i];
                    const lowerCaseAttributeKey = attributeKey.toLowerCase();

                    if (
                        primaryAttributes.indexOf(lowerCaseAttributeKey) !==
                            -1 &&
                        tag[lowerCaseAttributeKey]
                    ) {
                        return innermostBaseTag.concat(tag);
                    }
                }
            }

            return innermostBaseTag;
        }, []);
};

const getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
    // Calculate list of tags, giving priority innermost component (end of the propslist)
    const approvedSeenTags = {};

    return propsList
        .filter(props => {
            if (Array.isArray(props[tagName])) {
                return true;
            }
            if (typeof props[tagName] !== "undefined") {
                warn(
                    `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[
                        tagName
                    ]}"`
                );
            }
            return false;
        })
        .map(props => props[tagName])
        .reverse()
        .reduce((approvedTags, instanceTags) => {
            const instanceSeenTags = {};

            instanceTags
                .filter(tag => {
                    let primaryAttributeKey;
                    const keys = Object.keys(tag);
                    for (let i = 0; i < keys.length; i++) {
                        const attributeKey = keys[i];
                        const lowerCaseAttributeKey = attributeKey.toLowerCase();

                        // Special rule with link tags, since rel and href are both primary tags, rel takes priority
                        if (
                            primaryAttributes.indexOf(lowerCaseAttributeKey) !==
                                -1 &&
                            !(
                                primaryAttributeKey === TAG_PROPERTIES.REL &&
                                tag[primaryAttributeKey].toLowerCase() ===
                                    "canonical"
                            ) &&
                            !(
                                lowerCaseAttributeKey === TAG_PROPERTIES.REL &&
                                tag[lowerCaseAttributeKey].toLowerCase() ===
                                    "stylesheet"
                            )
                        ) {
                            primaryAttributeKey = lowerCaseAttributeKey;
                        }
                        // Special case for innerHTML which doesn't work lowercased
                        if (
                            primaryAttributes.indexOf(attributeKey) !== -1 &&
                            (attributeKey === TAG_PROPERTIES.INNER_HTML ||
                                attributeKey === TAG_PROPERTIES.CSS_TEXT ||
                                attributeKey === TAG_PROPERTIES.ITEM_PROP)
                        ) {
                            primaryAttributeKey = attributeKey;
                        }
                    }

                    if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
                        return false;
                    }

                    const value = tag[primaryAttributeKey].toLowerCase();

                    if (!approvedSeenTags[primaryAttributeKey]) {
                        approvedSeenTags[primaryAttributeKey] = {};
                    }

                    if (!instanceSeenTags[primaryAttributeKey]) {
                        instanceSeenTags[primaryAttributeKey] = {};
                    }

                    if (!approvedSeenTags[primaryAttributeKey][value]) {
                        instanceSeenTags[primaryAttributeKey][value] = true;
                        return true;
                    }

                    return false;
                })
                .reverse()
                .forEach(tag => approvedTags.push(tag));

            // Update seen tags with tags from this instance
            const keys = Object.keys(instanceSeenTags);
            for (let i = 0; i < keys.length; i++) {
                const attributeKey = keys[i];
                const tagUnion = objectAssign(
                    {},
                    approvedSeenTags[attributeKey],
                    instanceSeenTags[attributeKey]
                );

                approvedSeenTags[attributeKey] = tagUnion;
            }

            return approvedTags;
        }, [])
        .reverse();
};

const getInnermostProperty = (propsList, property) => {
    for (let i = propsList.length - 1; i >= 0; i--) {
        const props = propsList[i];

        if (props.hasOwnProperty(property)) {
            return props[property];
        }
    }

    return null;
};

const reducePropsToState = propsList => ({
    baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], propsList),
    bodyAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.BODY, propsList),
    defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
    encode: getInnermostProperty(
        propsList,
        HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS
    ),
    htmlAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.HTML, propsList),
    linkTags: getTagsFromPropsList(
        TAG_NAMES.LINK,
        [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF],
        propsList
    ),
    metaTags: getTagsFromPropsList(
        TAG_NAMES.META,
        [
            TAG_PROPERTIES.NAME,
            TAG_PROPERTIES.CHARSET,
            TAG_PROPERTIES.HTTPEQUIV,
            TAG_PROPERTIES.PROPERTY,
            TAG_PROPERTIES.ITEM_PROP
        ],
        propsList
    ),
    noscriptTags: getTagsFromPropsList(
        TAG_NAMES.NOSCRIPT,
        [TAG_PROPERTIES.INNER_HTML],
        propsList
    ),
    onChangeClientState: getOnChangeClientState(propsList),
    scriptTags: getTagsFromPropsList(
        TAG_NAMES.SCRIPT,
        [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
        propsList
    ),
    styleTags: getTagsFromPropsList(
        TAG_NAMES.STYLE,
        [TAG_PROPERTIES.CSS_TEXT],
        propsList
    ),
    title: getTitleFromPropsList(propsList),
    titleAttributes: getAttributesFromPropsList(
        ATTRIBUTE_NAMES.TITLE,
        propsList
    )
});

const generateTagsAsReactComponent = (type, tags, options = {}) =>
    tags.map((tag, i) => {
        let mappedTag = {
            key: i
        };

        Object.keys(tag).forEach(attribute => {
            const mappedAttribute = REACT_TAG_MAP[attribute] || attribute;

            if (
                mappedAttribute === TAG_PROPERTIES.INNER_HTML ||
                mappedAttribute === TAG_PROPERTIES.CSS_TEXT
            ) {
                const content = tag.innerHTML || tag.cssText;
                mappedTag.dangerouslySetInnerHTML = {__html: content};
            } else {
                mappedTag[mappedAttribute] = tag[attribute];
            }
        });

        if (options[type]) {
            const {component, props} = options[type];
            mappedTag = {...props, ...mappedTag};
            type = component || type;
        }

        return React.createElement(type, mappedTag);
    });

const convertElementAttributestoReactProps = (attributes, initProps = {}) => {
    return Object.keys(attributes).reduce((obj, key) => {
        obj[REACT_TAG_MAP[key] || key] = attributes[key];
        return obj;
    }, initProps);
};

const generateTitleAsReactComponent = (
    type,
    title,
    attributes,
    options = {}
) => {
    // assigning into an array to define toString function on it
    const initProps = {
        key: title
    };

    let props = convertElementAttributestoReactProps(attributes, initProps);

    if (options[type]) {
        const {component, props: typeComponentProps = {}} = options[type];
        props = {...props, ...typeComponentProps};
        type = component || type;
    }

    return [React.createElement(type, props, title)];
};

const flattenArray = possibleArray => {
    return Array.isArray(possibleArray)
        ? possibleArray.join("")
        : possibleArray;
};

const warn = msg => {
    return console && typeof console.warn === "function" && console.warn(msg);
};

const updateAttributes = (tagName, attributes) => {
    const elementTag = document.getElementsByTagName(tagName)[0];

    if (!elementTag) {
        return;
    }

    // Determine if any attributes need to be ignored
    const helmetIgnoreAttributeString = elementTag.getAttribute(
        HELMET_IGNORE_ATTRIBUTE
    );
    const helmetIgnoreAttributes = helmetIgnoreAttributeString
        ? helmetIgnoreAttributeString.split(",")
        : [];

    // Determine existing attributes
    const helmetAttributes = [];
    if (elementTag.hasAttributes()) {
        const attrs = elementTag.attributes;
        for (let i = attrs.length - 1; i >= 0; i--) {
            if (helmetIgnoreAttributes.indexOf(attrs[i].name) === -1) {
                helmetAttributes.push(attrs[i].name); // attrs[i].value
            }
        }
    }
    const attributesToRemove = [].concat(helmetAttributes);
    const attributeKeys = Object.keys(attributes);

    for (let i = 0; i < attributeKeys.length; i++) {
        const attribute = attributeKeys[i];
        const value = attributes[attribute] || "";

        if (elementTag.getAttribute(attribute) !== value) {
            elementTag.setAttribute(attribute, value);
        }

        if (helmetAttributes.indexOf(attribute) === -1) {
            helmetAttributes.push(attribute);
        }

        const indexToSave = attributesToRemove.indexOf(attribute);
        if (indexToSave !== -1) {
            attributesToRemove.splice(indexToSave, 1);
        }
    }

    for (let i = attributesToRemove.length - 1; i >= 0; i--) {
        elementTag.removeAttribute(attributesToRemove[i]);
    }
};

export {
    reducePropsToState,
    generateTitleAsReactComponent,
    convertElementAttributestoReactProps,
    generateTagsAsReactComponent,
    flattenArray,
    warn,
    updateAttributes
};
