// To parse this data:
//
//   import { Convert, AwsControltower } from "./file";
//
//   const awsControltower = Convert.toAwsControltower(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsControltower {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsControltowerElement: AwsControltowerElement;
    Detail:                 Detail;
    ServiceEventDetails:    ServiceEventDetails;
    TStatus:                TStatus;
    AbleGuardrailStatus:    AbleGuardrailStatus;
    Guardrail:              Guardrail;
    OrganizationalUnit:     OrganizationalUnit;
    LandingZoneStatus:      LandingZoneStatus;
    Account:                Account;
    UserIdentity:           UserIdentity;
    OrganizationalUnitName: OrganizationalUnitName;
}

export interface AbleGuardrailStatus {
    type:                 string;
    additionalProperties: boolean;
    properties:           AbleGuardrailStatusProperties;
    required:             string[];
    title:                string;
}

export interface AbleGuardrailStatusProperties {
    organizationalUnits: Guardrails;
    guardrails:          Guardrails;
    state:               CompletedTimestamp;
    message:             CompletedTimestamp;
    requestTimestamp:    CompletedTimestamp;
    completedTimestamp:  CompletedTimestamp;
}

export interface CompletedTimestamp {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Null = "null",
    String = "string",
}

export interface Guardrails {
    type:  string;
    items: DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface Account {
    type:                 string;
    additionalProperties: boolean;
    properties:           AccountProperties;
    required:             string[];
    title:                string;
}

export interface AccountProperties {
    accountName: CompletedTimestamp;
    accountId:   CompletedTimestamp;
}

export interface AwsControltowerElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsControltowerElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsControltowerElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": CompletedTimestamp;
    source:        CompletedTimestamp;
    account:       CompletedTimestamp;
    time:          ID;
    region:        CompletedTimestamp;
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
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:        CompletedTimestamp;
    userIdentity:        DetailClass;
    eventTime:           ID;
    eventSource:         CompletedTimestamp;
    eventName:           CompletedTimestamp;
    awsRegion:           CompletedTimestamp;
    sourceIPAddress:     CompletedTimestamp;
    userAgent:           CompletedTimestamp;
    requestParameters:   CompletedTimestamp;
    responseElements:    CompletedTimestamp;
    eventID:             CompletedTimestamp;
    readOnly:            CompletedTimestamp;
    eventType:           CompletedTimestamp;
    recipientAccountId:  CompletedTimestamp;
    serviceEventDetails: DetailClass;
}

export interface Guardrail {
    type:                 string;
    additionalProperties: boolean;
    properties:           GuardrailProperties;
    required:             string[];
    title:                string;
}

export interface GuardrailProperties {
    guardrailId:       CompletedTimestamp;
    guardrailBehavior: CompletedTimestamp;
}

export interface LandingZoneStatus {
    type:                 string;
    additionalProperties: boolean;
    properties:           LandingZoneStatusProperties;
    required:             string[];
    title:                string;
}

export interface LandingZoneStatusProperties {
    rootOrganizationalUnitId: CompletedTimestamp;
    organizationalUnits:      Guardrails;
    accounts:                 Guardrails;
    state:                    CompletedTimestamp;
    message:                  CompletedTimestamp;
    requestedTimestamp:       CompletedTimestamp;
    completedTimestamp:       CompletedTimestamp;
}

export interface OrganizationalUnit {
    type:                 string;
    additionalProperties: boolean;
    properties:           OrganizationalUnitProperties;
    required:             string[];
    title:                string;
}

export interface OrganizationalUnitProperties {
    organizationalUnitName: DetailClass;
    organizationalUnitId:   CompletedTimestamp;
}

export interface OrganizationalUnitName {
    type:  Type;
    enum:  string[];
    title: string;
}

export interface ServiceEventDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           ServiceEventDetailsProperties;
    required:             any[];
    title:                string;
}

export interface ServiceEventDetailsProperties {
    updateManagedAccountStatus:         DetailClass;
    registerOrganizationalUnitStatus:   DetailClass;
    disableGuardrailStatus:             DetailClass;
    deregisterOrganizationalUnitStatus: DetailClass;
    enableGuardrailStatus:              DetailClass;
    createManagedAccountStatus:         DetailClass;
    setupLandingZoneStatus:             DetailClass;
    updateLandingZoneStatus:            DetailClass;
}

export interface TStatus {
    type:                 string;
    additionalProperties: boolean;
    properties:           TStatusProperties;
    required:             string[];
    title:                string;
}

export interface TStatusProperties {
    organizationalUnit: DetailClass;
    account:            DetailClass;
    state:              CompletedTimestamp;
    message:            CompletedTimestamp;
    requestedTimestamp: CompletedTimestamp;
    completedTimestamp: CompletedTimestamp;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    accountId: CompletedTimestamp;
    invokedBy: CompletedTimestamp;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsControltower(json: string): AwsControltower {
        return cast(JSON.parse(json), r("AwsControltower"));
    }

    public static awsControltowerToJson(value: AwsControltower): string {
        return JSON.stringify(uncast(value, r("AwsControltower")), null, 2);
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
    "AwsControltower": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsControltowerElement", js: "AwsControltowerElement", typ: r("AwsControltowerElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "ServiceEventDetails", js: "ServiceEventDetails", typ: r("ServiceEventDetails") },
        { json: "TStatus", js: "TStatus", typ: r("TStatus") },
        { json: "AbleGuardrailStatus", js: "AbleGuardrailStatus", typ: r("AbleGuardrailStatus") },
        { json: "Guardrail", js: "Guardrail", typ: r("Guardrail") },
        { json: "OrganizationalUnit", js: "OrganizationalUnit", typ: r("OrganizationalUnit") },
        { json: "LandingZoneStatus", js: "LandingZoneStatus", typ: r("LandingZoneStatus") },
        { json: "Account", js: "Account", typ: r("Account") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
        { json: "OrganizationalUnitName", js: "OrganizationalUnitName", typ: r("OrganizationalUnitName") },
    ], false),
    "AbleGuardrailStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AbleGuardrailStatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AbleGuardrailStatusProperties": o([
        { json: "organizationalUnits", js: "organizationalUnits", typ: r("Guardrails") },
        { json: "guardrails", js: "guardrails", typ: r("Guardrails") },
        { json: "state", js: "state", typ: r("CompletedTimestamp") },
        { json: "message", js: "message", typ: r("CompletedTimestamp") },
        { json: "requestTimestamp", js: "requestTimestamp", typ: r("CompletedTimestamp") },
        { json: "completedTimestamp", js: "completedTimestamp", typ: r("CompletedTimestamp") },
    ], false),
    "CompletedTimestamp": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Guardrails": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AccountProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AccountProperties": o([
        { json: "accountName", js: "accountName", typ: r("CompletedTimestamp") },
        { json: "accountId", js: "accountId", typ: r("CompletedTimestamp") },
    ], false),
    "AwsControltowerElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsControltowerElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsControltowerElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("CompletedTimestamp") },
        { json: "source", js: "source", typ: r("CompletedTimestamp") },
        { json: "account", js: "account", typ: r("CompletedTimestamp") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("CompletedTimestamp") },
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
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventVersion", js: "eventVersion", typ: r("CompletedTimestamp") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("ID") },
        { json: "eventSource", js: "eventSource", typ: r("CompletedTimestamp") },
        { json: "eventName", js: "eventName", typ: r("CompletedTimestamp") },
        { json: "awsRegion", js: "awsRegion", typ: r("CompletedTimestamp") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("CompletedTimestamp") },
        { json: "userAgent", js: "userAgent", typ: r("CompletedTimestamp") },
        { json: "requestParameters", js: "requestParameters", typ: r("CompletedTimestamp") },
        { json: "responseElements", js: "responseElements", typ: r("CompletedTimestamp") },
        { json: "eventID", js: "eventID", typ: r("CompletedTimestamp") },
        { json: "readOnly", js: "readOnly", typ: r("CompletedTimestamp") },
        { json: "eventType", js: "eventType", typ: r("CompletedTimestamp") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("CompletedTimestamp") },
        { json: "serviceEventDetails", js: "serviceEventDetails", typ: r("DetailClass") },
    ], false),
    "Guardrail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GuardrailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GuardrailProperties": o([
        { json: "guardrailId", js: "guardrailId", typ: r("CompletedTimestamp") },
        { json: "guardrailBehavior", js: "guardrailBehavior", typ: r("CompletedTimestamp") },
    ], false),
    "LandingZoneStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("LandingZoneStatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "LandingZoneStatusProperties": o([
        { json: "rootOrganizationalUnitId", js: "rootOrganizationalUnitId", typ: r("CompletedTimestamp") },
        { json: "organizationalUnits", js: "organizationalUnits", typ: r("Guardrails") },
        { json: "accounts", js: "accounts", typ: r("Guardrails") },
        { json: "state", js: "state", typ: r("CompletedTimestamp") },
        { json: "message", js: "message", typ: r("CompletedTimestamp") },
        { json: "requestedTimestamp", js: "requestedTimestamp", typ: r("CompletedTimestamp") },
        { json: "completedTimestamp", js: "completedTimestamp", typ: r("CompletedTimestamp") },
    ], false),
    "OrganizationalUnit": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OrganizationalUnitProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OrganizationalUnitProperties": o([
        { json: "organizationalUnitName", js: "organizationalUnitName", typ: r("DetailClass") },
        { json: "organizationalUnitId", js: "organizationalUnitId", typ: r("CompletedTimestamp") },
    ], false),
    "OrganizationalUnitName": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServiceEventDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ServiceEventDetailsProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServiceEventDetailsProperties": o([
        { json: "updateManagedAccountStatus", js: "updateManagedAccountStatus", typ: r("DetailClass") },
        { json: "registerOrganizationalUnitStatus", js: "registerOrganizationalUnitStatus", typ: r("DetailClass") },
        { json: "disableGuardrailStatus", js: "disableGuardrailStatus", typ: r("DetailClass") },
        { json: "deregisterOrganizationalUnitStatus", js: "deregisterOrganizationalUnitStatus", typ: r("DetailClass") },
        { json: "enableGuardrailStatus", js: "enableGuardrailStatus", typ: r("DetailClass") },
        { json: "createManagedAccountStatus", js: "createManagedAccountStatus", typ: r("DetailClass") },
        { json: "setupLandingZoneStatus", js: "setupLandingZoneStatus", typ: r("DetailClass") },
        { json: "updateLandingZoneStatus", js: "updateLandingZoneStatus", typ: r("DetailClass") },
    ], false),
    "TStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TStatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TStatusProperties": o([
        { json: "organizationalUnit", js: "organizationalUnit", typ: r("DetailClass") },
        { json: "account", js: "account", typ: r("DetailClass") },
        { json: "state", js: "state", typ: r("CompletedTimestamp") },
        { json: "message", js: "message", typ: r("CompletedTimestamp") },
        { json: "requestedTimestamp", js: "requestedTimestamp", typ: r("CompletedTimestamp") },
        { json: "completedTimestamp", js: "completedTimestamp", typ: r("CompletedTimestamp") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "accountId", js: "accountId", typ: r("CompletedTimestamp") },
        { json: "invokedBy", js: "invokedBy", typ: r("CompletedTimestamp") },
    ], false),
    "Type": [
        "boolean",
        "null",
        "string",
    ],
};
