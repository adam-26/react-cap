import {flattenArray, warn, updateAttributes} from "./HelmetUtils";
import {
    HELMET_IGNORE_ATTRIBUTE,
    HTML_TAG_MAP,
    TAG_NAMES,
    TAG_PROPERTIES
} from "./HelmetConstants.js";

const rafPolyfill = (() => {
    let clock = Date.now();

    return (callback: Function) => {
        const currentTime = Date.now();

        if (currentTime - clock > 16) {
            clock = currentTime;
            callback(currentTime);
        } else {
            setTimeout(() => {
                rafPolyfill(callback);
            }, 0);
        }
    };
})();

const cafPolyfill = (id: string | number) => clearTimeout(id);

const requestAnimationFrame =
    typeof window !== "undefined"
        ? window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          rafPolyfill
        : global.requestAnimationFrame || rafPolyfill;

const cancelAnimationFrame =
    typeof window !== "undefined"
        ? window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          cafPolyfill
        : global.cancelAnimationFrame || cafPolyfill;

let _helmetCallback = null;

const handleClientStateChange = newState => {
    if (_helmetCallback) {
        cancelAnimationFrame(_helmetCallback);
    }

    if (newState.defer) {
        _helmetCallback = requestAnimationFrame(() => {
            commitTagChanges(newState, () => {
                _helmetCallback = null;
            });
        });
    } else {
        commitTagChanges(newState);
        _helmetCallback = null;
    }
};

const commitTagChanges = (newState, cb) => {
    const {
        baseTag,
        bodyAttributes,
        htmlAttributes,
        linkTags,
        metaTags,
        noscriptTags,
        onChangeClientState,
        scriptTags,
        styleTags,
        title,
        titleAttributes
    } = newState;
    updateAttributes(TAG_NAMES.BODY, bodyAttributes);
    updateAttributes(TAG_NAMES.HTML, htmlAttributes);

    updateTitle(title, titleAttributes);

    const tagUpdates = {
        baseTag: updateTags(TAG_NAMES.BASE, baseTag),
        linkTags: updateTags(TAG_NAMES.LINK, linkTags),
        metaTags: updateTags(TAG_NAMES.META, metaTags),
        noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, noscriptTags),
        scriptTags: updateTags(TAG_NAMES.SCRIPT, scriptTags),
        styleTags: updateTags(TAG_NAMES.STYLE, styleTags)
    };

    const addedTags = {};
    const removedTags = {};

    Object.keys(tagUpdates).forEach(tagType => {
        const {newTags, oldTags} = tagUpdates[tagType];

        if (newTags.length) {
            addedTags[tagType] = newTags;
        }
        if (oldTags.length) {
            removedTags[tagType] = tagUpdates[tagType].oldTags;
        }
    });

    cb && cb();

    onChangeClientState(newState, addedTags, removedTags);
};

const updateTitle = (title, attributes) => {
    if (typeof title !== "undefined" && document.title !== title) {
        document.title = flattenArray(title);
    }

    updateAttributes(TAG_NAMES.TITLE, attributes);
};

const updateTags = (type, tags) => {
    const headElement = document.head || document.querySelector(TAG_NAMES.HEAD);
    const tagNodes = headElement.querySelectorAll(
        `${type}:not([${HELMET_IGNORE_ATTRIBUTE}])`
    );
    const oldTags = Array.prototype.slice.call(tagNodes);
    const newTags = [];
    let indexToDelete;

    if (tags && tags.length) {
        tags.forEach(tag => {
            const newElement = document.createElement(type);

            for (const attribute in tag) {
                if (tag.hasOwnProperty(attribute)) {
                    if (attribute === TAG_PROPERTIES.INNER_HTML) {
                        newElement.innerHTML = tag.innerHTML;
                    } else if (attribute === TAG_PROPERTIES.CSS_TEXT) {
                        if (newElement.styleSheet) {
                            newElement.styleSheet.cssText = tag.cssText;
                        } else {
                            newElement.appendChild(
                                document.createTextNode(tag.cssText)
                            );
                        }
                    } else {
                        const value =
                            typeof tag[attribute] === "undefined"
                                ? ""
                                : tag[attribute];
                        newElement.setAttribute(attribute, value);
                    }
                }
            }

            // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
            if (
                oldTags.some((existingTag, index) => {
                    indexToDelete = index;
                    return newElement.isEqualNode(existingTag);
                })
            ) {
                oldTags.splice(indexToDelete, 1);
            } else {
                newTags.push(newElement);
            }
        });
    }

    oldTags.forEach(tag => tag.parentNode.removeChild(tag));
    newTags.forEach(tag => headElement.appendChild(tag));

    return {
        oldTags,
        newTags
    };
};

const convertReactPropstoHtmlAttributes = (props, initAttributes = {}) => {
    return Object.keys(props).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = props[key];
        return obj;
    }, initAttributes);
};

export {convertReactPropstoHtmlAttributes};
export {handleClientStateChange};
export {requestAnimationFrame};
export {warn};
