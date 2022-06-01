// To parse this data:
//
//   import { Convert, AwsOrganizations } from "./file";
//
//   const awsOrganizations = Convert.toAwsOrganizations(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsOrganizations {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsOrganization:     AwsOrganization;
    Detail:              Detail;
    ServiceEventDetails: ServiceEventDetails;
    CreateAccountStatus: CreateAccountStatus;
    UserIdentity:        UserIdentity;
}

export interface AwsOrganization {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsOrganizationProperties;
    required:             string[];
    title:                string;
}

export interface AwsOrganizationProperties {
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
    Boolean = "boolean",
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

export interface CreateAccountStatus {
    type:                 string;
    additionalProperties: boolean;
    properties:           CreateAccountStatusProperties;
    required:             string[];
    title:                string;
}

export interface CreateAccountStatusProperties {
    id:                 Account;
    state:              Account;
    accountName:        Account;
    accountId:          Account;
    requestedTimestamp: Account;
    completedTimestamp: Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:        Account;
    userIdentity:        DetailClass;
    eventTime:           ID;
    eventSource:         Account;
    eventName:           Account;
    awsRegion:           Account;
    sourceIPAddress:     Account;
    userAgent:           Account;
    eventID:             Account;
    readOnly:            Account;
    eventType:           Account;
    serviceEventDetails: DetailClass;
}

export interface ServiceEventDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           ServiceEventDetailsProperties;
    required:             string[];
    title:                string;
}

export interface ServiceEventDetailsProperties {
    createAccountStatus: DetailClass;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    accountId: Account;
    invokedBy: Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsOrganizations(json: string): AwsOrganizations {
        return cast(JSON.parse(json), r("AwsOrganizations"));
    }

    public static awsOrganizationsToJson(value: AwsOrganizations): string {
        return JSON.stringify(uncast(value, r("AwsOrganizations")), null, 2);
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
    "AwsOrganizations": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsOrganization", js: "AwsOrganization", typ: r("AwsOrganization") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "ServiceEventDetails", js: "ServiceEventDetails", typ: r("ServiceEventDetails") },
        { json: "CreateAccountStatus", js: "CreateAccountStatus", typ: r("CreateAccountStatus") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
    ], false),
    "AwsOrganization": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsOrganizationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsOrganizationProperties": o([
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
    "CreateAccountStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CreateAccountStatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CreateAccountStatusProperties": o([
        { json: "id", js: "id", typ: r("Account") },
        { json: "state", js: "state", typ: r("Account") },
        { json: "accountName", js: "accountName", typ: r("Account") },
        { json: "accountId", js: "accountId", typ: r("Account") },
        { json: "requestedTimestamp", js: "requestedTimestamp", typ: r("Account") },
        { json: "completedTimestamp", js: "completedTimestamp", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventVersion", js: "eventVersion", typ: r("Account") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("ID") },
        { json: "eventSource", js: "eventSource", typ: r("Account") },
        { json: "eventName", js: "eventName", typ: r("Account") },
        { json: "awsRegion", js: "awsRegion", typ: r("Account") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("Account") },
        { json: "userAgent", js: "userAgent", typ: r("Account") },
        { json: "eventID", js: "eventID", typ: r("Account") },
        { json: "readOnly", js: "readOnly", typ: r("Account") },
        { json: "eventType", js: "eventType", typ: r("Account") },
        { json: "serviceEventDetails", js: "serviceEventDetails", typ: r("DetailClass") },
    ], false),
    "ServiceEventDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ServiceEventDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServiceEventDetailsProperties": o([
        { json: "createAccountStatus", js: "createAccountStatus", typ: r("DetailClass") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "accountId", js: "accountId", typ: r("Account") },
        { json: "invokedBy", js: "invokedBy", typ: r("Account") },
    ], false),
    "Type": [
        "boolean",
        "string",
    ],
};
