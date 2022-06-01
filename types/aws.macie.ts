// To parse this data:
//
//   import { Convert, AwsMacie } from "./file";
//
//   const awsMacie = Convert.toAwsMacie(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsMacie {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsMacieElement:                AwsMacieElement;
    Detail:                         Detail;
    ClassificationDetails:          ClassificationDetails;
    Result:                         Result;
    CustomDataIdentifiers:          CustomDataIdentifiers;
    CustomDataIdentifiersDetection: CustomDataIdentifiersDetection;
    SensitiveDatum:                 SensitiveDatum;
    SensitiveDatumDetection:        SensitiveDatumDetection;
    Status:                         Status;
    ResourcesAffected:              ResourcesAffected;
    S3Bucket:                       S3Bucket;
    ServerSideEncryption:           ServerSideEncryption;
    Owner:                          Owner;
    PublicAccess:                   PublicAccess;
    PermissionConfiguration:        PermissionConfiguration;
    AccountLevelPermissions:        AccountLevelPermissions;
    BlockPublicAccess:              BlockPublicAccess;
    BucketLevelPermissions:         BucketLevelPermissions;
    AccessControlList:              AccessControlList;
    Tag:                            Tag;
    S3Object:                       S3Object;
    Severity:                       Severity;
    Summary:                        Summary;
    ACL:                            ACL;
    SecretBucketName:               SecretBucketNameClass;
    Grant:                          Grant;
    Grantee:                        Grantee;
    SecretBucketNameOwner:          SecretBucketNameOwner;
    Bucket:                         Bucket;
    DLPRisk:                        DLPRisk;
    Events:                         Events;
    GetBucketACL:                   GetBucketACL;
    ISP:                            ISP;
    GetBucketPolicy:                GetBucketPolicy;
    ErrorCode:                      ErrorCode;
    Location:                       Location;
    Object:                         Object;
    SummaryOwner:                   SummaryOwner;
    Themes:                         Themes;
    TimeRange:                      TimeRange;
    RecipientAccountID:             RecipientAccountID;
    Trigger:                        Trigger;
    Features:                       Features;
    List:                           List;
    DistinctEventName:              DistinctEventName;
}

export interface ACL {
    type:                 string;
    additionalProperties: boolean;
    properties:           ACLProperties;
    required:             string[];
    title:                string;
}

export interface ACLProperties {
    "secret-bucket-name": SecretBucketName;
}

export interface SecretBucketName {
    type:  string;
    items: Items;
}

export interface Items {
    $ref: string;
}

export interface AccessControlList {
    type:                 string;
    additionalProperties: boolean;
    properties:           AccessControlListProperties;
    required:             string[];
    title:                string;
}

export interface AccessControlListProperties {
    allowsPublicReadAccess:  AllowsPublicReadAccess;
    allowsPublicWriteAccess: AllowsPublicReadAccess;
}

export interface AllowsPublicReadAccess {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    Null = "null",
    Number = "number",
    String = "string",
}

export interface AccountLevelPermissions {
    type:                 string;
    additionalProperties: boolean;
    properties:           AccountLevelPermissionsProperties;
    required:             string[];
    title:                string;
}

export interface AccountLevelPermissionsProperties {
    blockPublicAccess: Items;
}

export interface AwsMacieElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsMacieElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsMacieElementProperties {
    version:       Time;
    id:            AllowsPublicReadAccess;
    "detail-type": AllowsPublicReadAccess;
    source:        AllowsPublicReadAccess;
    account:       AllowsPublicReadAccess;
    time:          Time;
    region:        AllowsPublicReadAccess;
    resources:     Resources;
    detail:        Items;
}

export interface Resources {
    type:  string;
    items: AllowsPublicReadAccess;
}

export interface Time {
    type:   Type;
    format: Format;
}

export enum Format {
    DateTime = "date-time",
    Integer = "integer",
    UUID = "uuid",
}

export interface BlockPublicAccess {
    type:                 string;
    additionalProperties: boolean;
    properties:           BlockPublicAccessProperties;
    required:             string[];
    title:                string;
}

export interface BlockPublicAccessProperties {
    ignorePublicAcls:      AllowsPublicReadAccess;
    restrictPublicBuckets: AllowsPublicReadAccess;
    blockPublicAcls:       AllowsPublicReadAccess;
    blockPublicPolicy:     AllowsPublicReadAccess;
}

export interface Bucket {
    type:                 string;
    additionalProperties: boolean;
    properties:           BucketProperties;
    required:             string[];
    title:                string;
}

export interface BucketProperties {
    "secret-bucket-name": AllowsPublicReadAccess;
}

export interface BucketLevelPermissions {
    type:                 string;
    additionalProperties: boolean;
    properties:           BucketLevelPermissionsProperties;
    required:             string[];
    title:                string;
}

export interface BucketLevelPermissionsProperties {
    accessControlList: Items;
    bucketPolicy:      Items;
    blockPublicAccess: Items;
}

export interface ClassificationDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           ClassificationDetailsProperties;
    required:             string[];
    title:                string;
}

export interface ClassificationDetailsProperties {
    jobArn:                  AllowsPublicReadAccess;
    jobId:                   Time;
    result:                  Items;
    detailedResultsLocation: AllowsPublicReadAccess;
}

export interface CustomDataIdentifiers {
    type:                 string;
    additionalProperties: boolean;
    properties:           CustomDataIdentifiersProperties;
    required:             string[];
    title:                string;
}

export interface CustomDataIdentifiersProperties {
    totalCount: AllowsPublicReadAccess;
    detections: SecretBucketName;
}

export interface CustomDataIdentifiersDetection {
    type:                 string;
    additionalProperties: boolean;
    properties:           CustomDataIdentifiersDetectionProperties;
    required:             string[];
    title:                string;
}

export interface CustomDataIdentifiersDetectionProperties {
    arn:   AllowsPublicReadAccess;
    name:  Time;
    count: AllowsPublicReadAccess;
}

export interface DLPRisk {
    type:                 string;
    additionalProperties: boolean;
    properties:           DLPRiskProperties;
    required:             string[];
    title:                string;
}

export interface DLPRiskProperties {
    "7": AllowsPublicReadAccess;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    "notification-type":   AllowsPublicReadAccess;
    name:                  AllowsPublicReadAccess;
    tags:                  Resources;
    url:                   URL;
    "alert-arn":           AllowsPublicReadAccess;
    "risk-score":          AllowsPublicReadAccess;
    trigger:               Items;
    "created-at":          Time;
    actor:                 AllowsPublicReadAccess;
    summary:               Items;
    schemaVersion:         AllowsPublicReadAccess;
    id:                    Time;
    accountId:             AllowsPublicReadAccess;
    partition:             AllowsPublicReadAccess;
    region:                AllowsPublicReadAccess;
    type:                  AllowsPublicReadAccess;
    title:                 AllowsPublicReadAccess;
    description:           AllowsPublicReadAccess;
    severity:              Items;
    createdAt:             Time;
    updatedAt:             Time;
    count:                 AllowsPublicReadAccess;
    resourcesAffected:     Items;
    category:              AllowsPublicReadAccess;
    classificationDetails: Items;
    policyDetails:         AllowsPublicReadAccess;
    sample:                AllowsPublicReadAccess;
    archived:              AllowsPublicReadAccess;
    internalInfo:          AllowsPublicReadAccess;
}

export interface URL {
    type:               Type;
    format:             string;
    "qt-uri-protocols": string[];
}

export interface DistinctEventName {
    type:                 string;
    additionalProperties: boolean;
    properties:           DistinctEventNameProperties;
    required:             string[];
    title:                string;
}

export interface DistinctEventNameProperties {
    name:        AllowsPublicReadAccess;
    description: AllowsPublicReadAccess;
    narrative:   AllowsPublicReadAccess;
    risk:        AllowsPublicReadAccess;
}

export interface ErrorCode {
    type:                 string;
    additionalProperties: boolean;
    properties:           ErrorCodeProperties;
    required:             string[];
    title:                string;
}

export interface ErrorCodeProperties {
    NoSuchBucketPolicy: AllowsPublicReadAccess;
}

export interface Events {
    type:                 string;
    additionalProperties: boolean;
    properties:           EventsProperties;
    required:             string[];
    title:                string;
}

export interface EventsProperties {
    GetBucketLocation: Items;
    ListRoles:         Items;
    GetBucketPolicy:   Items;
    GetBucketAcl:      Items;
    ListBuckets:       Items;
}

export interface Features {
    type:                 string;
    additionalProperties: boolean;
    properties:           FeaturesProperties;
    required:             string[];
    title:                string;
}

export interface FeaturesProperties {
    distinctEventName:           Items;
    ListInstanceProfilesForRole: Items;
    ListRolePolicies:            Items;
}

export interface GetBucketACL {
    type:                 string;
    additionalProperties: boolean;
    properties:           GetBucketACLProperties;
    required:             string[];
    title:                string;
}

export interface GetBucketACLProperties {
    count: AllowsPublicReadAccess;
    ISP:   Items;
}

export interface GetBucketPolicy {
    type:                 string;
    additionalProperties: boolean;
    properties:           GetBucketPolicyProperties;
    required:             string[];
    title:                string;
}

export interface GetBucketPolicyProperties {
    count:        AllowsPublicReadAccess;
    ISP:          Items;
    "Error Code": Items;
}

export interface Grant {
    type:                 string;
    additionalProperties: boolean;
    properties:           GrantProperties;
    required:             string[];
    title:                string;
}

export interface GrantProperties {
    Grantee:    Items;
    Permission: AllowsPublicReadAccess;
}

export interface Grantee {
    type:                 string;
    additionalProperties: boolean;
    properties:           GranteeProperties;
    required:             string[];
    title:                string;
}

export interface GranteeProperties {
    Type: AllowsPublicReadAccess;
    URI:  URL;
}

export interface ISP {
    type:                 string;
    additionalProperties: boolean;
    properties:           ISPProperties;
    required:             string[];
    title:                string;
}

export interface ISPProperties {
    Amazon: AllowsPublicReadAccess;
}

export interface List {
    type:                 string;
    additionalProperties: boolean;
    properties:           ListProperties;
    required:             string[];
    title:                string;
}

export interface ListProperties {
    name:            AllowsPublicReadAccess;
    description:     AllowsPublicReadAccess;
    narrative:       AllowsPublicReadAccess;
    anomalous:       AllowsPublicReadAccess;
    multiplier:      AllowsPublicReadAccess;
    excession_times: ExcessionTimes;
    risk:            AllowsPublicReadAccess;
}

export interface ExcessionTimes {
    type:  string;
    items: Time;
}

export interface Location {
    type:                 string;
    additionalProperties: boolean;
    properties:           LocationProperties;
    required:             string[];
    title:                string;
}

export interface LocationProperties {
    "us-east-1": AllowsPublicReadAccess;
}

export interface Object {
    type:                 string;
    additionalProperties: boolean;
    properties:           ObjectProperties;
    required:             string[];
    title:                string;
}

export interface ObjectProperties {
    "public_bucket/secret_key.txt":        AllowsPublicReadAccess;
    "public_bucket/financial_summary.txt": AllowsPublicReadAccess;
}

export interface Owner {
    type:                 string;
    additionalProperties: boolean;
    properties:           OwnerProperties;
    required:             string[];
    title:                string;
}

export interface OwnerProperties {
    displayName: AllowsPublicReadAccess;
    id:          AllowsPublicReadAccess;
}

export interface PermissionConfiguration {
    type:                 string;
    additionalProperties: boolean;
    properties:           PermissionConfigurationProperties;
    required:             string[];
    title:                string;
}

export interface PermissionConfigurationProperties {
    bucketLevelPermissions:  Items;
    accountLevelPermissions: Items;
}

export interface PublicAccess {
    type:                 string;
    additionalProperties: boolean;
    properties:           PublicAccessProperties;
    required:             string[];
    title:                string;
}

export interface PublicAccessProperties {
    permissionConfiguration: Items;
    effectivePermission:     AllowsPublicReadAccess;
}

export interface RecipientAccountID {
    type:                 string;
    additionalProperties: boolean;
    properties:           RecipientAccountIDProperties;
    required:             string[];
    title:                string;
}

export interface RecipientAccountIDProperties {
    "123456789012": AllowsPublicReadAccess;
}

export interface ResourcesAffected {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourcesAffectedProperties;
    required:             string[];
    title:                string;
}

export interface ResourcesAffectedProperties {
    s3Bucket: Items;
    s3Object: Items;
}

export interface Result {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResultProperties;
    required:             string[];
    title:                string;
}

export interface ResultProperties {
    status:                Items;
    sizeClassified:        AllowsPublicReadAccess;
    mimeType:              AllowsPublicReadAccess;
    sensitiveData:         SecretBucketName;
    customDataIdentifiers: Items;
}

export interface S3Bucket {
    type:                 string;
    additionalProperties: boolean;
    properties:           S3BucketProperties;
    required:             string[];
    title:                string;
}

export interface S3BucketProperties {
    arn:                         AllowsPublicReadAccess;
    name:                        AllowsPublicReadAccess;
    createdAt:                   Time;
    owner:                       Items;
    tags:                        SecretBucketName;
    defaultServerSideEncryption: Items;
    publicAccess:                Items;
}

export interface S3Object {
    type:                 string;
    additionalProperties: boolean;
    properties:           S3ObjectProperties;
    required:             string[];
    title:                string;
}

export interface S3ObjectProperties {
    bucketArn:            AllowsPublicReadAccess;
    key:                  Time;
    path:                 AllowsPublicReadAccess;
    extension:            AllowsPublicReadAccess;
    lastModified:         Time;
    versionId:            AllowsPublicReadAccess;
    serverSideEncryption: Items;
    size:                 AllowsPublicReadAccess;
    storageClass:         AllowsPublicReadAccess;
    tags:                 SecretBucketName;
    publicAccess:         AllowsPublicReadAccess;
    etag:                 AllowsPublicReadAccess;
}

export interface SecretBucketNameClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           SecretBucketNameProperties;
    required:             string[];
    title:                string;
}

export interface SecretBucketNameProperties {
    Owner:  Items;
    Grants: SecretBucketName;
}

export interface SecretBucketNameOwner {
    type:                 string;
    additionalProperties: boolean;
    properties:           SecretBucketNameOwnerProperties;
    required:             string[];
    title:                string;
}

export interface SecretBucketNameOwnerProperties {
    DisplayName: AllowsPublicReadAccess;
    ID:          AllowsPublicReadAccess;
}

export interface SensitiveDatum {
    type:                 string;
    additionalProperties: boolean;
    properties:           SensitiveDatumProperties;
    required:             string[];
    title:                string;
}

export interface SensitiveDatumProperties {
    category:   AllowsPublicReadAccess;
    totalCount: AllowsPublicReadAccess;
    detections: SecretBucketName;
}

export interface SensitiveDatumDetection {
    type:                 string;
    additionalProperties: boolean;
    properties:           SensitiveDatumDetectionProperties;
    required:             string[];
    title:                string;
}

export interface SensitiveDatumDetectionProperties {
    type:  AllowsPublicReadAccess;
    count: AllowsPublicReadAccess;
}

export interface ServerSideEncryption {
    type:                 string;
    additionalProperties: boolean;
    properties:           ServerSideEncryptionProperties;
    required:             string[];
    title:                string;
}

export interface ServerSideEncryptionProperties {
    encryptionType: AllowsPublicReadAccess;
    kmsMasterKeyId: AllowsPublicReadAccess;
}

export interface Severity {
    type:                 string;
    additionalProperties: boolean;
    properties:           SeverityProperties;
    required:             string[];
    title:                string;
}

export interface SeverityProperties {
    score:       AllowsPublicReadAccess;
    description: AllowsPublicReadAccess;
}

export interface Status {
    type:                 string;
    additionalProperties: boolean;
    properties:           StatusProperties;
    required:             string[];
    title:                string;
}

export interface StatusProperties {
    code:   AllowsPublicReadAccess;
    reason: AllowsPublicReadAccess;
}

export interface Summary {
    type:                 string;
    additionalProperties: boolean;
    properties:           SummaryProperties;
    required:             string[];
    title:                string;
}

export interface SummaryProperties {
    Description:        AllowsPublicReadAccess;
    IP:                 IP;
    "Time Range":       SecretBucketName;
    "Source ARN":       AllowsPublicReadAccess;
    "Record Count":     AllowsPublicReadAccess;
    Location:           Items;
    "Event Count":      AllowsPublicReadAccess;
    Events:             Items;
    recipientAccountId: Items;
    Bucket:             Items;
    ACL:                Items;
    Timestamps:         IP;
    Object:             Items;
    Themes:             Items;
    "DLP risk":         Items;
    Owner:              Items;
}

export interface IP {
    type:                 string;
    additionalProperties: AllowsPublicReadAccess;
}

export interface SummaryOwner {
    type:                 string;
    additionalProperties: boolean;
    properties:           SummaryOwnerProperties;
    required:             string[];
    title:                string;
}

export interface SummaryOwnerProperties {
    bucket_owner: AllowsPublicReadAccess;
}

export interface Tag {
    type:                 string;
    additionalProperties: boolean;
    properties:           TagProperties;
    required:             string[];
    title:                string;
}

export interface TagProperties {
    key:   Time;
    value: Time;
}

export interface Themes {
    type:                 string;
    additionalProperties: boolean;
    properties:           ThemesProperties;
    required:             string[];
    title:                string;
}

export interface ThemesProperties {
    "Secret Markings":       AllowsPublicReadAccess;
    "Corporate Proposals":   AllowsPublicReadAccess;
    "Confidential Markings": AllowsPublicReadAccess;
}

export interface TimeRange {
    type:                 string;
    additionalProperties: boolean;
    properties:           TimeRangeProperties;
    required:             string[];
    title:                string;
}

export interface TimeRangeProperties {
    count: AllowsPublicReadAccess;
    start: Time;
    end:   Time;
}

export interface Trigger {
    type:                 string;
    additionalProperties: boolean;
    properties:           TriggerProperties;
    required:             string[];
    title:                string;
}

export interface TriggerProperties {
    "rule-arn":   AllowsPublicReadAccess;
    "alert-type": AllowsPublicReadAccess;
    "created-at": Time;
    description:  AllowsPublicReadAccess;
    risk:         AllowsPublicReadAccess;
    features:     Items;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsMacie(json: string): AwsMacie {
        return cast(JSON.parse(json), r("AwsMacie"));
    }

    public static awsMacieToJson(value: AwsMacie): string {
        return JSON.stringify(uncast(value, r("AwsMacie")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsMacieElement", js: "AwsMacieElement", typ: r("AwsMacieElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "ClassificationDetails", js: "ClassificationDetails", typ: r("ClassificationDetails") },
        { json: "Result", js: "Result", typ: r("Result") },
        { json: "CustomDataIdentifiers", js: "CustomDataIdentifiers", typ: r("CustomDataIdentifiers") },
        { json: "CustomDataIdentifiersDetection", js: "CustomDataIdentifiersDetection", typ: r("CustomDataIdentifiersDetection") },
        { json: "SensitiveDatum", js: "SensitiveDatum", typ: r("SensitiveDatum") },
        { json: "SensitiveDatumDetection", js: "SensitiveDatumDetection", typ: r("SensitiveDatumDetection") },
        { json: "Status", js: "Status", typ: r("Status") },
        { json: "ResourcesAffected", js: "ResourcesAffected", typ: r("ResourcesAffected") },
        { json: "S3Bucket", js: "S3Bucket", typ: r("S3Bucket") },
        { json: "ServerSideEncryption", js: "ServerSideEncryption", typ: r("ServerSideEncryption") },
        { json: "Owner", js: "Owner", typ: r("Owner") },
        { json: "PublicAccess", js: "PublicAccess", typ: r("PublicAccess") },
        { json: "PermissionConfiguration", js: "PermissionConfiguration", typ: r("PermissionConfiguration") },
        { json: "AccountLevelPermissions", js: "AccountLevelPermissions", typ: r("AccountLevelPermissions") },
        { json: "BlockPublicAccess", js: "BlockPublicAccess", typ: r("BlockPublicAccess") },
        { json: "BucketLevelPermissions", js: "BucketLevelPermissions", typ: r("BucketLevelPermissions") },
        { json: "AccessControlList", js: "AccessControlList", typ: r("AccessControlList") },
        { json: "Tag", js: "Tag", typ: r("Tag") },
        { json: "S3Object", js: "S3Object", typ: r("S3Object") },
        { json: "Severity", js: "Severity", typ: r("Severity") },
        { json: "Summary", js: "Summary", typ: r("Summary") },
        { json: "ACL", js: "ACL", typ: r("ACL") },
        { json: "SecretBucketName", js: "SecretBucketName", typ: r("SecretBucketNameClass") },
        { json: "Grant", js: "Grant", typ: r("Grant") },
        { json: "Grantee", js: "Grantee", typ: r("Grantee") },
        { json: "SecretBucketNameOwner", js: "SecretBucketNameOwner", typ: r("SecretBucketNameOwner") },
        { json: "Bucket", js: "Bucket", typ: r("Bucket") },
        { json: "DLPRisk", js: "DLPRisk", typ: r("DLPRisk") },
        { json: "Events", js: "Events", typ: r("Events") },
        { json: "GetBucketACL", js: "GetBucketACL", typ: r("GetBucketACL") },
        { json: "ISP", js: "ISP", typ: r("ISP") },
        { json: "GetBucketPolicy", js: "GetBucketPolicy", typ: r("GetBucketPolicy") },
        { json: "ErrorCode", js: "ErrorCode", typ: r("ErrorCode") },
        { json: "Location", js: "Location", typ: r("Location") },
        { json: "Object", js: "Object", typ: r("Object") },
        { json: "SummaryOwner", js: "SummaryOwner", typ: r("SummaryOwner") },
        { json: "Themes", js: "Themes", typ: r("Themes") },
        { json: "TimeRange", js: "TimeRange", typ: r("TimeRange") },
        { json: "RecipientAccountID", js: "RecipientAccountID", typ: r("RecipientAccountID") },
        { json: "Trigger", js: "Trigger", typ: r("Trigger") },
        { json: "Features", js: "Features", typ: r("Features") },
        { json: "List", js: "List", typ: r("List") },
        { json: "DistinctEventName", js: "DistinctEventName", typ: r("DistinctEventName") },
    ], false),
    "ACL": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ACLProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ACLProperties": o([
        { json: "secret-bucket-name", js: "secret-bucket-name", typ: r("SecretBucketName") },
    ], false),
    "SecretBucketName": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "AccessControlList": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AccessControlListProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AccessControlListProperties": o([
        { json: "allowsPublicReadAccess", js: "allowsPublicReadAccess", typ: r("AllowsPublicReadAccess") },
        { json: "allowsPublicWriteAccess", js: "allowsPublicWriteAccess", typ: r("AllowsPublicReadAccess") },
    ], false),
    "AllowsPublicReadAccess": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AccountLevelPermissions": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AccountLevelPermissionsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AccountLevelPermissionsProperties": o([
        { json: "blockPublicAccess", js: "blockPublicAccess", typ: r("Items") },
    ], false),
    "AwsMacieElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsMacieElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsMacieElementProperties": o([
        { json: "version", js: "version", typ: r("Time") },
        { json: "id", js: "id", typ: r("AllowsPublicReadAccess") },
        { json: "detail-type", js: "detail-type", typ: r("AllowsPublicReadAccess") },
        { json: "source", js: "source", typ: r("AllowsPublicReadAccess") },
        { json: "account", js: "account", typ: r("AllowsPublicReadAccess") },
        { json: "time", js: "time", typ: r("Time") },
        { json: "region", js: "region", typ: r("AllowsPublicReadAccess") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Time": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: r("Format") },
    ], false),
    "BlockPublicAccess": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("BlockPublicAccessProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "BlockPublicAccessProperties": o([
        { json: "ignorePublicAcls", js: "ignorePublicAcls", typ: r("AllowsPublicReadAccess") },
        { json: "restrictPublicBuckets", js: "restrictPublicBuckets", typ: r("AllowsPublicReadAccess") },
        { json: "blockPublicAcls", js: "blockPublicAcls", typ: r("AllowsPublicReadAccess") },
        { json: "blockPublicPolicy", js: "blockPublicPolicy", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Bucket": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("BucketProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "BucketProperties": o([
        { json: "secret-bucket-name", js: "secret-bucket-name", typ: r("AllowsPublicReadAccess") },
    ], false),
    "BucketLevelPermissions": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("BucketLevelPermissionsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "BucketLevelPermissionsProperties": o([
        { json: "accessControlList", js: "accessControlList", typ: r("Items") },
        { json: "bucketPolicy", js: "bucketPolicy", typ: r("Items") },
        { json: "blockPublicAccess", js: "blockPublicAccess", typ: r("Items") },
    ], false),
    "ClassificationDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ClassificationDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ClassificationDetailsProperties": o([
        { json: "jobArn", js: "jobArn", typ: r("AllowsPublicReadAccess") },
        { json: "jobId", js: "jobId", typ: r("Time") },
        { json: "result", js: "result", typ: r("Items") },
        { json: "detailedResultsLocation", js: "detailedResultsLocation", typ: r("AllowsPublicReadAccess") },
    ], false),
    "CustomDataIdentifiers": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CustomDataIdentifiersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CustomDataIdentifiersProperties": o([
        { json: "totalCount", js: "totalCount", typ: r("AllowsPublicReadAccess") },
        { json: "detections", js: "detections", typ: r("SecretBucketName") },
    ], false),
    "CustomDataIdentifiersDetection": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CustomDataIdentifiersDetectionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CustomDataIdentifiersDetectionProperties": o([
        { json: "arn", js: "arn", typ: r("AllowsPublicReadAccess") },
        { json: "name", js: "name", typ: r("Time") },
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
    ], false),
    "DLPRisk": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DLPRiskProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DLPRiskProperties": o([
        { json: "7", js: "7", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "notification-type", js: "notification-type", typ: r("AllowsPublicReadAccess") },
        { json: "name", js: "name", typ: r("AllowsPublicReadAccess") },
        { json: "tags", js: "tags", typ: r("Resources") },
        { json: "url", js: "url", typ: r("URL") },
        { json: "alert-arn", js: "alert-arn", typ: r("AllowsPublicReadAccess") },
        { json: "risk-score", js: "risk-score", typ: r("AllowsPublicReadAccess") },
        { json: "trigger", js: "trigger", typ: r("Items") },
        { json: "created-at", js: "created-at", typ: r("Time") },
        { json: "actor", js: "actor", typ: r("AllowsPublicReadAccess") },
        { json: "summary", js: "summary", typ: r("Items") },
        { json: "schemaVersion", js: "schemaVersion", typ: r("AllowsPublicReadAccess") },
        { json: "id", js: "id", typ: r("Time") },
        { json: "accountId", js: "accountId", typ: r("AllowsPublicReadAccess") },
        { json: "partition", js: "partition", typ: r("AllowsPublicReadAccess") },
        { json: "region", js: "region", typ: r("AllowsPublicReadAccess") },
        { json: "type", js: "type", typ: r("AllowsPublicReadAccess") },
        { json: "title", js: "title", typ: r("AllowsPublicReadAccess") },
        { json: "description", js: "description", typ: r("AllowsPublicReadAccess") },
        { json: "severity", js: "severity", typ: r("Items") },
        { json: "createdAt", js: "createdAt", typ: r("Time") },
        { json: "updatedAt", js: "updatedAt", typ: r("Time") },
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
        { json: "resourcesAffected", js: "resourcesAffected", typ: r("Items") },
        { json: "category", js: "category", typ: r("AllowsPublicReadAccess") },
        { json: "classificationDetails", js: "classificationDetails", typ: r("Items") },
        { json: "policyDetails", js: "policyDetails", typ: r("AllowsPublicReadAccess") },
        { json: "sample", js: "sample", typ: r("AllowsPublicReadAccess") },
        { json: "archived", js: "archived", typ: r("AllowsPublicReadAccess") },
        { json: "internalInfo", js: "internalInfo", typ: r("AllowsPublicReadAccess") },
    ], false),
    "URL": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
    ], false),
    "DistinctEventName": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DistinctEventNameProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DistinctEventNameProperties": o([
        { json: "name", js: "name", typ: r("AllowsPublicReadAccess") },
        { json: "description", js: "description", typ: r("AllowsPublicReadAccess") },
        { json: "narrative", js: "narrative", typ: r("AllowsPublicReadAccess") },
        { json: "risk", js: "risk", typ: r("AllowsPublicReadAccess") },
    ], false),
    "ErrorCode": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ErrorCodeProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ErrorCodeProperties": o([
        { json: "NoSuchBucketPolicy", js: "NoSuchBucketPolicy", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Events": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EventsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EventsProperties": o([
        { json: "GetBucketLocation", js: "GetBucketLocation", typ: r("Items") },
        { json: "ListRoles", js: "ListRoles", typ: r("Items") },
        { json: "GetBucketPolicy", js: "GetBucketPolicy", typ: r("Items") },
        { json: "GetBucketAcl", js: "GetBucketAcl", typ: r("Items") },
        { json: "ListBuckets", js: "ListBuckets", typ: r("Items") },
    ], false),
    "Features": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FeaturesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FeaturesProperties": o([
        { json: "distinctEventName", js: "distinctEventName", typ: r("Items") },
        { json: "ListInstanceProfilesForRole", js: "ListInstanceProfilesForRole", typ: r("Items") },
        { json: "ListRolePolicies", js: "ListRolePolicies", typ: r("Items") },
    ], false),
    "GetBucketACL": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GetBucketACLProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GetBucketACLProperties": o([
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
        { json: "ISP", js: "ISP", typ: r("Items") },
    ], false),
    "GetBucketPolicy": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GetBucketPolicyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GetBucketPolicyProperties": o([
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
        { json: "ISP", js: "ISP", typ: r("Items") },
        { json: "Error Code", js: "Error Code", typ: r("Items") },
    ], false),
    "Grant": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GrantProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GrantProperties": o([
        { json: "Grantee", js: "Grantee", typ: r("Items") },
        { json: "Permission", js: "Permission", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Grantee": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GranteeProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GranteeProperties": o([
        { json: "Type", js: "Type", typ: r("AllowsPublicReadAccess") },
        { json: "URI", js: "URI", typ: r("URL") },
    ], false),
    "ISP": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ISPProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ISPProperties": o([
        { json: "Amazon", js: "Amazon", typ: r("AllowsPublicReadAccess") },
    ], false),
    "List": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ListProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ListProperties": o([
        { json: "name", js: "name", typ: r("AllowsPublicReadAccess") },
        { json: "description", js: "description", typ: r("AllowsPublicReadAccess") },
        { json: "narrative", js: "narrative", typ: r("AllowsPublicReadAccess") },
        { json: "anomalous", js: "anomalous", typ: r("AllowsPublicReadAccess") },
        { json: "multiplier", js: "multiplier", typ: r("AllowsPublicReadAccess") },
        { json: "excession_times", js: "excession_times", typ: r("ExcessionTimes") },
        { json: "risk", js: "risk", typ: r("AllowsPublicReadAccess") },
    ], false),
    "ExcessionTimes": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Time") },
    ], false),
    "Location": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("LocationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "LocationProperties": o([
        { json: "us-east-1", js: "us-east-1", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Object": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ObjectProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ObjectProperties": o([
        { json: "public_bucket/secret_key.txt", js: "public_bucket/secret_key.txt", typ: r("AllowsPublicReadAccess") },
        { json: "public_bucket/financial_summary.txt", js: "public_bucket/financial_summary.txt", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Owner": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OwnerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OwnerProperties": o([
        { json: "displayName", js: "displayName", typ: r("AllowsPublicReadAccess") },
        { json: "id", js: "id", typ: r("AllowsPublicReadAccess") },
    ], false),
    "PermissionConfiguration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PermissionConfigurationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PermissionConfigurationProperties": o([
        { json: "bucketLevelPermissions", js: "bucketLevelPermissions", typ: r("Items") },
        { json: "accountLevelPermissions", js: "accountLevelPermissions", typ: r("Items") },
    ], false),
    "PublicAccess": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PublicAccessProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PublicAccessProperties": o([
        { json: "permissionConfiguration", js: "permissionConfiguration", typ: r("Items") },
        { json: "effectivePermission", js: "effectivePermission", typ: r("AllowsPublicReadAccess") },
    ], false),
    "RecipientAccountID": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RecipientAccountIDProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RecipientAccountIDProperties": o([
        { json: "123456789012", js: "123456789012", typ: r("AllowsPublicReadAccess") },
    ], false),
    "ResourcesAffected": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourcesAffectedProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourcesAffectedProperties": o([
        { json: "s3Bucket", js: "s3Bucket", typ: r("Items") },
        { json: "s3Object", js: "s3Object", typ: r("Items") },
    ], false),
    "Result": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResultProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResultProperties": o([
        { json: "status", js: "status", typ: r("Items") },
        { json: "sizeClassified", js: "sizeClassified", typ: r("AllowsPublicReadAccess") },
        { json: "mimeType", js: "mimeType", typ: r("AllowsPublicReadAccess") },
        { json: "sensitiveData", js: "sensitiveData", typ: r("SecretBucketName") },
        { json: "customDataIdentifiers", js: "customDataIdentifiers", typ: r("Items") },
    ], false),
    "S3Bucket": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("S3BucketProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3BucketProperties": o([
        { json: "arn", js: "arn", typ: r("AllowsPublicReadAccess") },
        { json: "name", js: "name", typ: r("AllowsPublicReadAccess") },
        { json: "createdAt", js: "createdAt", typ: r("Time") },
        { json: "owner", js: "owner", typ: r("Items") },
        { json: "tags", js: "tags", typ: r("SecretBucketName") },
        { json: "defaultServerSideEncryption", js: "defaultServerSideEncryption", typ: r("Items") },
        { json: "publicAccess", js: "publicAccess", typ: r("Items") },
    ], false),
    "S3Object": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("S3ObjectProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3ObjectProperties": o([
        { json: "bucketArn", js: "bucketArn", typ: r("AllowsPublicReadAccess") },
        { json: "key", js: "key", typ: r("Time") },
        { json: "path", js: "path", typ: r("AllowsPublicReadAccess") },
        { json: "extension", js: "extension", typ: r("AllowsPublicReadAccess") },
        { json: "lastModified", js: "lastModified", typ: r("Time") },
        { json: "versionId", js: "versionId", typ: r("AllowsPublicReadAccess") },
        { json: "serverSideEncryption", js: "serverSideEncryption", typ: r("Items") },
        { json: "size", js: "size", typ: r("AllowsPublicReadAccess") },
        { json: "storageClass", js: "storageClass", typ: r("AllowsPublicReadAccess") },
        { json: "tags", js: "tags", typ: r("SecretBucketName") },
        { json: "publicAccess", js: "publicAccess", typ: r("AllowsPublicReadAccess") },
        { json: "etag", js: "etag", typ: r("AllowsPublicReadAccess") },
    ], false),
    "SecretBucketNameClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SecretBucketNameProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SecretBucketNameProperties": o([
        { json: "Owner", js: "Owner", typ: r("Items") },
        { json: "Grants", js: "Grants", typ: r("SecretBucketName") },
    ], false),
    "SecretBucketNameOwner": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SecretBucketNameOwnerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SecretBucketNameOwnerProperties": o([
        { json: "DisplayName", js: "DisplayName", typ: r("AllowsPublicReadAccess") },
        { json: "ID", js: "ID", typ: r("AllowsPublicReadAccess") },
    ], false),
    "SensitiveDatum": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SensitiveDatumProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SensitiveDatumProperties": o([
        { json: "category", js: "category", typ: r("AllowsPublicReadAccess") },
        { json: "totalCount", js: "totalCount", typ: r("AllowsPublicReadAccess") },
        { json: "detections", js: "detections", typ: r("SecretBucketName") },
    ], false),
    "SensitiveDatumDetection": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SensitiveDatumDetectionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SensitiveDatumDetectionProperties": o([
        { json: "type", js: "type", typ: r("AllowsPublicReadAccess") },
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
    ], false),
    "ServerSideEncryption": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ServerSideEncryptionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServerSideEncryptionProperties": o([
        { json: "encryptionType", js: "encryptionType", typ: r("AllowsPublicReadAccess") },
        { json: "kmsMasterKeyId", js: "kmsMasterKeyId", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Severity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SeverityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SeverityProperties": o([
        { json: "score", js: "score", typ: r("AllowsPublicReadAccess") },
        { json: "description", js: "description", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Status": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("StatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "StatusProperties": o([
        { json: "code", js: "code", typ: r("AllowsPublicReadAccess") },
        { json: "reason", js: "reason", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Summary": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SummaryProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SummaryProperties": o([
        { json: "Description", js: "Description", typ: r("AllowsPublicReadAccess") },
        { json: "IP", js: "IP", typ: r("IP") },
        { json: "Time Range", js: "Time Range", typ: r("SecretBucketName") },
        { json: "Source ARN", js: "Source ARN", typ: r("AllowsPublicReadAccess") },
        { json: "Record Count", js: "Record Count", typ: r("AllowsPublicReadAccess") },
        { json: "Location", js: "Location", typ: r("Items") },
        { json: "Event Count", js: "Event Count", typ: r("AllowsPublicReadAccess") },
        { json: "Events", js: "Events", typ: r("Items") },
        { json: "recipientAccountId", js: "recipientAccountId", typ: r("Items") },
        { json: "Bucket", js: "Bucket", typ: r("Items") },
        { json: "ACL", js: "ACL", typ: r("Items") },
        { json: "Timestamps", js: "Timestamps", typ: r("IP") },
        { json: "Object", js: "Object", typ: r("Items") },
        { json: "Themes", js: "Themes", typ: r("Items") },
        { json: "DLP risk", js: "DLP risk", typ: r("Items") },
        { json: "Owner", js: "Owner", typ: r("Items") },
    ], false),
    "IP": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: r("AllowsPublicReadAccess") },
    ], false),
    "SummaryOwner": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SummaryOwnerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SummaryOwnerProperties": o([
        { json: "bucket_owner", js: "bucket_owner", typ: r("AllowsPublicReadAccess") },
    ], false),
    "Tag": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TagProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TagProperties": o([
        { json: "key", js: "key", typ: r("Time") },
        { json: "value", js: "value", typ: r("Time") },
    ], false),
    "Themes": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ThemesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ThemesProperties": o([
        { json: "Secret Markings", js: "Secret Markings", typ: r("AllowsPublicReadAccess") },
        { json: "Corporate Proposals", js: "Corporate Proposals", typ: r("AllowsPublicReadAccess") },
        { json: "Confidential Markings", js: "Confidential Markings", typ: r("AllowsPublicReadAccess") },
    ], false),
    "TimeRange": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TimeRangeProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TimeRangeProperties": o([
        { json: "count", js: "count", typ: r("AllowsPublicReadAccess") },
        { json: "start", js: "start", typ: r("Time") },
        { json: "end", js: "end", typ: r("Time") },
    ], false),
    "Trigger": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TriggerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TriggerProperties": o([
        { json: "rule-arn", js: "rule-arn", typ: r("AllowsPublicReadAccess") },
        { json: "alert-type", js: "alert-type", typ: r("AllowsPublicReadAccess") },
        { json: "created-at", js: "created-at", typ: r("Time") },
        { json: "description", js: "description", typ: r("AllowsPublicReadAccess") },
        { json: "risk", js: "risk", typ: r("AllowsPublicReadAccess") },
        { json: "features", js: "features", typ: r("Items") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "null",
        "number",
        "string",
    ],
    "Format": [
        "date-time",
        "integer",
        "uuid",
    ],
};
