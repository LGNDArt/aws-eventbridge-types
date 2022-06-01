// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsS3 = Convert.toAwsS3(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsS3 {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        Source;
    account:       Account;
    time:          Date;
    region:        Region;
    resources:     ResourceEnum[];
    detail:        Detail;
}

export enum Account {
    S3AmazonawsCOM = "s3.amazonaws.com",
    The123456789012 = "123456789012",
}

export interface Detail {
    eventVersion?:                string;
    userIdentity?:                UserIdentity;
    eventTime?:                   Date;
    eventSource?:                 Account;
    eventName?:                   string;
    awsRegion?:                   Region;
    sourceIPAddress?:             string;
    userAgent?:                   string;
    requestParameters?:           RequestParameters;
    responseElements?:            null;
    additionalEventData?:         AdditionalEventData;
    requestID?:                   string;
    eventID?:                     string;
    readOnly?:                    boolean;
    resources?:                   ResourceClass[];
    eventType?:                   string;
    recipientAccountId?:          Account;
    vpcEndpointId?:               string;
    errorCode?:                   string;
    errorMessage?:                string;
    version?:                     string;
    bucket?:                      Bucket;
    object?:                      Object;
    "request-id"?:                string;
    requester?:                   Account;
    "destination-access-tier"?:   string;
    "source-ip-address"?:         string;
    reason?:                      string;
    "deletion-type"?:             string;
    "restore-expiry-time"?:       Date;
    "source-storage-class"?:      string;
    "destination-storage-class"?: string;
}

export interface AdditionalEventData {
    objectRetentionInfo?: ObjectRetentionInfo;
    "x-amz-id-2":         string;
}

export interface ObjectRetentionInfo {
    legalHoldInfo?: LegalHoldInfo;
    retentionInfo?: RetentionInfo;
}

export interface LegalHoldInfo {
    isUnderLegalHold: boolean;
    lastModifiedTime: number;
}

export interface RetentionInfo {
    retainUntilMode:  string;
    retainUntilTime:  number;
    lastModifiedTime: number;
}

export enum Region {
    CACentral1 = "ca-central-1",
    UsEast1 = "us-east-1",
}

export interface Bucket {
    name: Name;
}

export enum Name {
    ExampleBucket = "example-bucket",
}

export interface Object {
    key:          Key;
    size?:        number;
    etag:         Etag;
    "version-id": string;
    sequencer?:   string;
}

export enum Etag {
    B1946Ac92492D2347C6235B4D2611184 = "b1946ac92492d2347c6235b4d2611184",
    D41D8Cd98F00B204E9800998Ecf8427E = "d41d8cd98f00b204e9800998ecf8427e",
}

export enum Key {
    ExampleKey = "example-key",
}

export interface RequestParameters {
    "legal-hold"?: string;
    bucketName:    string;
    key:           string;
    retention?:    string;
}

export interface ResourceClass {
    type:       string;
    ARN:        string;
    accountId?: Account;
}

export interface UserIdentity {
    type:           string;
    principalId:    Account;
    arn:            string;
    accountId:      Account;
    accessKeyId:    string;
    sessionContext: SessionContext;
}

export interface SessionContext {
    attributes: Attributes;
}

export interface Attributes {
    creationDate:     Date;
    mfaAuthenticated: string;
}

export enum ResourceEnum {
    ArnAwsS3ExampleBucket = "arn:aws:s3:::example-bucket",
}

export enum Source {
    AwsS3 = "aws.s3",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsS3(json: string): AwsS3[] {
        return cast(JSON.parse(json), a(r("AwsS3")));
    }

    public static awsS3ToJson(value: AwsS3[]): string {
        return JSON.stringify(uncast(value, a(r("AwsS3"))), null, 2);
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
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: r("Source") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: r("Region") },
        { json: "resources", js: "resources", typ: a(r("ResourceEnum")) },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "eventVersion", js: "eventVersion", typ: u(undefined, "") },
        { json: "userIdentity", js: "userIdentity", typ: u(undefined, r("UserIdentity")) },
        { json: "eventTime", js: "eventTime", typ: u(undefined, Date) },
        { json: "eventSource", js: "eventSource", typ: u(undefined, r("Account")) },
        { json: "eventName", js: "eventName", typ: u(undefined, "") },
        { json: "awsRegion", js: "awsRegion", typ: u(undefined, r("Region")) },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: u(undefined, "") },
        { json: "userAgent", js: "userAgent", typ: u(undefined, "") },
        { json: "requestParameters", js: "requestParameters", typ: u(undefined, r("RequestParameters")) },
        { json: "responseElements", js: "responseElements", typ: u(undefined, null) },
        { json: "additionalEventData", js: "additionalEventData", typ: u(undefined, r("AdditionalEventData")) },
        { json: "requestID", js: "requestID", typ: u(undefined, "") },
        { json: "eventID", js: "eventID", typ: u(undefined, "") },
        { json: "readOnly", js: "readOnly", typ: u(undefined, true) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("ResourceClass"))) },
        { json: "eventType", js: "eventType", typ: u(undefined, "") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: u(undefined, r("Account")) },
        { json: "vpcEndpointId", js: "vpcEndpointId", typ: u(undefined, "") },
        { json: "errorCode", js: "errorCode", typ: u(undefined, "") },
        { json: "errorMessage", js: "errorMessage", typ: u(undefined, "") },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "bucket", js: "bucket", typ: u(undefined, r("Bucket")) },
        { json: "object", js: "object", typ: u(undefined, r("Object")) },
        { json: "request-id", js: "request-id", typ: u(undefined, "") },
        { json: "requester", js: "requester", typ: u(undefined, r("Account")) },
        { json: "destination-access-tier", js: "destination-access-tier", typ: u(undefined, "") },
        { json: "source-ip-address", js: "source-ip-address", typ: u(undefined, "") },
        { json: "reason", js: "reason", typ: u(undefined, "") },
        { json: "deletion-type", js: "deletion-type", typ: u(undefined, "") },
        { json: "restore-expiry-time", js: "restore-expiry-time", typ: u(undefined, Date) },
        { json: "source-storage-class", js: "source-storage-class", typ: u(undefined, "") },
        { json: "destination-storage-class", js: "destination-storage-class", typ: u(undefined, "") },
    ], false),
    "AdditionalEventData": o([
        { json: "objectRetentionInfo", js: "objectRetentionInfo", typ: u(undefined, r("ObjectRetentionInfo")) },
        { json: "x-amz-id-2", js: "x-amz-id-2", typ: "" },
    ], false),
    "ObjectRetentionInfo": o([
        { json: "legalHoldInfo", js: "legalHoldInfo", typ: u(undefined, r("LegalHoldInfo")) },
        { json: "retentionInfo", js: "retentionInfo", typ: u(undefined, r("RetentionInfo")) },
    ], false),
    "LegalHoldInfo": o([
        { json: "isUnderLegalHold", js: "isUnderLegalHold", typ: true },
        { json: "lastModifiedTime", js: "lastModifiedTime", typ: 0 },
    ], false),
    "RetentionInfo": o([
        { json: "retainUntilMode", js: "retainUntilMode", typ: "" },
        { json: "retainUntilTime", js: "retainUntilTime", typ: 0 },
        { json: "lastModifiedTime", js: "lastModifiedTime", typ: 0 },
    ], false),
    "Bucket": o([
        { json: "name", js: "name", typ: r("Name") },
    ], false),
    "Object": o([
        { json: "key", js: "key", typ: r("Key") },
        { json: "size", js: "size", typ: u(undefined, 0) },
        { json: "etag", js: "etag", typ: r("Etag") },
        { json: "version-id", js: "version-id", typ: "" },
        { json: "sequencer", js: "sequencer", typ: u(undefined, "") },
    ], false),
    "RequestParameters": o([
        { json: "legal-hold", js: "legal-hold", typ: u(undefined, "") },
        { json: "bucketName", js: "bucketName", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "retention", js: "retention", typ: u(undefined, "") },
    ], false),
    "ResourceClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "ARN", js: "ARN", typ: "" },
        { json: "accountId", js: "accountId", typ: u(undefined, r("Account")) },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "principalId", js: "principalId", typ: r("Account") },
        { json: "arn", js: "arn", typ: "" },
        { json: "accountId", js: "accountId", typ: r("Account") },
        { json: "accessKeyId", js: "accessKeyId", typ: "" },
        { json: "sessionContext", js: "sessionContext", typ: r("SessionContext") },
    ], false),
    "SessionContext": o([
        { json: "attributes", js: "attributes", typ: r("Attributes") },
    ], false),
    "Attributes": o([
        { json: "creationDate", js: "creationDate", typ: Date },
        { json: "mfaAuthenticated", js: "mfaAuthenticated", typ: "" },
    ], false),
    "Account": [
        "s3.amazonaws.com",
        "123456789012",
    ],
    "Region": [
        "ca-central-1",
        "us-east-1",
    ],
    "Name": [
        "example-bucket",
    ],
    "Etag": [
        "b1946ac92492d2347c6235b4d2611184",
        "d41d8cd98f00b204e9800998ecf8427e",
    ],
    "Key": [
        "example-key",
    ],
    "ResourceEnum": [
        "arn:aws:s3:::example-bucket",
    ],
    "Source": [
        "aws.s3",
    ],
};
