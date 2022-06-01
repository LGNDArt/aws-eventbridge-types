// To parse this data:
//
//   import { Convert, AwsInspector2 } from "./file";
//
//   const awsInspector2 = Convert.toAwsInspector2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsInspector2 {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsInspector2Element:        AwsInspector2Element;
    Detail:                      Detail;
    FindingSeverityCounts:       FindingSeverityCounts;
    InspectorScoreDetails:       InspectorScoreDetails;
    AdjustedCvss:                AdjustedCvss;
    PackageVulnerabilityDetails: PackageVulnerabilityDetails;
    Cvss:                        Cvss;
    VulnerablePackage:           VulnerablePackage;
    Remediation:                 Remediation;
    Recommendation:              Recommendation;
    Resource:                    Resource;
    Details:                     Details;
    AwsEc2Instance:              AwsEc2Instance;
    ScanStatus:                  ScanStatus;
}

export interface AdjustedCvss {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdjustedCvssProperties;
    required:             string[];
    title:                string;
}

export interface AdjustedCvssProperties {
    adjustments:   Adjustments;
    cvssSource:    CvssSource;
    score:         CvssSource;
    scoreSource:   CvssSource;
    scoringVector: CvssSource;
    version:       CvssSource;
}

export interface Adjustments {
    type:  string;
    items: AdjustmentsItems;
}

export interface AdjustmentsItems {
}

export interface CvssSource {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Number = "number",
    String = "string",
}

export interface AwsEc2Instance {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsEc2InstanceProperties;
    required:             string[];
    title:                string;
}

export interface AwsEc2InstanceProperties {
    iamInstanceProfileArn: CvssSource;
    imageId:               CvssSource;
    ipV4Addresses:         IPV4Addresses;
    ipV6Addresses:         Adjustments;
    launchedAt:            CvssSource;
    platform:              CvssSource;
    subnetId:              CvssSource;
    type:                  CvssSource;
    vpcId:                 CvssSource;
}

export interface IPV4Addresses {
    type:  string;
    items: CvssSource;
}

export interface AwsInspector2Element {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsInspector2ElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsInspector2ElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": CvssSource;
    source:        CvssSource;
    account:       CvssSource;
    time:          ID;
    region:        CvssSource;
    resources:     IPV4Addresses;
    detail:        DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Cvss {
    type:                 string;
    additionalProperties: boolean;
    properties:           CvssProperties;
    required:             string[];
    title:                string;
}

export interface CvssProperties {
    baseScore:     CvssSource;
    scoringVector: CvssSource;
    source:        CvssSource;
    version:       CvssSource;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    awsAccountId:                CvssSource;
    description:                 CvssSource;
    findingArn:                  CvssSource;
    firstObservedAt:             CvssSource;
    inspectorScore:              CvssSource;
    inspectorScoreDetails:       DetailClass;
    lastObservedAt:              CvssSource;
    packageVulnerabilityDetails: DetailClass;
    remediation:                 DetailClass;
    resources:                   Resources;
    severity:                    CvssSource;
    status:                      CvssSource;
    title:                       CvssSource;
    type:                        CvssSource;
    updatedAt:                   CvssSource;
    scanStatus:                  DetailClass;
    eventTimestamp:              ID;
    "scan-status":               CvssSource;
    "repository-name":           CvssSource;
    "finding-severity-counts":   DetailClass;
    "image-digest":              CvssSource;
    "image-tags":                IPV4Addresses;
}

export interface Resources {
    type:  string;
    items: DetailClass;
}

export interface Details {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailsProperties;
    required:             string[];
    title:                string;
}

export interface DetailsProperties {
    awsEc2Instance: DetailClass;
}

export interface FindingSeverityCounts {
    type:                 string;
    additionalProperties: boolean;
    properties:           FindingSeverityCountsProperties;
    required:             string[];
    title:                string;
}

export interface FindingSeverityCountsProperties {
    CRITICAL: CvssSource;
    HIGH:     CvssSource;
    MEDIUM:   CvssSource;
    TOTAL:    CvssSource;
}

export interface InspectorScoreDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           InspectorScoreDetailsProperties;
    required:             string[];
    title:                string;
}

export interface InspectorScoreDetailsProperties {
    adjustedCvss: DetailClass;
}

export interface PackageVulnerabilityDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           PackageVulnerabilityDetailsProperties;
    required:             string[];
    title:                string;
}

export interface PackageVulnerabilityDetailsProperties {
    cvss:               Resources;
    referenceUrls:      Adjustments;
    source:             CvssSource;
    sourceUrl:          SourceURL;
    vendorCreatedAt:    CvssSource;
    vendorSeverity:     CvssSource;
    vulnerabilityId:    CvssSource;
    vulnerablePackages: Resources;
}

export interface SourceURL {
    type:               Type;
    format:             string;
    "qt-uri-protocols": string[];
}

export interface Recommendation {
    type:                 string;
    additionalProperties: boolean;
    properties:           RecommendationProperties;
    required:             string[];
    title:                string;
}

export interface RecommendationProperties {
    text: CvssSource;
}

export interface Remediation {
    type:                 string;
    additionalProperties: boolean;
    properties:           RemediationProperties;
    required:             string[];
    title:                string;
}

export interface RemediationProperties {
    recommendation: DetailClass;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    details:   DetailClass;
    id:        CvssSource;
    partition: CvssSource;
    region:    CvssSource;
    type:      CvssSource;
}

export interface ScanStatus {
    type:                 string;
    additionalProperties: boolean;
    properties:           ScanStatusProperties;
    required:             string[];
    title:                string;
}

export interface ScanStatusProperties {
    reason:          CvssSource;
    statusCodeValue: CvssSource;
}

export interface VulnerablePackage {
    type:                 string;
    additionalProperties: boolean;
    properties:           VulnerablePackageProperties;
    required:             string[];
    title:                string;
}

export interface VulnerablePackageProperties {
    arch:           CvssSource;
    epoch:          CvssSource;
    name:           CvssSource;
    packageManager: CvssSource;
    release:        CvssSource;
    version:        CvssSource;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsInspector2(json: string): AwsInspector2 {
        return cast(JSON.parse(json), r("AwsInspector2"));
    }

    public static awsInspector2ToJson(value: AwsInspector2): string {
        return JSON.stringify(uncast(value, r("AwsInspector2")), null, 2);
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
    "AwsInspector2": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsInspector2Element", js: "AwsInspector2Element", typ: r("AwsInspector2Element") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "FindingSeverityCounts", js: "FindingSeverityCounts", typ: r("FindingSeverityCounts") },
        { json: "InspectorScoreDetails", js: "InspectorScoreDetails", typ: r("InspectorScoreDetails") },
        { json: "AdjustedCvss", js: "AdjustedCvss", typ: r("AdjustedCvss") },
        { json: "PackageVulnerabilityDetails", js: "PackageVulnerabilityDetails", typ: r("PackageVulnerabilityDetails") },
        { json: "Cvss", js: "Cvss", typ: r("Cvss") },
        { json: "VulnerablePackage", js: "VulnerablePackage", typ: r("VulnerablePackage") },
        { json: "Remediation", js: "Remediation", typ: r("Remediation") },
        { json: "Recommendation", js: "Recommendation", typ: r("Recommendation") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "Details", js: "Details", typ: r("Details") },
        { json: "AwsEc2Instance", js: "AwsEc2Instance", typ: r("AwsEc2Instance") },
        { json: "ScanStatus", js: "ScanStatus", typ: r("ScanStatus") },
    ], false),
    "AdjustedCvss": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdjustedCvssProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdjustedCvssProperties": o([
        { json: "adjustments", js: "adjustments", typ: r("Adjustments") },
        { json: "cvssSource", js: "cvssSource", typ: r("CvssSource") },
        { json: "score", js: "score", typ: r("CvssSource") },
        { json: "scoreSource", js: "scoreSource", typ: r("CvssSource") },
        { json: "scoringVector", js: "scoringVector", typ: r("CvssSource") },
        { json: "version", js: "version", typ: r("CvssSource") },
    ], false),
    "Adjustments": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("AdjustmentsItems") },
    ], false),
    "AdjustmentsItems": o([
    ], false),
    "CvssSource": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsEc2Instance": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsEc2InstanceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsEc2InstanceProperties": o([
        { json: "iamInstanceProfileArn", js: "iamInstanceProfileArn", typ: r("CvssSource") },
        { json: "imageId", js: "imageId", typ: r("CvssSource") },
        { json: "ipV4Addresses", js: "ipV4Addresses", typ: r("IPV4Addresses") },
        { json: "ipV6Addresses", js: "ipV6Addresses", typ: r("Adjustments") },
        { json: "launchedAt", js: "launchedAt", typ: r("CvssSource") },
        { json: "platform", js: "platform", typ: r("CvssSource") },
        { json: "subnetId", js: "subnetId", typ: r("CvssSource") },
        { json: "type", js: "type", typ: r("CvssSource") },
        { json: "vpcId", js: "vpcId", typ: r("CvssSource") },
    ], false),
    "IPV4Addresses": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("CvssSource") },
    ], false),
    "AwsInspector2Element": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsInspector2ElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsInspector2ElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("CvssSource") },
        { json: "source", js: "source", typ: r("CvssSource") },
        { json: "account", js: "account", typ: r("CvssSource") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("CvssSource") },
        { json: "resources", js: "resources", typ: r("IPV4Addresses") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Cvss": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CvssProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CvssProperties": o([
        { json: "baseScore", js: "baseScore", typ: r("CvssSource") },
        { json: "scoringVector", js: "scoringVector", typ: r("CvssSource") },
        { json: "source", js: "source", typ: r("CvssSource") },
        { json: "version", js: "version", typ: r("CvssSource") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "awsAccountId", js: "awsAccountId", typ: r("CvssSource") },
        { json: "description", js: "description", typ: r("CvssSource") },
        { json: "findingArn", js: "findingArn", typ: r("CvssSource") },
        { json: "firstObservedAt", js: "firstObservedAt", typ: r("CvssSource") },
        { json: "inspectorScore", js: "inspectorScore", typ: r("CvssSource") },
        { json: "inspectorScoreDetails", js: "inspectorScoreDetails", typ: r("DetailClass") },
        { json: "lastObservedAt", js: "lastObservedAt", typ: r("CvssSource") },
        { json: "packageVulnerabilityDetails", js: "packageVulnerabilityDetails", typ: r("DetailClass") },
        { json: "remediation", js: "remediation", typ: r("DetailClass") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "severity", js: "severity", typ: r("CvssSource") },
        { json: "status", js: "status", typ: r("CvssSource") },
        { json: "title", js: "title", typ: r("CvssSource") },
        { json: "type", js: "type", typ: r("CvssSource") },
        { json: "updatedAt", js: "updatedAt", typ: r("CvssSource") },
        { json: "scanStatus", js: "scanStatus", typ: r("DetailClass") },
        { json: "eventTimestamp", js: "eventTimestamp", typ: r("ID") },
        { json: "scan-status", js: "scan-status", typ: r("CvssSource") },
        { json: "repository-name", js: "repository-name", typ: r("CvssSource") },
        { json: "finding-severity-counts", js: "finding-severity-counts", typ: r("DetailClass") },
        { json: "image-digest", js: "image-digest", typ: r("CvssSource") },
        { json: "image-tags", js: "image-tags", typ: r("IPV4Addresses") },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "Details": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailsProperties": o([
        { json: "awsEc2Instance", js: "awsEc2Instance", typ: r("DetailClass") },
    ], false),
    "FindingSeverityCounts": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FindingSeverityCountsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FindingSeverityCountsProperties": o([
        { json: "CRITICAL", js: "CRITICAL", typ: r("CvssSource") },
        { json: "HIGH", js: "HIGH", typ: r("CvssSource") },
        { json: "MEDIUM", js: "MEDIUM", typ: r("CvssSource") },
        { json: "TOTAL", js: "TOTAL", typ: r("CvssSource") },
    ], false),
    "InspectorScoreDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InspectorScoreDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InspectorScoreDetailsProperties": o([
        { json: "adjustedCvss", js: "adjustedCvss", typ: r("DetailClass") },
    ], false),
    "PackageVulnerabilityDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PackageVulnerabilityDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PackageVulnerabilityDetailsProperties": o([
        { json: "cvss", js: "cvss", typ: r("Resources") },
        { json: "referenceUrls", js: "referenceUrls", typ: r("Adjustments") },
        { json: "source", js: "source", typ: r("CvssSource") },
        { json: "sourceUrl", js: "sourceUrl", typ: r("SourceURL") },
        { json: "vendorCreatedAt", js: "vendorCreatedAt", typ: r("CvssSource") },
        { json: "vendorSeverity", js: "vendorSeverity", typ: r("CvssSource") },
        { json: "vulnerabilityId", js: "vulnerabilityId", typ: r("CvssSource") },
        { json: "vulnerablePackages", js: "vulnerablePackages", typ: r("Resources") },
    ], false),
    "SourceURL": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
    ], false),
    "Recommendation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RecommendationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RecommendationProperties": o([
        { json: "text", js: "text", typ: r("CvssSource") },
    ], false),
    "Remediation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RemediationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RemediationProperties": o([
        { json: "recommendation", js: "recommendation", typ: r("DetailClass") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "details", js: "details", typ: r("DetailClass") },
        { json: "id", js: "id", typ: r("CvssSource") },
        { json: "partition", js: "partition", typ: r("CvssSource") },
        { json: "region", js: "region", typ: r("CvssSource") },
        { json: "type", js: "type", typ: r("CvssSource") },
    ], false),
    "ScanStatus": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ScanStatusProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ScanStatusProperties": o([
        { json: "reason", js: "reason", typ: r("CvssSource") },
        { json: "statusCodeValue", js: "statusCodeValue", typ: r("CvssSource") },
    ], false),
    "VulnerablePackage": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("VulnerablePackageProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "VulnerablePackageProperties": o([
        { json: "arch", js: "arch", typ: r("CvssSource") },
        { json: "epoch", js: "epoch", typ: r("CvssSource") },
        { json: "name", js: "name", typ: r("CvssSource") },
        { json: "packageManager", js: "packageManager", typ: r("CvssSource") },
        { json: "release", js: "release", typ: r("CvssSource") },
        { json: "version", js: "version", typ: r("CvssSource") },
    ], false),
    "Type": [
        "integer",
        "number",
        "string",
    ],
};
