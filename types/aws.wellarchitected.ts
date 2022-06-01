// To parse this data:
//
//   import { Convert, AwsWellarchitected } from "./file";
//
//   const awsWellarchitected = Convert.toAwsWellarchitected(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsWellarchitected {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsWellarchitectedElement: AwsWellarchitectedElement;
    Detail:                    Detail;
    RequestParameters:         RequestParameters;
    ResponseElements:          ResponseElements;
    UserIdentity:              UserIdentity;
    SessionContext:            SessionContext;
    Attributes:                Attributes;
    SessionIssuer:             SessionIssuer;
    WebIDFederationData:       WebIDFederationData;
}

export interface Attributes {
    type:                 string;
    additionalProperties: boolean;
    properties:           AttributesProperties;
    required:             string[];
    title:                string;
}

export interface AttributesProperties {
    creationDate:     CreationDate;
    mfaAuthenticated: CreationDate;
}

export interface CreationDate {
    type:   Type;
    format: string;
}

export enum Type {
    Boolean = "boolean",
    String = "string",
}

export interface AwsWellarchitectedElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsWellarchitectedElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsWellarchitectedElementProperties {
    version:       CreationDate;
    id:            CreationDate;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          CreationDate;
    region:        Account;
    resources:     Resources;
    detail:        DetailClass;
}

export interface Account {
    type: Type;
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

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:       Account;
    userIdentity:       DetailClass;
    eventTime:          CreationDate;
    eventSource:        Account;
    eventName:          Account;
    awsRegion:          Account;
    sourceIPAddress:    Account;
    userAgent:          Account;
    requestParameters:  DetailClass;
    responseElements:   DetailClass;
    requestID:          CreationDate;
    eventID:            CreationDate;
    readOnly:           Account;
    eventType:          Account;
    managementEvent:    Account;
    recipientAccountId: Account;
    eventCategory:      Account;
}

export interface RequestParameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           RequestParametersProperties;
    required:             string[];
    title:                string;
}

export interface RequestParametersProperties {
    Status:             Account;
    SelectedChoices:    Account;
    ChoiceUpdates:      Account;
    QuestionId:         Account;
    WorkloadId:         Account;
    IsApplicable:       Account;
    LensAlias:          Account;
    Reason:             Account;
    Notes:              Account;
    IsMajorVersion:     Account;
    LensVersion:        Account;
    ClientRequestToken: CreationDate;
}

export interface ResponseElements {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResponseElementsProperties;
    required:             any[];
    title:                string;
}

export interface ResponseElementsProperties {
    Answer:      Account;
    LensAlias:   Account;
    WorkloadId:  Account;
    LensArn:     Account;
    LensVersion: Account;
}

export interface SessionContext {
    type:                 string;
    additionalProperties: boolean;
    properties:           SessionContextProperties;
    required:             string[];
    title:                string;
}

export interface SessionContextProperties {
    sessionIssuer:       DetailClass;
    webIdFederationData: DetailClass;
    attributes:          DetailClass;
}

export interface SessionIssuer {
    type:                 string;
    additionalProperties: boolean;
    properties:           SessionIssuerProperties;
    required:             string[];
    title:                string;
}

export interface SessionIssuerProperties {
    type:        Account;
    principalId: Account;
    arn:         Account;
    accountId:   Account;
    userName:    Account;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    type:           Account;
    principalId:    Account;
    arn:            Account;
    accountId:      Account;
    accessKeyId:    Account;
    sessionContext: DetailClass;
}

export interface WebIDFederationData {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsWellarchitected(json: string): AwsWellarchitected {
        return cast(JSON.parse(json), r("AwsWellarchitected"));
    }

    public static awsWellarchitectedToJson(value: AwsWellarchitected): string {
        return JSON.stringify(uncast(value, r("AwsWellarchitected")), null, 2);
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
    "AwsWellarchitected": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsWellarchitectedElement", js: "AwsWellarchitectedElement", typ: r("AwsWellarchitectedElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "RequestParameters", js: "RequestParameters", typ: r("RequestParameters") },
        { json: "ResponseElements", js: "ResponseElements", typ: r("ResponseElements") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
        { json: "SessionContext", js: "SessionContext", typ: r("SessionContext") },
        { json: "Attributes", js: "Attributes", typ: r("Attributes") },
        { json: "SessionIssuer", js: "SessionIssuer", typ: r("SessionIssuer") },
        { json: "WebIDFederationData", js: "WebIDFederationData", typ: r("WebIDFederationData") },
    ], false),
    "Attributes": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AttributesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AttributesProperties": o([
        { json: "creationDate", js: "creationDate", typ: r("CreationDate") },
        { json: "mfaAuthenticated", js: "mfaAuthenticated", typ: r("CreationDate") },
    ], false),
    "CreationDate": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "AwsWellarchitectedElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsWellarchitectedElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsWellarchitectedElementProperties": o([
        { json: "version", js: "version", typ: r("CreationDate") },
        { json: "id", js: "id", typ: r("CreationDate") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("CreationDate") },
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
        { json: "eventVersion", js: "eventVersion", typ: r("Account") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("CreationDate") },
        { json: "eventSource", js: "eventSource", typ: r("Account") },
        { json: "eventName", js: "eventName", typ: r("Account") },
        { json: "awsRegion", js: "awsRegion", typ: r("Account") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("Account") },
        { json: "userAgent", js: "userAgent", typ: r("Account") },
        { json: "requestParameters", js: "requestParameters", typ: r("DetailClass") },
        { json: "responseElements", js: "responseElements", typ: r("DetailClass") },
        { json: "requestID", js: "requestID", typ: r("CreationDate") },
        { json: "eventID", js: "eventID", typ: r("CreationDate") },
        { json: "readOnly", js: "readOnly", typ: r("Account") },
        { json: "eventType", js: "eventType", typ: r("Account") },
        { json: "managementEvent", js: "managementEvent", typ: r("Account") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("Account") },
        { json: "eventCategory", js: "eventCategory", typ: r("Account") },
    ], false),
    "RequestParameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RequestParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RequestParametersProperties": o([
        { json: "Status", js: "Status", typ: r("Account") },
        { json: "SelectedChoices", js: "SelectedChoices", typ: r("Account") },
        { json: "ChoiceUpdates", js: "ChoiceUpdates", typ: r("Account") },
        { json: "QuestionId", js: "QuestionId", typ: r("Account") },
        { json: "WorkloadId", js: "WorkloadId", typ: r("Account") },
        { json: "IsApplicable", js: "IsApplicable", typ: r("Account") },
        { json: "LensAlias", js: "LensAlias", typ: r("Account") },
        { json: "Reason", js: "Reason", typ: r("Account") },
        { json: "Notes", js: "Notes", typ: r("Account") },
        { json: "IsMajorVersion", js: "IsMajorVersion", typ: r("Account") },
        { json: "LensVersion", js: "LensVersion", typ: r("Account") },
        { json: "ClientRequestToken", js: "ClientRequestToken", typ: r("CreationDate") },
    ], false),
    "ResponseElements": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResponseElementsProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResponseElementsProperties": o([
        { json: "Answer", js: "Answer", typ: r("Account") },
        { json: "LensAlias", js: "LensAlias", typ: r("Account") },
        { json: "WorkloadId", js: "WorkloadId", typ: r("Account") },
        { json: "LensArn", js: "LensArn", typ: r("Account") },
        { json: "LensVersion", js: "LensVersion", typ: r("Account") },
    ], false),
    "SessionContext": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SessionContextProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SessionContextProperties": o([
        { json: "sessionIssuer", js: "sessionIssuer", typ: r("DetailClass") },
        { json: "webIdFederationData", js: "webIdFederationData", typ: r("DetailClass") },
        { json: "attributes", js: "attributes", typ: r("DetailClass") },
    ], false),
    "SessionIssuer": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SessionIssuerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SessionIssuerProperties": o([
        { json: "type", js: "type", typ: r("Account") },
        { json: "principalId", js: "principalId", typ: r("Account") },
        { json: "arn", js: "arn", typ: r("Account") },
        { json: "accountId", js: "accountId", typ: r("Account") },
        { json: "userName", js: "userName", typ: r("Account") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "type", js: "type", typ: r("Account") },
        { json: "principalId", js: "principalId", typ: r("Account") },
        { json: "arn", js: "arn", typ: r("Account") },
        { json: "accountId", js: "accountId", typ: r("Account") },
        { json: "accessKeyId", js: "accessKeyId", typ: r("Account") },
        { json: "sessionContext", js: "sessionContext", typ: r("DetailClass") },
    ], false),
    "WebIDFederationData": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Type": [
        "boolean",
        "string",
    ],
};
