// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsConfig = Convert.toAwsConfig(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsConfig {
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
    recordVersion:            string;
    messageType:              string;
    configurationItemDiff?:   ConfigurationItemDiff;
    notificationCreationTime: Date;
    configurationItem?:       ConfigurationItem;
    s3ObjectKey?:             string;
    s3Bucket?:                string;
    configSnapshotId?:        string;
    resourceId?:              string;
    awsRegion?:               string;
    awsAccountId?:            string;
    configRuleName?:          string;
    configRuleARN?:           string;
    newEvaluationResult?:     NewEvaluationResult;
    resourceType?:            string;
    configRuleNames?:         string[];
}

export interface ConfigurationItem {
    relatedEvents:                any[];
    relationships:                any[];
    configuration:                Configuration;
    supplementaryConfiguration:   SupplementaryConfiguration;
    tags:                         Tags;
    configurationItemVersion:     string;
    configurationItemCaptureTime: Date;
    configurationStateId:         number;
    awsAccountId:                 string;
    configurationItemStatus:      string;
    resourceType:                 string;
    resourceId:                   string;
    resourceName:                 string;
    ARN:                          string;
    awsRegion:                    string;
    availabilityZone:             string;
    configurationStateMd5Hash:    string;
}

export interface Configuration {
    FileSystemId:      string;
    Arn:               string;
    Encrypted:         boolean;
    FileSystemTags:    FileSystemTag[];
    PerformanceMode:   string;
    ThroughputMode:    string;
    LifecyclePolicies: LifecyclePolicy[];
    BackupPolicy:      BackupPolicy;
    FileSystemPolicy:  SupplementaryConfiguration;
    KmsKeyId:          string;
}

export interface BackupPolicy {
    Status: string;
}

export interface SupplementaryConfiguration {
}

export interface FileSystemTag {
    Key:   string;
    Value: string;
}

export interface LifecyclePolicy {
    TransitionToIA?:                  string;
    TransitionToPrimaryStorageClass?: string;
}

export interface Tags {
    "aws:elasticfilesystem:default-backup": string;
    test:                                   string;
    Name:                                   string;
}

export interface ConfigurationItemDiff {
    changedProperties: ChangedProperties;
    changeType:        string;
}

export interface ChangedProperties {
    "Configuration.FileSystemTags.0": ConfigurationFileSystemTags0;
    "Tags.2":                         Tags2;
}

export interface ConfigurationFileSystemTags0 {
    updatedValue: FileSystemTag;
    changeType:   string;
}

export interface Tags2 {
    updatedValue: string;
    changeType:   string;
}

export interface NewEvaluationResult {
    evaluationResultIdentifier: EvaluationResultIdentifier;
    complianceType:             string;
    resultRecordedTime:         Date;
    configRuleInvokedTime:      Date;
    annotation:                 string;
}

export interface EvaluationResultIdentifier {
    evaluationResultQualifier: EvaluationResultQualifier;
    orderingTimestamp:         Date;
}

export interface EvaluationResultQualifier {
    configRuleName: string;
    resourceType:   string;
    resourceId:     string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsConfig(json: string): AwsConfig[] {
        return cast(JSON.parse(json), a(r("AwsConfig")));
    }

    public static awsConfigToJson(value: AwsConfig[]): string {
        return JSON.stringify(uncast(value, a(r("AwsConfig"))), null, 2);
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
        { json: "recordVersion", js: "recordVersion", typ: "" },
        { json: "messageType", js: "messageType", typ: "" },
        { json: "configurationItemDiff", js: "configurationItemDiff", typ: u(undefined, r("ConfigurationItemDiff")) },
        { json: "notificationCreationTime", js: "notificationCreationTime", typ: Date },
        { json: "configurationItem", js: "configurationItem", typ: u(undefined, r("ConfigurationItem")) },
        { json: "s3ObjectKey", js: "s3ObjectKey", typ: u(undefined, "") },
        { json: "s3Bucket", js: "s3Bucket", typ: u(undefined, "") },
        { json: "configSnapshotId", js: "configSnapshotId", typ: u(undefined, "") },
        { json: "resourceId", js: "resourceId", typ: u(undefined, "") },
        { json: "awsRegion", js: "awsRegion", typ: u(undefined, "") },
        { json: "awsAccountId", js: "awsAccountId", typ: u(undefined, "") },
        { json: "configRuleName", js: "configRuleName", typ: u(undefined, "") },
        { json: "configRuleARN", js: "configRuleARN", typ: u(undefined, "") },
        { json: "newEvaluationResult", js: "newEvaluationResult", typ: u(undefined, r("NewEvaluationResult")) },
        { json: "resourceType", js: "resourceType", typ: u(undefined, "") },
        { json: "configRuleNames", js: "configRuleNames", typ: u(undefined, a("")) },
    ], false),
    "ConfigurationItem": o([
        { json: "relatedEvents", js: "relatedEvents", typ: a("any") },
        { json: "relationships", js: "relationships", typ: a("any") },
        { json: "configuration", js: "configuration", typ: r("Configuration") },
        { json: "supplementaryConfiguration", js: "supplementaryConfiguration", typ: r("SupplementaryConfiguration") },
        { json: "tags", js: "tags", typ: r("Tags") },
        { json: "configurationItemVersion", js: "configurationItemVersion", typ: "" },
        { json: "configurationItemCaptureTime", js: "configurationItemCaptureTime", typ: Date },
        { json: "configurationStateId", js: "configurationStateId", typ: 0 },
        { json: "awsAccountId", js: "awsAccountId", typ: "" },
        { json: "configurationItemStatus", js: "configurationItemStatus", typ: "" },
        { json: "resourceType", js: "resourceType", typ: "" },
        { json: "resourceId", js: "resourceId", typ: "" },
        { json: "resourceName", js: "resourceName", typ: "" },
        { json: "ARN", js: "ARN", typ: "" },
        { json: "awsRegion", js: "awsRegion", typ: "" },
        { json: "availabilityZone", js: "availabilityZone", typ: "" },
        { json: "configurationStateMd5Hash", js: "configurationStateMd5Hash", typ: "" },
    ], false),
    "Configuration": o([
        { json: "FileSystemId", js: "FileSystemId", typ: "" },
        { json: "Arn", js: "Arn", typ: "" },
        { json: "Encrypted", js: "Encrypted", typ: true },
        { json: "FileSystemTags", js: "FileSystemTags", typ: a(r("FileSystemTag")) },
        { json: "PerformanceMode", js: "PerformanceMode", typ: "" },
        { json: "ThroughputMode", js: "ThroughputMode", typ: "" },
        { json: "LifecyclePolicies", js: "LifecyclePolicies", typ: a(r("LifecyclePolicy")) },
        { json: "BackupPolicy", js: "BackupPolicy", typ: r("BackupPolicy") },
        { json: "FileSystemPolicy", js: "FileSystemPolicy", typ: r("SupplementaryConfiguration") },
        { json: "KmsKeyId", js: "KmsKeyId", typ: "" },
    ], false),
    "BackupPolicy": o([
        { json: "Status", js: "Status", typ: "" },
    ], false),
    "SupplementaryConfiguration": o([
    ], false),
    "FileSystemTag": o([
        { json: "Key", js: "Key", typ: "" },
        { json: "Value", js: "Value", typ: "" },
    ], false),
    "LifecyclePolicy": o([
        { json: "TransitionToIA", js: "TransitionToIA", typ: u(undefined, "") },
        { json: "TransitionToPrimaryStorageClass", js: "TransitionToPrimaryStorageClass", typ: u(undefined, "") },
    ], false),
    "Tags": o([
        { json: "aws:elasticfilesystem:default-backup", js: "aws:elasticfilesystem:default-backup", typ: "" },
        { json: "test", js: "test", typ: "" },
        { json: "Name", js: "Name", typ: "" },
    ], false),
    "ConfigurationItemDiff": o([
        { json: "changedProperties", js: "changedProperties", typ: r("ChangedProperties") },
        { json: "changeType", js: "changeType", typ: "" },
    ], false),
    "ChangedProperties": o([
        { json: "Configuration.FileSystemTags.0", js: "Configuration.FileSystemTags.0", typ: r("ConfigurationFileSystemTags0") },
        { json: "Tags.2", js: "Tags.2", typ: r("Tags2") },
    ], false),
    "ConfigurationFileSystemTags0": o([
        { json: "updatedValue", js: "updatedValue", typ: r("FileSystemTag") },
        { json: "changeType", js: "changeType", typ: "" },
    ], false),
    "Tags2": o([
        { json: "updatedValue", js: "updatedValue", typ: "" },
        { json: "changeType", js: "changeType", typ: "" },
    ], false),
    "NewEvaluationResult": o([
        { json: "evaluationResultIdentifier", js: "evaluationResultIdentifier", typ: r("EvaluationResultIdentifier") },
        { json: "complianceType", js: "complianceType", typ: "" },
        { json: "resultRecordedTime", js: "resultRecordedTime", typ: Date },
        { json: "configRuleInvokedTime", js: "configRuleInvokedTime", typ: Date },
        { json: "annotation", js: "annotation", typ: "" },
    ], false),
    "EvaluationResultIdentifier": o([
        { json: "evaluationResultQualifier", js: "evaluationResultQualifier", typ: r("EvaluationResultQualifier") },
        { json: "orderingTimestamp", js: "orderingTimestamp", typ: Date },
    ], false),
    "EvaluationResultQualifier": o([
        { json: "configRuleName", js: "configRuleName", typ: "" },
        { json: "resourceType", js: "resourceType", typ: "" },
        { json: "resourceId", js: "resourceId", typ: "" },
    ], false),
};
