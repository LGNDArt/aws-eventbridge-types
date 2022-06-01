// To parse this data:
//
//   import { Convert, AwsTranscribe } from "./file";
//
//   const awsTranscribe = Convert.toAwsTranscribe(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsTranscribe {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsTranscribeElement: AwsTranscribeElement;
    Detail:               Detail;
    Region:               Region;
    Source:               Region;
}

export interface AwsTranscribeElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsTranscribeElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsTranscribeElementProperties {
    version:       Time;
    id:            Account;
    "detail-type": Account;
    source:        DetailClass;
    account:       Account;
    time:          Time;
    region:        DetailClass;
    resources:     Resources;
    detail:        DetailClass;
}

export interface Account {
    type: Type;
}

export enum Type {
    String = "string",
}

export interface DetailClass {
    $ref: string;
}

export interface Resources {
    type:  string;
    items: ResourcesItems;
}

export interface ResourcesItems {
}

export interface Time {
    type:   Type;
    format: string;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    TranscriptionJobStatus:       TranscriptionJobStatus;
    JobType:                      Account;
    JobName:                      Account;
    LanguageIdentificationStatus: Account;
    JobStatus:                    Account;
    VocabularyName:               Account;
    VocabularyState:              Account;
    FailureReason:                Account;
}

export interface TranscriptionJobStatus {
    type:  string;
    items: Account;
}

export interface Region {
    type:  Type;
    enum:  string[];
    title: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsTranscribe(json: string): AwsTranscribe {
        return cast(JSON.parse(json), r("AwsTranscribe"));
    }

    public static awsTranscribeToJson(value: AwsTranscribe): string {
        return JSON.stringify(uncast(value, r("AwsTranscribe")), null, 2);
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
    "AwsTranscribe": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsTranscribeElement", js: "AwsTranscribeElement", typ: r("AwsTranscribeElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Region", js: "Region", typ: r("Region") },
        { json: "Source", js: "Source", typ: r("Region") },
    ], false),
    "AwsTranscribeElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsTranscribeElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsTranscribeElementProperties": o([
        { json: "version", js: "version", typ: r("Time") },
        { json: "id", js: "id", typ: r("Account") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("DetailClass") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("Time") },
        { json: "region", js: "region", typ: r("DetailClass") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ResourcesItems") },
    ], false),
    "ResourcesItems": o([
    ], false),
    "Time": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "TranscriptionJobStatus", js: "TranscriptionJobStatus", typ: r("TranscriptionJobStatus") },
        { json: "JobType", js: "JobType", typ: r("Account") },
        { json: "JobName", js: "JobName", typ: r("Account") },
        { json: "LanguageIdentificationStatus", js: "LanguageIdentificationStatus", typ: r("Account") },
        { json: "JobStatus", js: "JobStatus", typ: r("Account") },
        { json: "VocabularyName", js: "VocabularyName", typ: r("Account") },
        { json: "VocabularyState", js: "VocabularyState", typ: r("Account") },
        { json: "FailureReason", js: "FailureReason", typ: r("Account") },
    ], false),
    "TranscriptionJobStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "Region": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Type": [
        "string",
    ],
};
