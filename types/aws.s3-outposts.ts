// To parse this data:
//
//   import { Convert, AwsS3Outposts } from "./file";
//
//   const awsS3Outposts = Convert.toAwsS3Outposts(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsS3Outposts {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsS3Outpost:        AwsS3Outpost;
    Detail:              Detail;
    AdditionalEventData: AdditionalEventData;
    EdgeDeviceDetails:   EdgeDeviceDetails;
    RequestParameters:   RequestParameters;
    Resource:            Resource;
    UserIdentity:        UserIdentity;
    SessionContext:      SessionContext;
    Attributes:          Attributes;
}

export interface AdditionalEventData {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdditionalEventDataProperties;
    required:             string[];
    title:                string;
}

export interface AdditionalEventDataProperties {
    CipherSuite:          AuthenticationMethod;
    bytesTransferredIn:   AuthenticationMethod;
    "x-amz-id-2":         AuthenticationMethod;
    SignatureVersion:     AuthenticationMethod;
    bytesTransferredOut:  AuthenticationMethod;
    AuthenticationMethod: AuthenticationMethod;
}

export interface AuthenticationMethod {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    Null = "null",
    String = "string",
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

export interface AwsS3Outpost {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsS3OutpostProperties;
    required:             string[];
    title:                string;
}

export interface AwsS3OutpostProperties {
    version:       CreationDate;
    id:            CreationDate;
    "detail-type": AuthenticationMethod;
    source:        AuthenticationMethod;
    account:       AuthenticationMethod;
    time:          CreationDate;
    region:        AuthenticationMethod;
    resources:     PurpleResources;
    detail:        DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface PurpleResources {
    type:  string;
    items: PurpleItems;
}

export interface PurpleItems {
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:        AuthenticationMethod;
    userIdentity:        DetailClass;
    eventTime:           CreationDate;
    eventSource:         AuthenticationMethod;
    eventName:           AuthenticationMethod;
    awsRegion:           AuthenticationMethod;
    sourceIPAddress:     AuthenticationMethod;
    userAgent:           AuthenticationMethod;
    requestParameters:   DetailClass;
    responseElements:    AuthenticationMethod;
    additionalEventData: DetailClass;
    requestID:           AuthenticationMethod;
    eventID:             CreationDate;
    readOnly:            AuthenticationMethod;
    resources:           FluffyResources;
    eventType:           AuthenticationMethod;
    managementEvent:     AuthenticationMethod;
    recipientAccountId:  AuthenticationMethod;
    edgeDeviceDetails:   DetailClass;
    eventCategory:       AuthenticationMethod;
}

export interface FluffyResources {
    type:  string;
    items: DetailClass;
}

export interface EdgeDeviceDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           EdgeDeviceDetailsProperties;
    required:             string[];
    title:                string;
}

export interface EdgeDeviceDetailsProperties {
    type:     AuthenticationMethod;
    deviceID: AuthenticationMethod;
}

export interface RequestParameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           RequestParametersProperties;
    required:             string[];
    title:                string;
}

export interface RequestParametersProperties {
    bucketName: AuthenticationMethod;
    Key:        AuthenticationMethod;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    accountId: AuthenticationMethod;
    type:      AuthenticationMethod;
    ARN:       AuthenticationMethod;
}

export interface SessionContext {
    type:                 string;
    additionalProperties: boolean;
    properties:           SessionContextProperties;
    required:             string[];
    title:                string;
}

export interface SessionContextProperties {
    sessionIssuer: DetailClass;
    attributes:    DetailClass;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    type:           AuthenticationMethod;
    principalId:    AuthenticationMethod;
    arn:            AuthenticationMethod;
    accountId:      AuthenticationMethod;
    sessionContext: DetailClass;
    userName:       AuthenticationMethod;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsS3Outposts(json: string): AwsS3Outposts {
        return cast(JSON.parse(json), r("AwsS3Outposts"));
    }

    public static awsS3OutpostsToJson(value: AwsS3Outposts): string {
        return JSON.stringify(uncast(value, r("AwsS3Outposts")), null, 2);
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
    "AwsS3Outposts": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsS3Outpost", js: "AwsS3Outpost", typ: r("AwsS3Outpost") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "AdditionalEventData", js: "AdditionalEventData", typ: r("AdditionalEventData") },
        { json: "EdgeDeviceDetails", js: "EdgeDeviceDetails", typ: r("EdgeDeviceDetails") },
        { json: "RequestParameters", js: "RequestParameters", typ: r("RequestParameters") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
        { json: "SessionContext", js: "SessionContext", typ: r("SessionContext") },
        { json: "Attributes", js: "Attributes", typ: r("Attributes") },
    ], false),
    "AdditionalEventData": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdditionalEventDataProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalEventDataProperties": o([
        { json: "CipherSuite", js: "CipherSuite", typ: r("AuthenticationMethod") },
        { json: "bytesTransferredIn", js: "bytesTransferredIn", typ: r("AuthenticationMethod") },
        { json: "x-amz-id-2", js: "x-amz-id-2", typ: r("AuthenticationMethod") },
        { json: "SignatureVersion", js: "SignatureVersion", typ: r("AuthenticationMethod") },
        { json: "bytesTransferredOut", js: "bytesTransferredOut", typ: r("AuthenticationMethod") },
        { json: "AuthenticationMethod", js: "AuthenticationMethod", typ: r("AuthenticationMethod") },
    ], false),
    "AuthenticationMethod": o([
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
        { json: "creationDate", js: "creationDate", typ: r("CreationDate") },
        { json: "mfaAuthenticated", js: "mfaAuthenticated", typ: r("CreationDate") },
    ], false),
    "CreationDate": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "AwsS3Outpost": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsS3OutpostProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsS3OutpostProperties": o([
        { json: "version", js: "version", typ: r("CreationDate") },
        { json: "id", js: "id", typ: r("CreationDate") },
        { json: "detail-type", js: "detail-type", typ: r("AuthenticationMethod") },
        { json: "source", js: "source", typ: r("AuthenticationMethod") },
        { json: "account", js: "account", typ: r("AuthenticationMethod") },
        { json: "time", js: "time", typ: r("CreationDate") },
        { json: "region", js: "region", typ: r("AuthenticationMethod") },
        { json: "resources", js: "resources", typ: r("PurpleResources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "PurpleResources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("PurpleItems") },
    ], false),
    "PurpleItems": o([
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventVersion", js: "eventVersion", typ: r("AuthenticationMethod") },
        { json: "userIdentity", js: "userIdentity", typ: r("DetailClass") },
        { json: "eventTime", js: "eventTime", typ: r("CreationDate") },
        { json: "eventSource", js: "eventSource", typ: r("AuthenticationMethod") },
        { json: "eventName", js: "eventName", typ: r("AuthenticationMethod") },
        { json: "awsRegion", js: "awsRegion", typ: r("AuthenticationMethod") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("AuthenticationMethod") },
        { json: "userAgent", js: "userAgent", typ: r("AuthenticationMethod") },
        { json: "requestParameters", js: "requestParameters", typ: r("DetailClass") },
        { json: "responseElements", js: "responseElements", typ: r("AuthenticationMethod") },
        { json: "additionalEventData", js: "additionalEventData", typ: r("DetailClass") },
        { json: "requestID", js: "requestID", typ: r("AuthenticationMethod") },
        { json: "eventID", js: "eventID", typ: r("CreationDate") },
        { json: "readOnly", js: "readOnly", typ: r("AuthenticationMethod") },
        { json: "resources", js: "resources", typ: r("FluffyResources") },
        { json: "eventType", js: "eventType", typ: r("AuthenticationMethod") },
        { json: "managementEvent", js: "managementEvent", typ: r("AuthenticationMethod") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("AuthenticationMethod") },
        { json: "edgeDeviceDetails", js: "edgeDeviceDetails", typ: r("DetailClass") },
        { json: "eventCategory", js: "eventCategory", typ: r("AuthenticationMethod") },
    ], false),
    "FluffyResources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "EdgeDeviceDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EdgeDeviceDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EdgeDeviceDetailsProperties": o([
        { json: "type", js: "type", typ: r("AuthenticationMethod") },
        { json: "deviceID", js: "deviceID", typ: r("AuthenticationMethod") },
    ], false),
    "RequestParameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RequestParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RequestParametersProperties": o([
        { json: "bucketName", js: "bucketName", typ: r("AuthenticationMethod") },
        { json: "Key", js: "Key", typ: r("AuthenticationMethod") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "accountId", js: "accountId", typ: r("AuthenticationMethod") },
        { json: "type", js: "type", typ: r("AuthenticationMethod") },
        { json: "ARN", js: "ARN", typ: r("AuthenticationMethod") },
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
        { json: "attributes", js: "attributes", typ: r("DetailClass") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "type", js: "type", typ: r("AuthenticationMethod") },
        { json: "principalId", js: "principalId", typ: r("AuthenticationMethod") },
        { json: "arn", js: "arn", typ: r("AuthenticationMethod") },
        { json: "accountId", js: "accountId", typ: r("AuthenticationMethod") },
        { json: "sessionContext", js: "sessionContext", typ: r("DetailClass") },
        { json: "userName", js: "userName", typ: r("AuthenticationMethod") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "null",
        "string",
    ],
};
