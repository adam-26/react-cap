import * as p from "path";
import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

const copyright = `/*
 * Copyright (c) 2015 NFL
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
`;

const libOptions = {
    banner: copyright,
    exports: "named"
};

const plugins = [
    babel({
        babelrc: false,
        presets: [
            [
                "env",
                {
                    modules: false
                }
            ],
            "react"
        ],
        plugins: [
            "transform-object-rest-spread",
            "transform-class-properties",
            ["transform-react-remove-prop-types", {removeImport: true}],
            "external-helpers"
        ]
    }),
    nodeResolve({
        jsnext: true
    }),
    commonjs({
        sourcemap: true
    })
];

const externals = [
    "react",
    "react-dom/server",
    "object-assign",
    "deep-equal",
    "object-assign",
    "react-side-effect",
    "prop-types"
];

export default [
    {
        input: p.resolve("src/Helmet.js"),
        output: [
            {
                file: "lib/index.js",
                format: "cjs",
                ...libOptions
            },
            {
                file: "lib/index.es.js",
                format: "es",
                ...libOptions
            }
        ],
        external: externals,
        plugins
    },
    {
        input: p.resolve("src/HelmetServerUtils.js"),
        output: [
            {
                file: "lib/server.js",
                format: "cjs",
                ...libOptions
            },
            {
                file: "lib/server.es.js",
                format: "es",
                ...libOptions
            }
        ],
        external: externals,
        plugins
    },
    {
        input: p.resolve("src/CapUtils.js"),
        output: [
            {
                file: "lib/capUtils.js",
                format: "cjs",
                ...libOptions
            },
            {
                file: "lib/capUtils.es.js",
                format: "es",
                ...libOptions
            }
        ],
        external: externals,
        plugins
    }
];
