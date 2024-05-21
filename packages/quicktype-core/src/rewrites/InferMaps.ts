import { iterableEvery, iterableFirst, setMap } from "collection-utils";

import { type GraphRewriteBuilder } from "../GraphRewriting";
import { defined, panic } from "../support/Support";
import { type ClassProperty, ClassType, type Type } from "../Type";
import { type StringTypeMapping } from "../TypeBuilder";
import { type TypeGraph, type TypeRef } from "../TypeGraph";
import { unifyTypes, unionBuilderForUnification } from "../UnifyClasses";




function shouldBeMap(properties: ReadonlyMap<string, ClassProperty>): ReadonlySet<Type> | undefined {
    // If all property names are digit-only, we always make a map, no
    // questions asked.
    if (iterableEvery(properties.keys(), n => /^[0-9]+$/.test(n))) {
        return setMap(properties.values(), cp => cp.type);
    }

    return undefined;
}

export function inferMaps(
    graph: TypeGraph,
    stringTypeMapping: StringTypeMapping,
    conflateNumbers: boolean,
    debugPrintReconstitution: boolean
): TypeGraph {
    function replaceClass(
        setOfOneClass: ReadonlySet<ClassType>,
        builder: GraphRewriteBuilder<ClassType>,
        forwardingRef: TypeRef
    ): TypeRef {
        const c = defined(iterableFirst(setOfOneClass));
        const properties = c.getProperties();

        const shouldBe = shouldBeMap(properties);
        if (shouldBe === undefined) {
            return panic(`We shouldn't be replacing class ${c.getCombinedName()} with a map`);
        }

        // Now reconstitute all the types in the new graph.  TypeGraphs are
        // immutable, so any change in the graph actually means building a new
        // graph, and the types in the new graph are different objects.
        // Reconstituting a type means generating the "same" type in the new
        // type graph.  Except we don't get Type objects but TypeRef objects,
        // which is a type-to-be.
        return builder.getMapType(
            c.getAttributes(),
            unifyTypes(
                shouldBe,
                c.getAttributes(),
                builder,
                unionBuilderForUnification(builder, false, false, conflateNumbers),
                conflateNumbers
            ),
            forwardingRef
        );
    }

    const classesToReplace = Array.from(graph.allNamedTypesSeparated().objects).filter(o => {
        if (!(o instanceof ClassType)) return false;
        return !o.isFixed && shouldBeMap(o.getProperties()) !== undefined;
    }) as ClassType[];
    return graph.rewrite(
        "infer maps",
        stringTypeMapping,
        false,
        classesToReplace.map(c => [c]),
        debugPrintReconstitution,
        replaceClass
    );
}
