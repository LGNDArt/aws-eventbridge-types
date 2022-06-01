// To parse this data:
//
//   import { Convert, AwsSqs } from "./file";
//
//   const awsSqs = Convert.toAwsSqs(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSqs {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsSq:               AwsSq;
    Detail:              Detail;
    RequestParameters:   RequestParameters;
    Attribute:           Attribute;
    ResponseElements:    ResponseElements;
    UserIdentity:        UserIdentity;
    SessionContext:      SessionContext;
    Attributes:          Attributes;
    SessionIssuer:       SessionIssuer;
    WebIDFederationData: WebIDFederationData;
}

export interface Attribute {
    type:                 string;
    additionalProperties: boolean;
    properties:           AttributeProperties;
    required:             string[];
    title:                string;
}

export interface AttributeProperties {
    Policy:                        KmsMasterKeyID;
    ReceiveMessageWaitTimeSeconds: DelaySeconds;
    SqsManagedSseEnabled:          DelaySeconds;
    DelaySeconds:                  DelaySeconds;
    KmsMasterKeyId:                KmsMasterKeyID;
    RedrivePolicy:                 KmsMasterKeyID;
    MessageRetentionPeriod:        DelaySeconds;
    MaximumMessageSize:            DelaySeconds;
    VisibilityTimeout:             DelaySeconds;
    RedriveAllowPolicy:            KmsMasterKeyID;
}

export interface DelaySeconds {
    type:   Type;
    format: string;
}

export enum Type {
    Boolean = "boolean",
    String = "string",
}

export interface KmsMasterKeyID {
    type: Type;
}

export interface Attributes {
    type:                 string;
    additionalProperties: boolean;
    properties:           AttributesProperties;
    required:             string[];
    title:                string;
}

export interface AttributesProperties {
    creationDate:     DelaySeconds;
    mfaAuthenticated: DelaySeconds;
}

export interface AwsSq {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSqProperties;
    required:             string[];
    title:                string;
}

export interface AwsSqProperties {
    version:       DelaySeconds;
    id:            DelaySeconds;
    "detail-type": KmsMasterKeyID;
    source:        KmsMasterKeyID;
    account:       KmsMasterKeyID;
    time:          DelaySeconds;
    region:        KmsMasterKeyID;
    resources:     Resources;
    detail:        DetailClass;
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
    eventVersion:       KmsMasterKeyID;
    userIdentity:       DetailClass;
    eventTime:          DelaySeconds;
    eventSource:        KmsMasterKeyID;
    eventName:          KmsMasterKeyID;
    awsRegion:          KmsMasterKeyID;
    sourceIPAddress:    KmsMasterKeyID;
    userAgent:          KmsMasterKeyID;
    requestParameters:  DetailClass;
    responseElements:   DetailClass;
    requestID:          DelaySeconds;
    eventID:            DelaySeconds;
    readOnly:           KmsMasterKeyID;
    eventType:          KmsMasterKeyID;
    managementEvent:    KmsMasterKeyID;
    recipientAccountId: KmsMasterKeyID;
    eventCategory:      KmsMasterKeyID;
}

export interface RequestParameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           RequestParametersProperties;
    required:             string[];
    title:                string;
}

export interface RequestParametersProperties {
    queueName: KmsMasterKeyID;
    attribute: DetailClass;
}

export interface ResponseElements {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResponseElementsProperties;
    required:             string[];
    title:                string;
}

export interface ResponseElementsProperties {
    queueUrl: QueueURL;
}

export interface QueueURL {
    type:               Type;
    format:             string;
    "qt-uri-protocols": string[];
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
    type:        KmsMasterKeyID;
    principalId: KmsMasterKeyID;
    arn:         KmsMasterKeyID;
    accountId:   KmsMasterKeyID;
    userName:    KmsMasterKeyID;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    type:           KmsMasterKeyID;
    principalId:    KmsMasterKeyID;
    arn:            KmsMasterKeyID;
    accountId:      KmsMasterKeyID;
    accessKeyId:    KmsMasterKeyID;
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
    public static toAwsSqs(json: string): AwsSqs {
        return cast(JSON.parse(json), r("AwsSqs"));
    }

    public static awsSqsToJson(value: AwsSqs): string {
        return JSON.stringify(uncast(value, r("AwsSqs")), null, 2);
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
    "AwsSqs": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSq", js: "AwsSq", typ: r("AwsSq") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "RequestParameters", js: "RequestParameters", typ: r("RequestParameters") },
        { json: "Attribute", js: "Attribute", typ: r("Attribute") },
        { json: "ResponseElements", js: "ResponseElements", typ: r("ResponseElements") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
        { json: "SessionContext", js: "SessionContext", typ: r("SessionContext") },
        { json: "Attributes", js: "Attributes", typ: r("Attributes") },
        { json: "SessionIssuer", js: "SessionIssuer", typ: r("SessionIssuer") },
        { json: "WebIDFederationData", js: "WebIDFederationData", typ: r("WebIDFederationData") },
    ], false),
    "Attribute": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AttributeProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AttributeProperties": o([
        { json: "Policy", js: "Policy", typ: r("KmsMasterKeyID") },
        { json: "ReceiveMessageWaitTimeSeconds", js: "ReceiveMessageWaitTimeSeconds", typ: r("DelaySeconds") },
        { json: "SqsManagedSseEnabled", js: "SqsManagedSseEnabled", typ: r("DelaySeconds") },
        { json: "DelaySeconds", js: "DelaySeconds", typ: r("DelaySeconds") },
        { json: "KmsMasterKeyId", js: "KmsMasterKeyId", typ: r("KmsMasterKeyID") },
        { json: "RedrivePolicy", js: "RedrivePolicy", typ: r("KmsMasterKeyID") },
        { json: "MessageRetentionPeriod", js: "MessageRetentionPeriod", typ: r("DelaySeconds") },
        { json: "MaximumMessageSize", js: "MaximumMessageSize", typ: r("DelaySeconds") },
        { json: "VisibilityTimeout", js: "VisibilityTimeout", typ: r("DelaySeconds") },
        { json: "RedriveAllowPolicy", js: "RedriveAllowPolicy", typ: r("KmsMasterKeyID") },
    ], false),
    "DelaySeconds": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "KmsMasterKeyID": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Attributes": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AttributesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AttributesProperties": o([
        { json: "creationDate", js: "creationDate", typ: r("DelaySeconds") },
        { json: "mfaAuthenticated", js: "mfaAuthenticated", typ: r("DelaySeconds") },
    ], false),
    "AwsSq": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSqProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSqProperties": o([
        { json: "version", js: "version", typ: r("DelaySeconds") },
        { json: "id", js: "id", typ: r("DelaySeconds") },
        { json: "detail-type", js: "detail-type", typ: r("KmsMasterKeyID") },
        { json: "source", js: "source", typ: r("KmsMasterKeyID") },
        { json: "account", js: "account", typ: r("KmsMasterKeyID") },
        { json: "time", js: "time", typ: r("DelaySeconds") },
        { json: "region", js: "region", typ: r("KmsMasterKeyID") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
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
        { json: "eventVersion", js: "eventVersion", typ: r("KmsMasterKeyID") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("DelaySeconds") },
        { json: "eventSource", js: "eventSource", typ: r("KmsMasterKeyID") },
        { json: "eventName", js: "eventName", typ: r("KmsMasterKeyID") },
        { json: "awsRegion", js: "awsRegion", typ: r("KmsMasterKeyID") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("KmsMasterKeyID") },
        { json: "userAgent", js: "userAgent", typ: r("KmsMasterKeyID") },
        { json: "requestParameters", js: "requestParameters", typ: r("DetailClass") },
        { json: "responseElements", js: "responseElements", typ: r("DetailClass") },
        { json: "requestID", js: "requestID", typ: r("DelaySeconds") },
        { json: "eventID", js: "eventID", typ: r("DelaySeconds") },
        { json: "readOnly", js: "readOnly", typ: r("KmsMasterKeyID") },
        { json: "eventType", js: "eventType", typ: r("KmsMasterKeyID") },
        { json: "managementEvent", js: "managementEvent", typ: r("KmsMasterKeyID") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("KmsMasterKeyID") },
        { json: "eventCategory", js: "eventCategory", typ: r("KmsMasterKeyID") },
    ], false),
    "RequestParameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RequestParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RequestParametersProperties": o([
        { json: "queueName", js: "queueName", typ: r("KmsMasterKeyID") },
        { json: "attribute", js: "attribute", typ: r("DetailClass") },
    ], false),
    "ResponseElements": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResponseElementsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResponseElementsProperties": o([
        { json: "queueUrl", js: "queueUrl", typ: r("QueueURL") },
    ], false),
    "QueueURL": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
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
        { json: "type", js: "type", typ: r("KmsMasterKeyID") },
        { json: "principalId", js: "principalId", typ: r("KmsMasterKeyID") },
        { json: "arn", js: "arn", typ: r("KmsMasterKeyID") },
        { json: "accountId", js: "accountId", typ: r("KmsMasterKeyID") },
        { json: "userName", js: "userName", typ: r("KmsMasterKeyID") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "type", js: "type", typ: r("KmsMasterKeyID") },
        { json: "principalId", js: "principalId", typ: r("KmsMasterKeyID") },
        { json: "arn", js: "arn", typ: r("KmsMasterKeyID") },
        { json: "accountId", js: "accountId", typ: r("KmsMasterKeyID") },
        { json: "accessKeyId", js: "accessKeyId", typ: r("KmsMasterKeyID") },
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
