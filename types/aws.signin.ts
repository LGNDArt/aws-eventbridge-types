// To parse this data:
//
//   import { Convert, AwsSignin } from "./file";
//
//   const awsSignin = Convert.toAwsSignin(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSignin {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsSigninElement:    AwsSigninElement;
    Detail:              Detail;
    AdditionalEventData: AdditionalEventData;
    ResponseElements:    ResponseElements;
    UserIdentity:        UserIdentity;
}

export interface AdditionalEventData {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdditionalEventDataProperties;
    required:             string[];
    title:                string;
}

export interface AdditionalEventDataProperties {
    LoginTo:       LoginTo;
    MobileVersion: MfaUsed;
    MFAUsed:       MfaUsed;
}

export interface LoginTo {
    type:               Type;
    format:             string;
    "qt-uri-protocols": string[];
}

export enum Type {
    Null = "null",
    String = "string",
}

export interface MfaUsed {
    type: Type;
}

export interface AwsSigninElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSigninElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsSigninElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": MfaUsed;
    source:        MfaUsed;
    account:       MfaUsed;
    time:          ID;
    region:        MfaUsed;
    resources:     Resources;
    detail:        DetailClass;
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

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:        MfaUsed;
    userIdentity:        DetailClass;
    eventTime:           ID;
    eventSource:         MfaUsed;
    eventName:           MfaUsed;
    awsRegion:           MfaUsed;
    sourceIPAddress:     MfaUsed;
    userAgent:           MfaUsed;
    requestParameters:   MfaUsed;
    responseElements:    DetailClass;
    additionalEventData: DetailClass;
    eventID:             ID;
    eventType:           MfaUsed;
}

export interface ResponseElements {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResponseElementsProperties;
    required:             string[];
    title:                string;
}

export interface ResponseElementsProperties {
    ConsoleLogin: MfaUsed;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    type:        MfaUsed;
    principalId: MfaUsed;
    arn:         MfaUsed;
    accountId:   MfaUsed;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSignin(json: string): AwsSignin {
        return cast(JSON.parse(json), r("AwsSignin"));
    }

    public static awsSigninToJson(value: AwsSignin): string {
        return JSON.stringify(uncast(value, r("AwsSignin")), null, 2);
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
    "AwsSignin": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSigninElement", js: "AwsSigninElement", typ: r("AwsSigninElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "AdditionalEventData", js: "AdditionalEventData", typ: r("AdditionalEventData") },
        { json: "ResponseElements", js: "ResponseElements", typ: r("ResponseElements") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
    ], false),
    "AdditionalEventData": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdditionalEventDataProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalEventDataProperties": o([
        { json: "LoginTo", js: "LoginTo", typ: r("LoginTo") },
        { json: "MobileVersion", js: "MobileVersion", typ: r("MfaUsed") },
        { json: "MFAUsed", js: "MFAUsed", typ: r("MfaUsed") },
    ], false),
    "LoginTo": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
    ], false),
    "MfaUsed": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsSigninElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSigninElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSigninElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("MfaUsed") },
        { json: "source", js: "source", typ: r("MfaUsed") },
        { json: "account", js: "account", typ: r("MfaUsed") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("MfaUsed") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
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
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventVersion", js: "eventVersion", typ: r("MfaUsed") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("ID") },
        { json: "eventSource", js: "eventSource", typ: r("MfaUsed") },
        { json: "eventName", js: "eventName", typ: r("MfaUsed") },
        { json: "awsRegion", js: "awsRegion", typ: r("MfaUsed") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("MfaUsed") },
        { json: "userAgent", js: "userAgent", typ: r("MfaUsed") },
        { json: "requestParameters", js: "requestParameters", typ: r("MfaUsed") },
        { json: "responseElements", js: "responseElements", typ: r("DetailClass") },
        { json: "additionalEventData", js: "additionalEventData", typ: r("DetailClass") },
        { json: "eventID", js: "eventID", typ: r("ID") },
        { json: "eventType", js: "eventType", typ: r("MfaUsed") },
    ], false),
    "ResponseElements": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResponseElementsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResponseElementsProperties": o([
        { json: "ConsoleLogin", js: "ConsoleLogin", typ: r("MfaUsed") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "type", js: "type", typ: r("MfaUsed") },
        { json: "principalId", js: "principalId", typ: r("MfaUsed") },
        { json: "arn", js: "arn", typ: r("MfaUsed") },
        { json: "accountId", js: "accountId", typ: r("MfaUsed") },
    ], false),
    "Type": [
        "null",
        "string",
    ],
};
