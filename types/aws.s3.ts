// To parse this data:
//
//   import { Convert, AwsS3 } from "./file";
//
//   const awsS3 = Convert.toAwsS3(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsS3 {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsS3Element:        AwsS3Element;
    Detail:              Detail;
    AdditionalEventData: AdditionalEventData;
    ObjectRetentionInfo: ObjectRetentionInfo;
    LegalHoldInfo:       LegalHoldInfo;
    RetentionInfo:       RetentionInfo;
    Bucket:              Bucket;
    Object:              Object;
    RequestParameters:   RequestParameters;
    ResourceClass:       ResourceClass;
    UserIdentity:        UserIdentity;
    SessionContext:      SessionContext;
    Attributes:          Attributes;
    Account:             Account;
    Region:              Account;
    Name:                Account;
    Etag:                Account;
    Key:                 Account;
    ResourceEnum:        Account;
    Source:              Account;
}

export interface Account {
    type:  Type;
    enum:  string[];
    title: string;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    Null = "null",
    String = "string",
}

export interface AdditionalEventData {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdditionalEventDataProperties;
    required:             string[];
    title:                string;
}

export interface AdditionalEventDataProperties {
    objectRetentionInfo: Items;
    "x-amz-id-2":        XAmzID2;
}

export interface Items {
    $ref: string;
}

export interface XAmzID2 {
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
    creationDate:     CreationDate;
    mfaAuthenticated: CreationDate;
}

export interface CreationDate {
    type:   Type;
    format: string;
}

export interface AwsS3Element {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsS3ElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsS3ElementProperties {
    version:       CreationDate;
    id:            CreationDate;
    "detail-type": XAmzID2;
    source:        Items;
    account:       Items;
    time:          CreationDate;
    region:        Items;
    resources:     Resources;
    detail:        Items;
}

export interface Resources {
    type:  string;
    items: Items;
}

export interface Bucket {
    type:                 string;
    additionalProperties: boolean;
    properties:           BucketProperties;
    required:             string[];
    title:                string;
}

export interface BucketProperties {
    name: Items;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    eventVersion:                XAmzID2;
    userIdentity:                Items;
    eventTime:                   CreationDate;
    eventSource:                 Items;
    eventName:                   XAmzID2;
    awsRegion:                   Items;
    sourceIPAddress:             XAmzID2;
    userAgent:                   XAmzID2;
    requestParameters:           Items;
    responseElements:            XAmzID2;
    additionalEventData:         Items;
    requestID:                   XAmzID2;
    eventID:                     CreationDate;
    readOnly:                    XAmzID2;
    resources:                   Resources;
    eventType:                   XAmzID2;
    recipientAccountId:          Items;
    vpcEndpointId:               XAmzID2;
    errorCode:                   XAmzID2;
    errorMessage:                XAmzID2;
    version:                     CreationDate;
    bucket:                      Items;
    object:                      Items;
    "request-id":                XAmzID2;
    requester:                   Items;
    "destination-access-tier":   XAmzID2;
    "source-ip-address":         XAmzID2;
    reason:                      XAmzID2;
    "deletion-type":             XAmzID2;
    "restore-expiry-time":       CreationDate;
    "source-storage-class":      XAmzID2;
    "destination-storage-class": XAmzID2;
}

export interface LegalHoldInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           LegalHoldInfoProperties;
    required:             string[];
    title:                string;
}

export interface LegalHoldInfoProperties {
    isUnderLegalHold: XAmzID2;
    lastModifiedTime: XAmzID2;
}

export interface Object {
    type:                 string;
    additionalProperties: boolean;
    properties:           ObjectProperties;
    required:             string[];
    title:                string;
}

export interface ObjectProperties {
    key:          Items;
    size:         XAmzID2;
    etag:         Items;
    "version-id": XAmzID2;
    sequencer:    XAmzID2;
}

export interface ObjectRetentionInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           ObjectRetentionInfoProperties;
    required:             any[];
    title:                string;
}

export interface ObjectRetentionInfoProperties {
    legalHoldInfo: Items;
    retentionInfo: Items;
}

export interface RequestParameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           RequestParametersProperties;
    required:             string[];
    title:                string;
}

export interface RequestParametersProperties {
    "legal-hold": XAmzID2;
    bucketName:   XAmzID2;
    key:          XAmzID2;
    retention:    XAmzID2;
}

export interface ResourceClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceClassProperties;
    required:             string[];
    title:                string;
}

export interface ResourceClassProperties {
    type:      XAmzID2;
    ARN:       XAmzID2;
    accountId: Items;
}

export interface RetentionInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           RetentionInfoProperties;
    required:             string[];
    title:                string;
}

export interface RetentionInfoProperties {
    retainUntilMode:  XAmzID2;
    retainUntilTime:  XAmzID2;
    lastModifiedTime: XAmzID2;
}

export interface SessionContext {
    type:                 string;
    additionalProperties: boolean;
    properties:           SessionContextProperties;
    required:             string[];
    title:                string;
}

export interface SessionContextProperties {
    attributes: Items;
}

export interface UserIdentity {
    type:                 string;
    additionalProperties: boolean;
    properties:           UserIdentityProperties;
    required:             string[];
    title:                string;
}

export interface UserIdentityProperties {
    type:           XAmzID2;
    principalId:    Items;
    arn:            XAmzID2;
    accountId:      Items;
    accessKeyId:    XAmzID2;
    sessionContext: Items;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsS3(json: string): AwsS3 {
        return cast(JSON.parse(json), r("AwsS3"));
    }

    public static awsS3ToJson(value: AwsS3): string {
        return JSON.stringify(uncast(value, r("AwsS3")), null, 2);
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
    "AwsS3": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsS3Element", js: "AwsS3Element", typ: r("AwsS3Element") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "AdditionalEventData", js: "AdditionalEventData", typ: r("AdditionalEventData") },
        { json: "ObjectRetentionInfo", js: "ObjectRetentionInfo", typ: r("ObjectRetentionInfo") },
        { json: "LegalHoldInfo", js: "LegalHoldInfo", typ: r("LegalHoldInfo") },
        { json: "RetentionInfo", js: "RetentionInfo", typ: r("RetentionInfo") },
        { json: "Bucket", js: "Bucket", typ: r("Bucket") },
        { json: "Object", js: "Object", typ: r("Object") },
        { json: "RequestParameters", js: "RequestParameters", typ: r("RequestParameters") },
        { json: "ResourceClass", js: "ResourceClass", typ: r("ResourceClass") },
        { json: "UserIdentity", js: "UserIdentity", typ: r("UserIdentity") },
        { json: "SessionContext", js: "SessionContext", typ: r("SessionContext") },
        { json: "Attributes", js: "Attributes", typ: r("Attributes") },
        { json: "Account", js: "Account", typ: r("Account") },
        { json: "Region", js: "Region", typ: r("Account") },
        { json: "Name", js: "Name", typ: r("Account") },
        { json: "Etag", js: "Etag", typ: r("Account") },
        { json: "Key", js: "Key", typ: r("Account") },
        { json: "ResourceEnum", js: "ResourceEnum", typ: r("Account") },
        { json: "Source", js: "Source", typ: r("Account") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalEventData": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdditionalEventDataProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalEventDataProperties": o([
        { json: "objectRetentionInfo", js: "objectRetentionInfo", typ: r("Items") },
        { json: "x-amz-id-2", js: "x-amz-id-2", typ: r("XAmzID2") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "XAmzID2": o([
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
    "AwsS3Element": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsS3ElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsS3ElementProperties": o([
        { json: "version", js: "version", typ: r("CreationDate") },
        { json: "id", js: "id", typ: r("CreationDate") },
        { json: "detail-type", js: "detail-type", typ: r("XAmzID2") },
        { json: "source", js: "source", typ: r("Items") },
        { json: "account", js: "account", typ: r("Items") },
        { json: "time", js: "time", typ: r("CreationDate") },
        { json: "region", js: "region", typ: r("Items") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "Bucket": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("BucketProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "BucketProperties": o([
        { json: "name", js: "name", typ: r("Items") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventVersion", js: "eventVersion", typ: r("XAmzID2") },
        { json: "userIdentity", js: "userIdentity", typ: r("Items") },
        { json: "eventTime", js: "eventTime", typ: r("CreationDate") },
        { json: "eventSource", js: "eventSource", typ: r("Items") },
        { json: "eventName", js: "eventName", typ: r("XAmzID2") },
        { json: "awsRegion", js: "awsRegion", typ: r("Items") },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: r("XAmzID2") },
        { json: "userAgent", js: "userAgent", typ: r("XAmzID2") },
        { json: "requestParameters", js: "requestParameters", typ: r("Items") },
        { json: "responseElements", js: "responseElements", typ: r("XAmzID2") },
        { json: "additionalEventData", js: "additionalEventData", typ: r("Items") },
        { json: "requestID", js: "requestID", typ: r("XAmzID2") },
        { json: "eventID", js: "eventID", typ: r("CreationDate") },
        { json: "readOnly", js: "readOnly", typ: r("XAmzID2") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "eventType", js: "eventType", typ: r("XAmzID2") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("Items") },
        { json: "vpcEndpointId", js: "vpcEndpointId", typ: r("XAmzID2") },
        { json: "errorCode", js: "errorCode", typ: r("XAmzID2") },
        { json: "errorMessage", js: "errorMessage", typ: r("XAmzID2") },
        { json: "version", js: "version", typ: r("CreationDate") },
        { json: "bucket", js: "bucket", typ: r("Items") },
        { json: "object", js: "object", typ: r("Items") },
        { json: "request-id", js: "request-id", typ: r("XAmzID2") },
        { json: "requester", js: "requester", typ: r("Items") },
        { json: "destination-access-tier", js: "destination-access-tier", typ: r("XAmzID2") },
        { json: "source-ip-address", js: "source-ip-address", typ: r("XAmzID2") },
        { json: "reason", js: "reason", typ: r("XAmzID2") },
        { json: "deletion-type", js: "deletion-type", typ: r("XAmzID2") },
        { json: "restore-expiry-time", js: "restore-expiry-time", typ: r("CreationDate") },
        { json: "source-storage-class", js: "source-storage-class", typ: r("XAmzID2") },
        { json: "destination-storage-class", js: "destination-storage-class", typ: r("XAmzID2") },
    ], false),
    "LegalHoldInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("LegalHoldInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "LegalHoldInfoProperties": o([
        { json: "isUnderLegalHold", js: "isUnderLegalHold", typ: r("XAmzID2") },
        { json: "lastModifiedTime", js: "lastModifiedTime", typ: r("XAmzID2") },
    ], false),
    "Object": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ObjectProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ObjectProperties": o([
        { json: "key", js: "key", typ: r("Items") },
        { json: "size", js: "size", typ: r("XAmzID2") },
        { json: "etag", js: "etag", typ: r("Items") },
        { json: "version-id", js: "version-id", typ: r("XAmzID2") },
        { json: "sequencer", js: "sequencer", typ: r("XAmzID2") },
    ], false),
    "ObjectRetentionInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ObjectRetentionInfoProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ObjectRetentionInfoProperties": o([
        { json: "legalHoldInfo", js: "legalHoldInfo", typ: r("Items") },
        { json: "retentionInfo", js: "retentionInfo", typ: r("Items") },
    ], false),
    "RequestParameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RequestParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RequestParametersProperties": o([
        { json: "legal-hold", js: "legal-hold", typ: r("XAmzID2") },
        { json: "bucketName", js: "bucketName", typ: r("XAmzID2") },
        { json: "key", js: "key", typ: r("XAmzID2") },
        { json: "retention", js: "retention", typ: r("XAmzID2") },
    ], false),
    "ResourceClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceClassProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceClassProperties": o([
        { json: "type", js: "type", typ: r("XAmzID2") },
        { json: "ARN", js: "ARN", typ: r("XAmzID2") },
        { json: "accountId", js: "accountId", typ: r("Items") },
    ], false),
    "RetentionInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RetentionInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RetentionInfoProperties": o([
        { json: "retainUntilMode", js: "retainUntilMode", typ: r("XAmzID2") },
        { json: "retainUntilTime", js: "retainUntilTime", typ: r("XAmzID2") },
        { json: "lastModifiedTime", js: "lastModifiedTime", typ: r("XAmzID2") },
    ], false),
    "SessionContext": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SessionContextProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SessionContextProperties": o([
        { json: "attributes", js: "attributes", typ: r("Items") },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("UserIdentityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "UserIdentityProperties": o([
        { json: "type", js: "type", typ: r("XAmzID2") },
        { json: "principalId", js: "principalId", typ: r("Items") },
        { json: "arn", js: "arn", typ: r("XAmzID2") },
        { json: "accountId", js: "accountId", typ: r("Items") },
        { json: "accessKeyId", js: "accessKeyId", typ: r("XAmzID2") },
        { json: "sessionContext", js: "sessionContext", typ: r("Items") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "null",
        "string",
    ],
};
