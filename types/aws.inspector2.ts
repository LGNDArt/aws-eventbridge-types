// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsInspector2 = Convert.toAwsInspector2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsInspector2 {
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
    awsAccountId?:                string;
    description?:                 string;
    findingArn?:                  string;
    firstObservedAt?:             string;
    inspectorScore?:              number;
    inspectorScoreDetails?:       InspectorScoreDetails;
    lastObservedAt?:              string;
    packageVulnerabilityDetails?: PackageVulnerabilityDetails;
    remediation?:                 Remediation;
    resources?:                   Resource[];
    severity?:                    string;
    status?:                      string;
    title?:                       string;
    type?:                        string;
    updatedAt?:                   string;
    scanStatus?:                  ScanStatus;
    eventTimestamp?:              Date;
    "scan-status"?:               string;
    "repository-name"?:           string;
    "finding-severity-counts"?:   FindingSeverityCounts;
    "image-digest"?:              string;
    "image-tags"?:                string[];
}

export interface FindingSeverityCounts {
    CRITICAL: number;
    HIGH:     number;
    MEDIUM:   number;
    TOTAL:    number;
}

export interface InspectorScoreDetails {
    adjustedCvss: AdjustedCvss;
}

export interface AdjustedCvss {
    adjustments:   any[];
    cvssSource:    string;
    score:         number;
    scoreSource:   string;
    scoringVector: string;
    version:       string;
}

export interface PackageVulnerabilityDetails {
    cvss:               Cvss[];
    referenceUrls:      any[];
    source:             string;
    sourceUrl:          string;
    vendorCreatedAt:    string;
    vendorSeverity:     string;
    vulnerabilityId:    string;
    vulnerablePackages: VulnerablePackage[];
}

export interface Cvss {
    baseScore:     number;
    scoringVector: string;
    source:        string;
    version:       string;
}

export interface VulnerablePackage {
    arch:           string;
    epoch:          number;
    name:           string;
    packageManager: string;
    release:        string;
    version:        string;
}

export interface Remediation {
    recommendation: Recommendation;
}

export interface Recommendation {
    text: string;
}

export interface Resource {
    details:   Details;
    id:        string;
    partition: string;
    region:    string;
    type:      string;
}

export interface Details {
    awsEc2Instance: AwsEc2Instance;
}

export interface AwsEc2Instance {
    iamInstanceProfileArn: string;
    imageId:               string;
    ipV4Addresses:         string[];
    ipV6Addresses:         any[];
    launchedAt:            string;
    platform:              string;
    subnetId:              string;
    type:                  string;
    vpcId:                 string;
}

export interface ScanStatus {
    reason:          string;
    statusCodeValue: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsInspector2(json: string): AwsInspector2[] {
        return cast(JSON.parse(json), a(r("AwsInspector2")));
    }

    public static awsInspector2ToJson(value: AwsInspector2[]): string {
        return JSON.stringify(uncast(value, a(r("AwsInspector2"))), null, 2);
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
        { json: "awsAccountId", js: "awsAccountId", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "findingArn", js: "findingArn", typ: u(undefined, "") },
        { json: "firstObservedAt", js: "firstObservedAt", typ: u(undefined, "") },
        { json: "inspectorScore", js: "inspectorScore", typ: u(undefined, 3.14) },
        { json: "inspectorScoreDetails", js: "inspectorScoreDetails", typ: u(undefined, r("InspectorScoreDetails")) },
        { json: "lastObservedAt", js: "lastObservedAt", typ: u(undefined, "") },
        { json: "packageVulnerabilityDetails", js: "packageVulnerabilityDetails", typ: u(undefined, r("PackageVulnerabilityDetails")) },
        { json: "remediation", js: "remediation", typ: u(undefined, r("Remediation")) },
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
        { json: "severity", js: "severity", typ: u(undefined, "") },
        { json: "status", js: "status", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "updatedAt", js: "updatedAt", typ: u(undefined, "") },
        { json: "scanStatus", js: "scanStatus", typ: u(undefined, r("ScanStatus")) },
        { json: "eventTimestamp", js: "eventTimestamp", typ: u(undefined, Date) },
        { json: "scan-status", js: "scan-status", typ: u(undefined, "") },
        { json: "repository-name", js: "repository-name", typ: u(undefined, "") },
        { json: "finding-severity-counts", js: "finding-severity-counts", typ: u(undefined, r("FindingSeverityCounts")) },
        { json: "image-digest", js: "image-digest", typ: u(undefined, "") },
        { json: "image-tags", js: "image-tags", typ: u(undefined, a("")) },
    ], false),
    "FindingSeverityCounts": o([
        { json: "CRITICAL", js: "CRITICAL", typ: 0 },
        { json: "HIGH", js: "HIGH", typ: 0 },
        { json: "MEDIUM", js: "MEDIUM", typ: 0 },
        { json: "TOTAL", js: "TOTAL", typ: 0 },
    ], false),
    "InspectorScoreDetails": o([
        { json: "adjustedCvss", js: "adjustedCvss", typ: r("AdjustedCvss") },
    ], false),
    "AdjustedCvss": o([
        { json: "adjustments", js: "adjustments", typ: a("any") },
        { json: "cvssSource", js: "cvssSource", typ: "" },
        { json: "score", js: "score", typ: 3.14 },
        { json: "scoreSource", js: "scoreSource", typ: "" },
        { json: "scoringVector", js: "scoringVector", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "PackageVulnerabilityDetails": o([
        { json: "cvss", js: "cvss", typ: a(r("Cvss")) },
        { json: "referenceUrls", js: "referenceUrls", typ: a("any") },
        { json: "source", js: "source", typ: "" },
        { json: "sourceUrl", js: "sourceUrl", typ: "" },
        { json: "vendorCreatedAt", js: "vendorCreatedAt", typ: "" },
        { json: "vendorSeverity", js: "vendorSeverity", typ: "" },
        { json: "vulnerabilityId", js: "vulnerabilityId", typ: "" },
        { json: "vulnerablePackages", js: "vulnerablePackages", typ: a(r("VulnerablePackage")) },
    ], false),
    "Cvss": o([
        { json: "baseScore", js: "baseScore", typ: 3.14 },
        { json: "scoringVector", js: "scoringVector", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "VulnerablePackage": o([
        { json: "arch", js: "arch", typ: "" },
        { json: "epoch", js: "epoch", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "packageManager", js: "packageManager", typ: "" },
        { json: "release", js: "release", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Remediation": o([
        { json: "recommendation", js: "recommendation", typ: r("Recommendation") },
    ], false),
    "Recommendation": o([
        { json: "text", js: "text", typ: "" },
    ], false),
    "Resource": o([
        { json: "details", js: "details", typ: r("Details") },
        { json: "id", js: "id", typ: "" },
        { json: "partition", js: "partition", typ: "" },
        { json: "region", js: "region", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "Details": o([
        { json: "awsEc2Instance", js: "awsEc2Instance", typ: r("AwsEc2Instance") },
    ], false),
    "AwsEc2Instance": o([
        { json: "iamInstanceProfileArn", js: "iamInstanceProfileArn", typ: "" },
        { json: "imageId", js: "imageId", typ: "" },
        { json: "ipV4Addresses", js: "ipV4Addresses", typ: a("") },
        { json: "ipV6Addresses", js: "ipV6Addresses", typ: a("any") },
        { json: "launchedAt", js: "launchedAt", typ: "" },
        { json: "platform", js: "platform", typ: "" },
        { json: "subnetId", js: "subnetId", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "vpcId", js: "vpcId", typ: "" },
    ], false),
    "ScanStatus": o([
        { json: "reason", js: "reason", typ: "" },
        { json: "statusCodeValue", js: "statusCodeValue", typ: "" },
    ], false),
};
