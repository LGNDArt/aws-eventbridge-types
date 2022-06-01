// To parse this data:
//
//   import { Convert, AwsHealth } from "./file";
//
//   const awsHealth = Convert.toAwsHealth(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsHealth {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsHealthElement: AwsHealthElement;
    Detail:           Detail;
    AffectedEntity:   AffectedEntity;
    Tags:             Tags;
    EventDescription: EventDescription;
}

export interface AffectedEntity {
    type:                 string;
    additionalProperties: boolean;
    properties:           AffectedEntityProperties;
    required:             string[];
    title:                string;
}

export interface AffectedEntityProperties {
    entityValue: EntityValue;
    tags:        Items;
}

export interface EntityValue {
    type: Type;
}

export enum Type {
    String = "string",
}

export interface Items {
    $ref: string;
}

export interface AwsHealthElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsHealthElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsHealthElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": EntityValue;
    source:        EntityValue;
    account:       EntityValue;
    time:          ID;
    region:        EntityValue;
    resources:     Resources;
    detail:        Items;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: EntityValue;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventArn:          EntityValue;
    service:           EntityValue;
    eventTypeCode:     EntityValue;
    eventTypeCategory: EntityValue;
    startTime:         EntityValue;
    endTime:           EntityValue;
    eventDescription:  AffectedEntities;
    affectedEntities:  AffectedEntities;
}

export interface AffectedEntities {
    type:  string;
    items: Items;
}

export interface EventDescription {
    type:                 string;
    additionalProperties: boolean;
    properties:           EventDescriptionProperties;
    required:             string[];
    title:                string;
}

export interface EventDescriptionProperties {
    language:          EntityValue;
    latestDescription: EntityValue;
}

export interface Tags {
    type:                 string;
    additionalProperties: boolean;
    properties:           TagsProperties;
    required:             string[];
    title:                string;
}

export interface TagsProperties {
    stage: EntityValue;
    app:   EntityValue;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsHealth(json: string): AwsHealth {
        return cast(JSON.parse(json), r("AwsHealth"));
    }

    public static awsHealthToJson(value: AwsHealth): string {
        return JSON.stringify(uncast(value, r("AwsHealth")), null, 2);
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
    "AwsHealth": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsHealthElement", js: "AwsHealthElement", typ: r("AwsHealthElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "AffectedEntity", js: "AffectedEntity", typ: r("AffectedEntity") },
        { json: "Tags", js: "Tags", typ: r("Tags") },
        { json: "EventDescription", js: "EventDescription", typ: r("EventDescription") },
    ], false),
    "AffectedEntity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AffectedEntityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AffectedEntityProperties": o([
        { json: "entityValue", js: "entityValue", typ: r("EntityValue") },
        { json: "tags", js: "tags", typ: r("Items") },
    ], false),
    "EntityValue": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "AwsHealthElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsHealthElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsHealthElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("EntityValue") },
        { json: "source", js: "source", typ: r("EntityValue") },
        { json: "account", js: "account", typ: r("EntityValue") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("EntityValue") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("EntityValue") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventArn", js: "eventArn", typ: r("EntityValue") },
        { json: "service", js: "service", typ: r("EntityValue") },
        { json: "eventTypeCode", js: "eventTypeCode", typ: r("EntityValue") },
        { json: "eventTypeCategory", js: "eventTypeCategory", typ: r("EntityValue") },
        { json: "startTime", js: "startTime", typ: r("EntityValue") },
        { json: "endTime", js: "endTime", typ: r("EntityValue") },
        { json: "eventDescription", js: "eventDescription", typ: r("AffectedEntities") },
        { json: "affectedEntities", js: "affectedEntities", typ: r("AffectedEntities") },
    ], false),
    "AffectedEntities": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "EventDescription": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EventDescriptionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EventDescriptionProperties": o([
        { json: "language", js: "language", typ: r("EntityValue") },
        { json: "latestDescription", js: "latestDescription", typ: r("EntityValue") },
    ], false),
    "Tags": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TagsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TagsProperties": o([
        { json: "stage", js: "stage", typ: r("EntityValue") },
        { json: "app", js: "app", typ: r("EntityValue") },
    ], false),
    "Type": [
        "string",
    ],
};
