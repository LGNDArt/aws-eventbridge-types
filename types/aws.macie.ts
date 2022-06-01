// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsMacie = Convert.toAwsMacie(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsMacie {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    "notification-type"?:   string;
    name?:                  string;
    tags?:                  string[];
    url?:                   string;
    "alert-arn"?:           string;
    "risk-score"?:          number;
    trigger?:               Trigger;
    "created-at"?:          Date;
    actor?:                 string;
    summary?:               Summary;
    schemaVersion?:         string;
    id?:                    string;
    accountId?:             string;
    partition?:             string;
    region?:                string;
    type?:                  string;
    title?:                 string;
    description?:           string;
    severity?:              Severity;
    createdAt?:             Date;
    updatedAt?:             Date;
    count?:                 number;
    resourcesAffected?:     ResourcesAffected;
    category?:              string;
    classificationDetails?: ClassificationDetails;
    policyDetails?:         null;
    sample?:                boolean;
    archived?:              boolean;
    internalInfo?:          null;
}

export interface ClassificationDetails {
    jobArn:                  string;
    jobId:                   string;
    result:                  Result;
    detailedResultsLocation: string;
}

export interface Result {
    status:                Status;
    sizeClassified:        number;
    mimeType:              string;
    sensitiveData:         SensitiveDatum[];
    customDataIdentifiers: CustomDataIdentifiers;
}

export interface CustomDataIdentifiers {
    totalCount: number;
    detections: CustomDataIdentifiersDetection[];
}

export interface CustomDataIdentifiersDetection {
    arn:   string;
    name:  string;
    count: number;
}

export interface SensitiveDatum {
    category:   string;
    totalCount: number;
    detections: SensitiveDatumDetection[];
}

export interface SensitiveDatumDetection {
    type:  string;
    count: number;
}

export interface Status {
    code:   string;
    reason: string;
}

export interface ResourcesAffected {
    s3Bucket: S3Bucket;
    s3Object: S3Object;
}

export interface S3Bucket {
    arn:                         string;
    name:                        string;
    createdAt:                   Date;
    owner:                       Owner;
    tags:                        Tag[];
    defaultServerSideEncryption: ServerSideEncryption;
    publicAccess:                PublicAccess;
}

export interface ServerSideEncryption {
    encryptionType: string;
    kmsMasterKeyId: string;
}

export interface Owner {
    displayName: string;
    id:          string;
}

export interface PublicAccess {
    permissionConfiguration: PermissionConfiguration;
    effectivePermission:     string;
}

export interface PermissionConfiguration {
    bucketLevelPermissions:  BucketLevelPermissions;
    accountLevelPermissions: AccountLevelPermissions;
}

export interface AccountLevelPermissions {
    blockPublicAccess: BlockPublicAccess;
}

export interface BlockPublicAccess {
    ignorePublicAcls:      boolean;
    restrictPublicBuckets: boolean;
    blockPublicAcls:       boolean;
    blockPublicPolicy:     boolean;
}

export interface BucketLevelPermissions {
    accessControlList: AccessControlList;
    bucketPolicy:      AccessControlList;
    blockPublicAccess: BlockPublicAccess;
}

export interface AccessControlList {
    allowsPublicReadAccess:  boolean;
    allowsPublicWriteAccess: boolean;
}

export interface Tag {
    key:   string;
    value: string;
}

export interface S3Object {
    bucketArn:            string;
    key:                  string;
    path:                 string;
    extension:            string;
    lastModified:         Date;
    versionId:            string;
    serverSideEncryption: ServerSideEncryption;
    size:                 number;
    storageClass:         string;
    tags:                 Tag[];
    publicAccess:         boolean;
    etag:                 string;
}

export interface Severity {
    score:       number;
    description: string;
}

export interface Summary {
    Description:         string;
    IP?:                 { [key: string]: number };
    "Time Range"?:       TimeRange[];
    "Source ARN"?:       string;
    "Record Count":      number;
    Location?:           Location;
    "Event Count":       number;
    Events?:             Events;
    recipientAccountId?: RecipientAccountID;
    Bucket?:             Bucket;
    ACL?:                ACL;
    Timestamps?:         { [key: string]: number };
    Object?:             Object;
    Themes?:             Themes;
    "DLP risk"?:         DLPRisk;
    Owner?:              SummaryOwner;
}

export interface ACL {
    "secret-bucket-name": SecretBucketName[];
}

export interface SecretBucketName {
    Owner:  SecretBucketNameOwner;
    Grants: Grant[];
}

export interface Grant {
    Grantee:    Grantee;
    Permission: string;
}

export interface Grantee {
    Type: string;
    URI:  string;
}

export interface SecretBucketNameOwner {
    DisplayName: string;
    ID:          string;
}

export interface Bucket {
    "secret-bucket-name": number;
}

export interface DLPRisk {
    "7": number;
}

export interface Events {
    GetBucketLocation: GetBucketACL;
    ListRoles:         GetBucketACL;
    GetBucketPolicy:   GetBucketPolicy;
    GetBucketAcl:      GetBucketACL;
    ListBuckets:       GetBucketACL;
}

export interface GetBucketACL {
    count: number;
    ISP:   ISP;
}

export interface ISP {
    Amazon: number;
}

export interface GetBucketPolicy {
    count:        number;
    ISP:          ISP;
    "Error Code": ErrorCode;
}

export interface ErrorCode {
    NoSuchBucketPolicy: number;
}

export interface Location {
    "us-east-1": number;
}

export interface Object {
    "public_bucket/secret_key.txt":        number;
    "public_bucket/financial_summary.txt": number;
}

export interface SummaryOwner {
    bucket_owner: number;
}

export interface Themes {
    "Secret Markings":       number;
    "Corporate Proposals":   number;
    "Confidential Markings": number;
}

export interface TimeRange {
    count: number;
    start: Date;
    end:   Date;
}

export interface RecipientAccountID {
    "123456789012": number;
}

export interface Trigger {
    "rule-arn"?:   string;
    "alert-type":  string;
    "created-at"?: Date;
    description?:  string;
    risk?:         number;
    features?:     Features;
}

export interface Features {
    distinctEventName:           DistinctEventName;
    ListInstanceProfilesForRole: List;
    ListRolePolicies:            List;
}

export interface List {
    name:            string;
    description:     string;
    narrative:       string;
    anomalous:       boolean;
    multiplier:      number;
    excession_times: Date[];
    risk:            number;
}

export interface DistinctEventName {
    name:        string;
    description: string;
    narrative:   string;
    risk:        number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsMacie(json: string): AwsMacie[] {
        return cast(JSON.parse(json), a(r("AwsMacie")));
    }

    public static awsMacieToJson(value: AwsMacie[]): string {
        return JSON.stringify(uncast(value, a(r("AwsMacie"))), null, 2);
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
    "AwsMacie": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "notification-type", js: "notification-type", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "tags", js: "tags", typ: u(undefined, a("")) },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "alert-arn", js: "alert-arn", typ: u(undefined, "") },
        { json: "risk-score", js: "risk-score", typ: u(undefined, 0) },
        { json: "trigger", js: "trigger", typ: u(undefined, r("Trigger")) },
        { json: "created-at", js: "created-at", typ: u(undefined, Date) },
        { json: "actor", js: "actor", typ: u(undefined, "") },
        { json: "summary", js: "summary", typ: u(undefined, r("Summary")) },
        { json: "schemaVersion", js: "schemaVersion", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "accountId", js: "accountId", typ: u(undefined, "") },
        { json: "partition", js: "partition", typ: u(undefined, "") },
        { json: "region", js: "region", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "severity", js: "severity", typ: u(undefined, r("Severity")) },
        { json: "createdAt", js: "createdAt", typ: u(undefined, Date) },
        { json: "updatedAt", js: "updatedAt", typ: u(undefined, Date) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "resourcesAffected", js: "resourcesAffected", typ: u(undefined, r("ResourcesAffected")) },
        { json: "category", js: "category", typ: u(undefined, "") },
        { json: "classificationDetails", js: "classificationDetails", typ: u(undefined, r("ClassificationDetails")) },
        { json: "policyDetails", js: "policyDetails", typ: u(undefined, null) },
        { json: "sample", js: "sample", typ: u(undefined, true) },
        { json: "archived", js: "archived", typ: u(undefined, true) },
        { json: "internalInfo", js: "internalInfo", typ: u(undefined, null) },
    ], false),
    "ClassificationDetails": o([
        { json: "jobArn", js: "jobArn", typ: "" },
        { json: "jobId", js: "jobId", typ: "" },
        { json: "result", js: "result", typ: r("Result") },
        { json: "detailedResultsLocation", js: "detailedResultsLocation", typ: "" },
    ], false),
    "Result": o([
        { json: "status", js: "status", typ: r("Status") },
        { json: "sizeClassified", js: "sizeClassified", typ: 0 },
        { json: "mimeType", js: "mimeType", typ: "" },
        { json: "sensitiveData", js: "sensitiveData", typ: a(r("SensitiveDatum")) },
        { json: "customDataIdentifiers", js: "customDataIdentifiers", typ: r("CustomDataIdentifiers") },
    ], false),
    "CustomDataIdentifiers": o([
        { json: "totalCount", js: "totalCount", typ: 0 },
        { json: "detections", js: "detections", typ: a(r("CustomDataIdentifiersDetection")) },
    ], false),
    "CustomDataIdentifiersDetection": o([
        { json: "arn", js: "arn", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "SensitiveDatum": o([
        { json: "category", js: "category", typ: "" },
        { json: "totalCount", js: "totalCount", typ: 0 },
        { json: "detections", js: "detections", typ: a(r("SensitiveDatumDetection")) },
    ], false),
    "SensitiveDatumDetection": o([
        { json: "type", js: "type", typ: "" },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "Status": o([
        { json: "code", js: "code", typ: "" },
        { json: "reason", js: "reason", typ: "" },
    ], false),
    "ResourcesAffected": o([
        { json: "s3Bucket", js: "s3Bucket", typ: r("S3Bucket") },
        { json: "s3Object", js: "s3Object", typ: r("S3Object") },
    ], false),
    "S3Bucket": o([
        { json: "arn", js: "arn", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "owner", js: "owner", typ: r("Owner") },
        { json: "tags", js: "tags", typ: a(r("Tag")) },
        { json: "defaultServerSideEncryption", js: "defaultServerSideEncryption", typ: r("ServerSideEncryption") },
        { json: "publicAccess", js: "publicAccess", typ: r("PublicAccess") },
    ], false),
    "ServerSideEncryption": o([
        { json: "encryptionType", js: "encryptionType", typ: "" },
        { json: "kmsMasterKeyId", js: "kmsMasterKeyId", typ: "" },
    ], false),
    "Owner": o([
        { json: "displayName", js: "displayName", typ: "" },
        { json: "id", js: "id", typ: "" },
    ], false),
    "PublicAccess": o([
        { json: "permissionConfiguration", js: "permissionConfiguration", typ: r("PermissionConfiguration") },
        { json: "effectivePermission", js: "effectivePermission", typ: "" },
    ], false),
    "PermissionConfiguration": o([
        { json: "bucketLevelPermissions", js: "bucketLevelPermissions", typ: r("BucketLevelPermissions") },
        { json: "accountLevelPermissions", js: "accountLevelPermissions", typ: r("AccountLevelPermissions") },
    ], false),
    "AccountLevelPermissions": o([
        { json: "blockPublicAccess", js: "blockPublicAccess", typ: r("BlockPublicAccess") },
    ], false),
    "BlockPublicAccess": o([
        { json: "ignorePublicAcls", js: "ignorePublicAcls", typ: true },
        { json: "restrictPublicBuckets", js: "restrictPublicBuckets", typ: true },
        { json: "blockPublicAcls", js: "blockPublicAcls", typ: true },
        { json: "blockPublicPolicy", js: "blockPublicPolicy", typ: true },
    ], false),
    "BucketLevelPermissions": o([
        { json: "accessControlList", js: "accessControlList", typ: r("AccessControlList") },
        { json: "bucketPolicy", js: "bucketPolicy", typ: r("AccessControlList") },
        { json: "blockPublicAccess", js: "blockPublicAccess", typ: r("BlockPublicAccess") },
    ], false),
    "AccessControlList": o([
        { json: "allowsPublicReadAccess", js: "allowsPublicReadAccess", typ: true },
        { json: "allowsPublicWriteAccess", js: "allowsPublicWriteAccess", typ: true },
    ], false),
    "Tag": o([
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "S3Object": o([
        { json: "bucketArn", js: "bucketArn", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "path", js: "path", typ: "" },
        { json: "extension", js: "extension", typ: "" },
        { json: "lastModified", js: "lastModified", typ: Date },
        { json: "versionId", js: "versionId", typ: "" },
        { json: "serverSideEncryption", js: "serverSideEncryption", typ: r("ServerSideEncryption") },
        { json: "size", js: "size", typ: 0 },
        { json: "storageClass", js: "storageClass", typ: "" },
        { json: "tags", js: "tags", typ: a(r("Tag")) },
        { json: "publicAccess", js: "publicAccess", typ: true },
        { json: "etag", js: "etag", typ: "" },
    ], false),
    "Severity": o([
        { json: "score", js: "score", typ: 0 },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Summary": o([
        { json: "Description", js: "Description", typ: "" },
        { json: "IP", js: "IP", typ: u(undefined, m(0)) },
        { json: "Time Range", js: "Time Range", typ: u(undefined, a(r("TimeRange"))) },
        { json: "Source ARN", js: "Source ARN", typ: u(undefined, "") },
        { json: "Record Count", js: "Record Count", typ: 0 },
        { json: "Location", js: "Location", typ: u(undefined, r("Location")) },
        { json: "Event Count", js: "Event Count", typ: 0 },
        { json: "Events", js: "Events", typ: u(undefined, r("Events")) },
        { json: "recipientAccountId", js: "recipientAccountId", typ: u(undefined, r("RecipientAccountID")) },
        { json: "Bucket", js: "Bucket", typ: u(undefined, r("Bucket")) },
        { json: "ACL", js: "ACL", typ: u(undefined, r("ACL")) },
        { json: "Timestamps", js: "Timestamps", typ: u(undefined, m(0)) },
        { json: "Object", js: "Object", typ: u(undefined, r("Object")) },
        { json: "Themes", js: "Themes", typ: u(undefined, r("Themes")) },
        { json: "DLP risk", js: "DLP risk", typ: u(undefined, r("DLPRisk")) },
        { json: "Owner", js: "Owner", typ: u(undefined, r("SummaryOwner")) },
    ], false),
    "ACL": o([
        { json: "secret-bucket-name", js: "secret-bucket-name", typ: a(r("SecretBucketName")) },
    ], false),
    "SecretBucketName": o([
        { json: "Owner", js: "Owner", typ: r("SecretBucketNameOwner") },
        { json: "Grants", js: "Grants", typ: a(r("Grant")) },
    ], false),
    "Grant": o([
        { json: "Grantee", js: "Grantee", typ: r("Grantee") },
        { json: "Permission", js: "Permission", typ: "" },
    ], false),
    "Grantee": o([
        { json: "Type", js: "Type", typ: "" },
        { json: "URI", js: "URI", typ: "" },
    ], false),
    "SecretBucketNameOwner": o([
        { json: "DisplayName", js: "DisplayName", typ: "" },
        { json: "ID", js: "ID", typ: "" },
    ], false),
    "Bucket": o([
        { json: "secret-bucket-name", js: "secret-bucket-name", typ: 0 },
    ], false),
    "DLPRisk": o([
        { json: "7", js: "7", typ: 0 },
    ], false),
    "Events": o([
        { json: "GetBucketLocation", js: "GetBucketLocation", typ: r("GetBucketACL") },
        { json: "ListRoles", js: "ListRoles", typ: r("GetBucketACL") },
        { json: "GetBucketPolicy", js: "GetBucketPolicy", typ: r("GetBucketPolicy") },
        { json: "GetBucketAcl", js: "GetBucketAcl", typ: r("GetBucketACL") },
        { json: "ListBuckets", js: "ListBuckets", typ: r("GetBucketACL") },
    ], false),
    "GetBucketACL": o([
        { json: "count", js: "count", typ: 0 },
        { json: "ISP", js: "ISP", typ: r("ISP") },
    ], false),
    "ISP": o([
        { json: "Amazon", js: "Amazon", typ: 0 },
    ], false),
    "GetBucketPolicy": o([
        { json: "count", js: "count", typ: 0 },
        { json: "ISP", js: "ISP", typ: r("ISP") },
        { json: "Error Code", js: "Error Code", typ: r("ErrorCode") },
    ], false),
    "ErrorCode": o([
        { json: "NoSuchBucketPolicy", js: "NoSuchBucketPolicy", typ: 0 },
    ], false),
    "Location": o([
        { json: "us-east-1", js: "us-east-1", typ: 0 },
    ], false),
    "Object": o([
        { json: "public_bucket/secret_key.txt", js: "public_bucket/secret_key.txt", typ: 0 },
        { json: "public_bucket/financial_summary.txt", js: "public_bucket/financial_summary.txt", typ: 0 },
    ], false),
    "SummaryOwner": o([
        { json: "bucket_owner", js: "bucket_owner", typ: 0 },
    ], false),
    "Themes": o([
        { json: "Secret Markings", js: "Secret Markings", typ: 0 },
        { json: "Corporate Proposals", js: "Corporate Proposals", typ: 0 },
        { json: "Confidential Markings", js: "Confidential Markings", typ: 0 },
    ], false),
    "TimeRange": o([
        { json: "count", js: "count", typ: 0 },
        { json: "start", js: "start", typ: Date },
        { json: "end", js: "end", typ: Date },
    ], false),
    "RecipientAccountID": o([
        { json: "123456789012", js: "123456789012", typ: 0 },
    ], false),
    "Trigger": o([
        { json: "rule-arn", js: "rule-arn", typ: u(undefined, "") },
        { json: "alert-type", js: "alert-type", typ: "" },
        { json: "created-at", js: "created-at", typ: u(undefined, Date) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "risk", js: "risk", typ: u(undefined, 0) },
        { json: "features", js: "features", typ: u(undefined, r("Features")) },
    ], false),
    "Features": o([
        { json: "distinctEventName", js: "distinctEventName", typ: r("DistinctEventName") },
        { json: "ListInstanceProfilesForRole", js: "ListInstanceProfilesForRole", typ: r("List") },
        { json: "ListRolePolicies", js: "ListRolePolicies", typ: r("List") },
    ], false),
    "List": o([
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "narrative", js: "narrative", typ: "" },
        { json: "anomalous", js: "anomalous", typ: true },
        { json: "multiplier", js: "multiplier", typ: 3.14 },
        { json: "excession_times", js: "excession_times", typ: a(Date) },
        { json: "risk", js: "risk", typ: 0 },
    ], false),
    "DistinctEventName": o([
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "narrative", js: "narrative", typ: "" },
        { json: "risk", js: "risk", typ: 0 },
    ], false),
};
