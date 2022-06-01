// To parse this data:
//
//   import { Convert, AwsSynthetics } from "./file";
//
//   const awsSynthetics = Convert.toAwsSynthetics(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSynthetics {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsSynthetic:      AwsSynthetic;
    Detail:            Detail;
    CanaryRunTimeline: CanaryRunTimeline;
    ChangedConfig:     ChangedConfig;
    IonArn:            IonArn;
}

export interface AwsSynthetic {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSyntheticProperties;
    required:             string[];
    title:                string;
}

export interface AwsSyntheticProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          ID;
    region:        Account;
    resources:     Resources;
    detail:        DetailClass;
}

export interface Account {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Number = "number",
    String = "string",
}

export interface DetailClass {
    $ref: string;
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

export interface CanaryRunTimeline {
    type:                 string;
    additionalProperties: boolean;
    properties:           CanaryRunTimelineProperties;
    required:             string[];
    title:                string;
}

export interface CanaryRunTimelineProperties {
    started:   Account;
    completed: Account;
}

export interface ChangedConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           ChangedConfigProperties;
    required:             string[];
    title:                string;
}

export interface ChangedConfigProperties {
    executionArn:            DetailClass;
    testCodeLayerVersionArn: DetailClass;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    "account-id":          Account;
    "canary-id":           Account;
    "canary-name":         Account;
    "current-state":       Account;
    "previous-state":      Account;
    "source-location":     Account;
    "updated-on":          Account;
    "changed-config":      DetailClass;
    message:               Account;
    "canary-run-id":       ID;
    "artifact-location":   Account;
    "test-run-status":     Account;
    "state-reason":        Account;
    "canary-run-timeline": DetailClass;
}

export interface IonArn {
    type:                 string;
    additionalProperties: boolean;
    properties:           IonArnProperties;
    required:             string[];
    title:                string;
}

export interface IonArnProperties {
    "previous-value": Account;
    "current-value":  Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSynthetics(json: string): AwsSynthetics {
        return cast(JSON.parse(json), r("AwsSynthetics"));
    }

    public static awsSyntheticsToJson(value: AwsSynthetics): string {
        return JSON.stringify(uncast(value, r("AwsSynthetics")), null, 2);
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
    "AwsSynthetics": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSynthetic", js: "AwsSynthetic", typ: r("AwsSynthetic") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "CanaryRunTimeline", js: "CanaryRunTimeline", typ: r("CanaryRunTimeline") },
        { json: "ChangedConfig", js: "ChangedConfig", typ: r("ChangedConfig") },
        { json: "IonArn", js: "IonArn", typ: r("IonArn") },
    ], false),
    "AwsSynthetic": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSyntheticProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSyntheticProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
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
    "CanaryRunTimeline": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CanaryRunTimelineProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CanaryRunTimelineProperties": o([
        { json: "started", js: "started", typ: r("Account") },
        { json: "completed", js: "completed", typ: r("Account") },
    ], false),
    "ChangedConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ChangedConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ChangedConfigProperties": o([
        { json: "executionArn", js: "executionArn", typ: r("DetailClass") },
        { json: "testCodeLayerVersionArn", js: "testCodeLayerVersionArn", typ: r("DetailClass") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "account-id", js: "account-id", typ: r("Account") },
        { json: "canary-id", js: "canary-id", typ: r("Account") },
        { json: "canary-name", js: "canary-name", typ: r("Account") },
        { json: "current-state", js: "current-state", typ: r("Account") },
        { json: "previous-state", js: "previous-state", typ: r("Account") },
        { json: "source-location", js: "source-location", typ: r("Account") },
        { json: "updated-on", js: "updated-on", typ: r("Account") },
        { json: "changed-config", js: "changed-config", typ: r("DetailClass") },
        { json: "message", js: "message", typ: r("Account") },
        { json: "canary-run-id", js: "canary-run-id", typ: r("ID") },
        { json: "artifact-location", js: "artifact-location", typ: r("Account") },
        { json: "test-run-status", js: "test-run-status", typ: r("Account") },
        { json: "state-reason", js: "state-reason", typ: r("Account") },
        { json: "canary-run-timeline", js: "canary-run-timeline", typ: r("DetailClass") },
    ], false),
    "IonArn": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("IonArnProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "IonArnProperties": o([
        { json: "previous-value", js: "previous-value", typ: r("Account") },
        { json: "current-value", js: "current-value", typ: r("Account") },
    ], false),
    "Type": [
        "integer",
        "number",
        "string",
    ],
};
