// To parse this data:
//
//   import { Convert, AwsConfig } from "./file";
//
//   const awsConfig = Convert.toAwsConfig(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsConfig {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsConfigElement:             AwsConfigElement;
    Detail:                       Detail;
    ConfigurationItem:            ConfigurationItem;
    Configuration:                Configuration;
    BackupPolicy:                 BackupPolicy;
    SupplementaryConfiguration:   SupplementaryConfiguration;
    FileSystemTag:                FileSystemTag;
    LifecyclePolicy:              LifecyclePolicy;
    Tags:                         Tags;
    ConfigurationItemDiff:        ConfigurationItemDiff;
    ChangedProperties:            ChangedProperties;
    ConfigurationFileSystemTags0: ConfigurationFileSystemTags0;
    Tags2:                        Tags2;
    NewEvaluationResult:          NewEvaluationResult;
    EvaluationResultIdentifier:   EvaluationResultIdentifier;
    EvaluationResultQualifier:    EvaluationResultQualifier;
}

export interface AwsConfigElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsConfigElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsConfigElementProperties {
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
    Integer = "integer",
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
    items: Account;
}

export interface BackupPolicy {
    type:                 string;
    additionalProperties: boolean;
    properties:           BackupPolicyProperties;
    required:             string[];
    title:                string;
}

export interface BackupPolicyProperties {
    Status: Account;
}

export interface ChangedProperties {
    type:                 string;
    additionalProperties: boolean;
    properties:           ChangedPropertiesProperties;
    required:             string[];
    title:                string;
}

export interface ChangedPropertiesProperties {
    "Configuration.FileSystemTags.0": DetailClass;
    "Tags.2":                         DetailClass;
}

export interface Configuration {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigurationProperties;
    required:             string[];
    title:                string;
}

export interface ConfigurationProperties {
    FileSystemId:      Account;
    Arn:               Account;
    Encrypted:         Account;
    FileSystemTags:    FileSystemTags;
    PerformanceMode:   Account;
    ThroughputMode:    Account;
    LifecyclePolicies: FileSystemTags;
    BackupPolicy:      DetailClass;
    FileSystemPolicy:  DetailClass;
    KmsKeyId:          Account;
}

export interface FileSystemTags {
    type:  string;
    items: DetailClass;
}

export interface ConfigurationFileSystemTags0 {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigurationFileSystemTags0Properties;
    required:             string[];
    title:                string;
}

export interface ConfigurationFileSystemTags0Properties {
    updatedValue: DetailClass;
    changeType:   Account;
}

export interface ConfigurationItem {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigurationItemProperties;
    required:             string[];
    title:                string;
}

export interface ConfigurationItemProperties {
    relatedEvents:                Relat;
    relationships:                Relat;
    configuration:                DetailClass;
    supplementaryConfiguration:   DetailClass;
    tags:                         DetailClass;
    configurationItemVersion:     Account;
    configurationItemCaptureTime: ID;
    configurationStateId:         Account;
    awsAccountId:                 Account;
    configurationItemStatus:      Account;
    resourceType:                 Account;
    resourceId:                   Account;
    resourceName:                 Account;
    ARN:                          Account;
    awsRegion:                    Account;
    availabilityZone:             Account;
    configurationStateMd5Hash:    Account;
}

export interface Relat {
    type:  string;
    items: RelatedEventsItems;
}

export interface RelatedEventsItems {
}

export interface ConfigurationItemDiff {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigurationItemDiffProperties;
    required:             string[];
    title:                string;
}

export interface ConfigurationItemDiffProperties {
    changedProperties: DetailClass;
    changeType:        Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    recordVersion:            Account;
    messageType:              Account;
    configurationItemDiff:    DetailClass;
    notificationCreationTime: ID;
    configurationItem:        DetailClass;
    s3ObjectKey:              Account;
    s3Bucket:                 Account;
    configSnapshotId:         ID;
    resourceId:               Account;
    awsRegion:                Account;
    awsAccountId:             Account;
    configRuleName:           Account;
    configRuleARN:            Account;
    newEvaluationResult:      DetailClass;
    resourceType:             Account;
    configRuleNames:          Resources;
}

export interface EvaluationResultIdentifier {
    type:                 string;
    additionalProperties: boolean;
    properties:           EvaluationResultIdentifierProperties;
    required:             string[];
    title:                string;
}

export interface EvaluationResultIdentifierProperties {
    evaluationResultQualifier: DetailClass;
    orderingTimestamp:         ID;
}

export interface EvaluationResultQualifier {
    type:                 string;
    additionalProperties: boolean;
    properties:           EvaluationResultQualifierProperties;
    required:             string[];
    title:                string;
}

export interface EvaluationResultQualifierProperties {
    configRuleName: Account;
    resourceType:   Account;
    resourceId:     Account;
}

export interface FileSystemTag {
    type:                 string;
    additionalProperties: boolean;
    properties:           FileSystemTagProperties;
    required:             string[];
    title:                string;
}

export interface FileSystemTagProperties {
    Key:   Account;
    Value: Account;
}

export interface LifecyclePolicy {
    type:                 string;
    additionalProperties: boolean;
    properties:           LifecyclePolicyProperties;
    required:             any[];
    title:                string;
}

export interface LifecyclePolicyProperties {
    TransitionToIA:                  Account;
    TransitionToPrimaryStorageClass: Account;
}

export interface NewEvaluationResult {
    type:                 string;
    additionalProperties: boolean;
    properties:           NewEvaluationResultProperties;
    required:             string[];
    title:                string;
}

export interface NewEvaluationResultProperties {
    evaluationResultIdentifier: DetailClass;
    complianceType:             Account;
    resultRecordedTime:         ID;
    configRuleInvokedTime:      ID;
    annotation:                 Account;
}

export interface SupplementaryConfiguration {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

export interface Tags {
    type:                 string;
    additionalProperties: boolean;
    properties:           TagsProperties;
    required:             string[];
    title:                string;
}

export interface TagsProperties {
    "aws:elasticfilesystem:default-backup": Account;
    test:                                   Account;
    Name:                                   Account;
}

export interface Tags2 {
    type:                 string;
    additionalProperties: boolean;
    properties:           Tags2Properties;
    required:             string[];
    title:                string;
}

export interface Tags2Properties {
    updatedValue: Account;
    changeType:   Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsConfig(json: string): AwsConfig {
        return cast(JSON.parse(json), r("AwsConfig"));
    }

    public static awsConfigToJson(value: AwsConfig): string {
        return JSON.stringify(uncast(value, r("AwsConfig")), null, 2);
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
    "AwsConfig": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsConfigElement", js: "AwsConfigElement", typ: r("AwsConfigElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "ConfigurationItem", js: "ConfigurationItem", typ: r("ConfigurationItem") },
        { json: "Configuration", js: "Configuration", typ: r("Configuration") },
        { json: "BackupPolicy", js: "BackupPolicy", typ: r("BackupPolicy") },
        { json: "SupplementaryConfiguration", js: "SupplementaryConfiguration", typ: r("SupplementaryConfiguration") },
        { json: "FileSystemTag", js: "FileSystemTag", typ: r("FileSystemTag") },
        { json: "LifecyclePolicy", js: "LifecyclePolicy", typ: r("LifecyclePolicy") },
        { json: "Tags", js: "Tags", typ: r("Tags") },
        { json: "ConfigurationItemDiff", js: "ConfigurationItemDiff", typ: r("ConfigurationItemDiff") },
        { json: "ChangedProperties", js: "ChangedProperties", typ: r("ChangedProperties") },
        { json: "ConfigurationFileSystemTags0", js: "ConfigurationFileSystemTags0", typ: r("ConfigurationFileSystemTags0") },
        { json: "Tags2", js: "Tags2", typ: r("Tags2") },
        { json: "NewEvaluationResult", js: "NewEvaluationResult", typ: r("NewEvaluationResult") },
        { json: "EvaluationResultIdentifier", js: "EvaluationResultIdentifier", typ: r("EvaluationResultIdentifier") },
        { json: "EvaluationResultQualifier", js: "EvaluationResultQualifier", typ: r("EvaluationResultQualifier") },
    ], false),
    "AwsConfigElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsConfigElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsConfigElementProperties": o([
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
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "BackupPolicy": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("BackupPolicyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "BackupPolicyProperties": o([
        { json: "Status", js: "Status", typ: r("Account") },
    ], false),
    "ChangedProperties": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ChangedPropertiesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ChangedPropertiesProperties": o([
        { json: "Configuration.FileSystemTags.0", js: "Configuration.FileSystemTags.0", typ: r("DetailClass") },
        { json: "Tags.2", js: "Tags.2", typ: r("DetailClass") },
    ], false),
    "Configuration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigurationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigurationProperties": o([
        { json: "FileSystemId", js: "FileSystemId", typ: r("Account") },
        { json: "Arn", js: "Arn", typ: r("Account") },
        { json: "Encrypted", js: "Encrypted", typ: r("Account") },
        { json: "FileSystemTags", js: "FileSystemTags", typ: r("FileSystemTags") },
        { json: "PerformanceMode", js: "PerformanceMode", typ: r("Account") },
        { json: "ThroughputMode", js: "ThroughputMode", typ: r("Account") },
        { json: "LifecyclePolicies", js: "LifecyclePolicies", typ: r("FileSystemTags") },
        { json: "BackupPolicy", js: "BackupPolicy", typ: r("DetailClass") },
        { json: "FileSystemPolicy", js: "FileSystemPolicy", typ: r("DetailClass") },
        { json: "KmsKeyId", js: "KmsKeyId", typ: r("Account") },
    ], false),
    "FileSystemTags": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "ConfigurationFileSystemTags0": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigurationFileSystemTags0Properties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigurationFileSystemTags0Properties": o([
        { json: "updatedValue", js: "updatedValue", typ: r("DetailClass") },
        { json: "changeType", js: "changeType", typ: r("Account") },
    ], false),
    "ConfigurationItem": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigurationItemProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigurationItemProperties": o([
        { json: "relatedEvents", js: "relatedEvents", typ: r("Relat") },
        { json: "relationships", js: "relationships", typ: r("Relat") },
        { json: "configuration", js: "configuration", typ: r("DetailClass") },
        { json: "supplementaryConfiguration", js: "supplementaryConfiguration", typ: r("DetailClass") },
        { json: "tags", js: "tags", typ: r("DetailClass") },
        { json: "configurationItemVersion", js: "configurationItemVersion", typ: r("Account") },
        { json: "configurationItemCaptureTime", js: "configurationItemCaptureTime", typ: r("ID") },
        { json: "configurationStateId", js: "configurationStateId", typ: r("Account") },
        { json: "awsAccountId", js: "awsAccountId", typ: r("Account") },
        { json: "configurationItemStatus", js: "configurationItemStatus", typ: r("Account") },
        { json: "resourceType", js: "resourceType", typ: r("Account") },
        { json: "resourceId", js: "resourceId", typ: r("Account") },
        { json: "resourceName", js: "resourceName", typ: r("Account") },
        { json: "ARN", js: "ARN", typ: r("Account") },
        { json: "awsRegion", js: "awsRegion", typ: r("Account") },
        { json: "availabilityZone", js: "availabilityZone", typ: r("Account") },
        { json: "configurationStateMd5Hash", js: "configurationStateMd5Hash", typ: r("Account") },
    ], false),
    "Relat": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("RelatedEventsItems") },
    ], false),
    "RelatedEventsItems": o([
    ], false),
    "ConfigurationItemDiff": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigurationItemDiffProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigurationItemDiffProperties": o([
        { json: "changedProperties", js: "changedProperties", typ: r("DetailClass") },
        { json: "changeType", js: "changeType", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "recordVersion", js: "recordVersion", typ: r("Account") },
        { json: "messageType", js: "messageType", typ: r("Account") },
        { json: "configurationItemDiff", js: "configurationItemDiff", typ: r("DetailClass") },
        { json: "notificationCreationTime", js: "notificationCreationTime", typ: r("ID") },
        { json: "configurationItem", js: "configurationItem", typ: r("DetailClass") },
        { json: "s3ObjectKey", js: "s3ObjectKey", typ: r("Account") },
        { json: "s3Bucket", js: "s3Bucket", typ: r("Account") },
        { json: "configSnapshotId", js: "configSnapshotId", typ: r("ID") },
        { json: "resourceId", js: "resourceId", typ: r("Account") },
        { json: "awsRegion", js: "awsRegion", typ: r("Account") },
        { json: "awsAccountId", js: "awsAccountId", typ: r("Account") },
        { json: "configRuleName", js: "configRuleName", typ: r("Account") },
        { json: "configRuleARN", js: "configRuleARN", typ: r("Account") },
        { json: "newEvaluationResult", js: "newEvaluationResult", typ: r("DetailClass") },
        { json: "resourceType", js: "resourceType", typ: r("Account") },
        { json: "configRuleNames", js: "configRuleNames", typ: r("Resources") },
    ], false),
    "EvaluationResultIdentifier": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EvaluationResultIdentifierProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EvaluationResultIdentifierProperties": o([
        { json: "evaluationResultQualifier", js: "evaluationResultQualifier", typ: r("DetailClass") },
        { json: "orderingTimestamp", js: "orderingTimestamp", typ: r("ID") },
    ], false),
    "EvaluationResultQualifier": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EvaluationResultQualifierProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EvaluationResultQualifierProperties": o([
        { json: "configRuleName", js: "configRuleName", typ: r("Account") },
        { json: "resourceType", js: "resourceType", typ: r("Account") },
        { json: "resourceId", js: "resourceId", typ: r("Account") },
    ], false),
    "FileSystemTag": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FileSystemTagProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FileSystemTagProperties": o([
        { json: "Key", js: "Key", typ: r("Account") },
        { json: "Value", js: "Value", typ: r("Account") },
    ], false),
    "LifecyclePolicy": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("LifecyclePolicyProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "LifecyclePolicyProperties": o([
        { json: "TransitionToIA", js: "TransitionToIA", typ: r("Account") },
        { json: "TransitionToPrimaryStorageClass", js: "TransitionToPrimaryStorageClass", typ: r("Account") },
    ], false),
    "NewEvaluationResult": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("NewEvaluationResultProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "NewEvaluationResultProperties": o([
        { json: "evaluationResultIdentifier", js: "evaluationResultIdentifier", typ: r("DetailClass") },
        { json: "complianceType", js: "complianceType", typ: r("Account") },
        { json: "resultRecordedTime", js: "resultRecordedTime", typ: r("ID") },
        { json: "configRuleInvokedTime", js: "configRuleInvokedTime", typ: r("ID") },
        { json: "annotation", js: "annotation", typ: r("Account") },
    ], false),
    "SupplementaryConfiguration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Tags": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TagsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TagsProperties": o([
        { json: "aws:elasticfilesystem:default-backup", js: "aws:elasticfilesystem:default-backup", typ: r("Account") },
        { json: "test", js: "test", typ: r("Account") },
        { json: "Name", js: "Name", typ: r("Account") },
    ], false),
    "Tags2": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("Tags2Properties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Tags2Properties": o([
        { json: "updatedValue", js: "updatedValue", typ: r("Account") },
        { json: "changeType", js: "changeType", typ: r("Account") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "string",
    ],
};
