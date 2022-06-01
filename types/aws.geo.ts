// To parse this data:
//
//   import { Convert, AwsGeo } from "./file";
//
//   const awsGeo = Convert.toAwsGeo(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsGeo {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsGeoElement:      AwsGeoElement;
    Detail:             Detail;
    Accuracy:           Accuracy;
    PositionProperties: PositionProperties;
}

export interface Accuracy {
    type:                 string;
    additionalProperties: boolean;
    properties:           AccuracyProperties;
    required:             string[];
    title:                string;
}

export interface AccuracyProperties {
    Horizontal: Horizontal;
}

export interface Horizontal {
    type: Type;
}

export enum Type {
    Number = "number",
    String = "string",
}

export interface AwsGeoElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsGeoElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsGeoElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Horizontal;
    source:        Horizontal;
    account:       Horizontal;
    time:          ID;
    region:        Horizontal;
    resources:     Resources;
    detail:        Items;
}

export interface Items {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: Horizontal;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    EventType:          Horizontal;
    GeofenceId:         Horizontal;
    DeviceId:           Horizontal;
    SampleTime:         ID;
    Position:           Resources;
    Accuracy:           Items;
    PositionProperties: Items;
}

export interface PositionProperties {
    type:                 string;
    additionalProperties: boolean;
    properties:           PositionPropertiesProperties;
    required:             string[];
    title:                string;
}

export interface PositionPropertiesProperties {
    field1: Horizontal;
    field2: Horizontal;
    field3: Horizontal;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsGeo(json: string): AwsGeo {
        return cast(JSON.parse(json), r("AwsGeo"));
    }

    public static awsGeoToJson(value: AwsGeo): string {
        return JSON.stringify(uncast(value, r("AwsGeo")), null, 2);
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
    "AwsGeo": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsGeoElement", js: "AwsGeoElement", typ: r("AwsGeoElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Accuracy", js: "Accuracy", typ: r("Accuracy") },
        { json: "PositionProperties", js: "PositionProperties", typ: r("PositionProperties") },
    ], false),
    "Accuracy": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AccuracyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AccuracyProperties": o([
        { json: "Horizontal", js: "Horizontal", typ: r("Horizontal") },
    ], false),
    "Horizontal": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsGeoElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsGeoElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsGeoElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Horizontal") },
        { json: "source", js: "source", typ: r("Horizontal") },
        { json: "account", js: "account", typ: r("Horizontal") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Horizontal") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Horizontal") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "EventType", js: "EventType", typ: r("Horizontal") },
        { json: "GeofenceId", js: "GeofenceId", typ: r("Horizontal") },
        { json: "DeviceId", js: "DeviceId", typ: r("Horizontal") },
        { json: "SampleTime", js: "SampleTime", typ: r("ID") },
        { json: "Position", js: "Position", typ: r("Resources") },
        { json: "Accuracy", js: "Accuracy", typ: r("Items") },
        { json: "PositionProperties", js: "PositionProperties", typ: r("Items") },
    ], false),
    "PositionProperties": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PositionPropertiesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PositionPropertiesProperties": o([
        { json: "field1", js: "field1", typ: r("Horizontal") },
        { json: "field2", js: "field2", typ: r("Horizontal") },
        { json: "field3", js: "field3", typ: r("Horizontal") },
    ], false),
    "Type": [
        "number",
        "string",
    ],
};
