// To parse this data:
//
//   import { Convert, AwsGreengrass } from "./file";
//
//   const awsGreengrass = Convert.toAwsGreengrass(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsGreengrass {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsGreengrassElement: AwsGreengrassElement;
    Detail:               Detail;
    Adp:                  Adp;
    M:                    DefinitionsM;
}

export interface Adp {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdpProperties;
    required:             string[];
    title:                string;
}

export interface AdpProperties {
    TS: NS;
    NS: NS;
    M:  M;
}

export interface M {
    type:  string;
    items: DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface NS {
    type: Type;
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface AwsGreengrassElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsGreengrassElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsGreengrassElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": NS;
    source:        NS;
    account:       NS;
    time:          ID;
    region:        NS;
    resources:     Resources;
    detail:        DetailClass;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: ResourcesItems;
}

export interface ResourcesItems {
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    "group-id":        ID;
    "deployment-id":   ID;
    "deployment-type": NS;
    status:            NS;
    ThingName:         NS;
    Schema:            ID;
    ADP:               M;
}

export interface DefinitionsM {
    type:                 string;
    additionalProperties: boolean;
    properties:           MProperties;
    required:             string[];
    title:                string;
}

export interface MProperties {
    N:   NS;
    Sum: NS;
    U:   NS;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsGreengrass(json: string): AwsGreengrass {
        return cast(JSON.parse(json), r("AwsGreengrass"));
    }

    public static awsGreengrassToJson(value: AwsGreengrass): string {
        return JSON.stringify(uncast(value, r("AwsGreengrass")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "AwsGreengrass": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsGreengrassElement", js: "AwsGreengrassElement", typ: r("AwsGreengrassElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Adp", js: "Adp", typ: r("Adp") },
        { json: "M", js: "M", typ: r("DefinitionsM") },
    ], false),
    "Adp": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdpProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdpProperties": o([
        { json: "TS", js: "TS", typ: r("NS") },
        { json: "NS", js: "NS", typ: r("NS") },
        { json: "M", js: "M", typ: r("M") },
    ], false),
    "M": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "NS": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsGreengrassElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsGreengrassElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsGreengrassElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("NS") },
        { json: "source", js: "source", typ: r("NS") },
        { json: "account", js: "account", typ: r("NS") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("NS") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ResourcesItems") },
    ], false),
    "ResourcesItems": o([
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "group-id", js: "group-id", typ: r("ID") },
        { json: "deployment-id", js: "deployment-id", typ: r("ID") },
        { json: "deployment-type", js: "deployment-type", typ: r("NS") },
        { json: "status", js: "status", typ: r("NS") },
        { json: "ThingName", js: "ThingName", typ: r("NS") },
        { json: "Schema", js: "Schema", typ: r("ID") },
        { json: "ADP", js: "ADP", typ: r("M") },
    ], false),
    "DefinitionsM": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MProperties": o([
        { json: "N", js: "N", typ: r("NS") },
        { json: "Sum", js: "Sum", typ: r("NS") },
        { json: "U", js: "U", typ: r("NS") },
    ], false),
    "Type": [
        "integer",
        "string",
    ],
};
