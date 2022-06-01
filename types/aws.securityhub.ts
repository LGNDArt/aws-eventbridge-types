// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsSecurityhub = Convert.toAwsSecurityhub(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSecurityhub {
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
    actionName?:        string;
    actionDescription?: string;
    insightName?:       string;
    insightArn?:        string;
    resultType?:        string;
    insightResults?:    InsightResult[];
    findings?:          Finding[];
}

export interface Finding {
    SchemaVersion:   Date;
    Id:              string;
    ProductArn:      string;
    GeneratorId:     string;
    AwsAccountId:    string;
    Types:           string[];
    FirstObservedAt: Date;
    LastObservedAt:  Date;
    CreatedAt:       Date;
    UpdatedAt:       Date;
    Severity:        Severity;
    Confidence?:     number;
    Title:           string;
    Description:     string;
    Remediation:     Remediation;
    ProductFields:   ProductFields;
    Resources:       Resource[];
    RecordState:     string;
    WorkflowState:   string;
    Compliance?:     Compliance;
}

export interface Compliance {
    Status: string;
}

export interface ProductFields {
    "rule-arn"?:                     string;
    "tags:0"?:                       string;
    "tags:1"?:                       string;
    "themes:0/theme"?:               string;
    "themes:0/count"?:               string;
    "dlpRisk:0/risk"?:               string;
    "dlpRisk:0/count"?:              string;
    "owner:0/name"?:                 string;
    "owner:0/count"?:                string;
    "aws/securityhub/FindingId":     string;
    "aws/securityhub/SeverityLabel": string;
    "aws/securityhub/ProductName":   string;
    "aws/securityhub/CompanyName":   string;
    StandardsGuideArn?:              string;
    StandardsGuideSubscriptionArn?:  string;
    RuleId?:                         string;
    RecommendationUrl?:              string;
    RecordState?:                    string;
}

export interface Remediation {
    Recommendation: Recommendation;
}

export interface Recommendation {
    Text: string;
    Url?: string;
}

export interface Resource {
    Type:      string;
    Id:        string;
    Partition: string;
    Region:    string;
}

export interface Severity {
    Product:    number;
    Normalized: number;
}

export interface InsightResult {
    Admin?:           number;
    DenySlr_UI_User?: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSecurityhub(json: string): AwsSecurityhub[] {
        return cast(JSON.parse(json), a(r("AwsSecurityhub")));
    }

    public static awsSecurityhubToJson(value: AwsSecurityhub[]): string {
        return JSON.stringify(uncast(value, a(r("AwsSecurityhub"))), null, 2);
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
    "AwsSecurityhub": o([
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
        { json: "actionName", js: "actionName", typ: u(undefined, "") },
        { json: "actionDescription", js: "actionDescription", typ: u(undefined, "") },
        { json: "insightName", js: "insightName", typ: u(undefined, "") },
        { json: "insightArn", js: "insightArn", typ: u(undefined, "") },
        { json: "resultType", js: "resultType", typ: u(undefined, "") },
        { json: "insightResults", js: "insightResults", typ: u(undefined, a(r("InsightResult"))) },
        { json: "findings", js: "findings", typ: u(undefined, a(r("Finding"))) },
    ], false),
    "Finding": o([
        { json: "SchemaVersion", js: "SchemaVersion", typ: Date },
        { json: "Id", js: "Id", typ: "" },
        { json: "ProductArn", js: "ProductArn", typ: "" },
        { json: "GeneratorId", js: "GeneratorId", typ: "" },
        { json: "AwsAccountId", js: "AwsAccountId", typ: "" },
        { json: "Types", js: "Types", typ: a("") },
        { json: "FirstObservedAt", js: "FirstObservedAt", typ: Date },
        { json: "LastObservedAt", js: "LastObservedAt", typ: Date },
        { json: "CreatedAt", js: "CreatedAt", typ: Date },
        { json: "UpdatedAt", js: "UpdatedAt", typ: Date },
        { json: "Severity", js: "Severity", typ: r("Severity") },
        { json: "Confidence", js: "Confidence", typ: u(undefined, 0) },
        { json: "Title", js: "Title", typ: "" },
        { json: "Description", js: "Description", typ: "" },
        { json: "Remediation", js: "Remediation", typ: r("Remediation") },
        { json: "ProductFields", js: "ProductFields", typ: r("ProductFields") },
        { json: "Resources", js: "Resources", typ: a(r("Resource")) },
        { json: "RecordState", js: "RecordState", typ: "" },
        { json: "WorkflowState", js: "WorkflowState", typ: "" },
        { json: "Compliance", js: "Compliance", typ: u(undefined, r("Compliance")) },
    ], false),
    "Compliance": o([
        { json: "Status", js: "Status", typ: "" },
    ], false),
    "ProductFields": o([
        { json: "rule-arn", js: "rule-arn", typ: u(undefined, "") },
        { json: "tags:0", js: "tags:0", typ: u(undefined, "") },
        { json: "tags:1", js: "tags:1", typ: u(undefined, "") },
        { json: "themes:0/theme", js: "themes:0/theme", typ: u(undefined, "") },
        { json: "themes:0/count", js: "themes:0/count", typ: u(undefined, "") },
        { json: "dlpRisk:0/risk", js: "dlpRisk:0/risk", typ: u(undefined, "") },
        { json: "dlpRisk:0/count", js: "dlpRisk:0/count", typ: u(undefined, "") },
        { json: "owner:0/name", js: "owner:0/name", typ: u(undefined, "") },
        { json: "owner:0/count", js: "owner:0/count", typ: u(undefined, "") },
        { json: "aws/securityhub/FindingId", js: "aws/securityhub/FindingId", typ: "" },
        { json: "aws/securityhub/SeverityLabel", js: "aws/securityhub/SeverityLabel", typ: "" },
        { json: "aws/securityhub/ProductName", js: "aws/securityhub/ProductName", typ: "" },
        { json: "aws/securityhub/CompanyName", js: "aws/securityhub/CompanyName", typ: "" },
        { json: "StandardsGuideArn", js: "StandardsGuideArn", typ: u(undefined, "") },
        { json: "StandardsGuideSubscriptionArn", js: "StandardsGuideSubscriptionArn", typ: u(undefined, "") },
        { json: "RuleId", js: "RuleId", typ: u(undefined, "") },
        { json: "RecommendationUrl", js: "RecommendationUrl", typ: u(undefined, "") },
        { json: "RecordState", js: "RecordState", typ: u(undefined, "") },
    ], false),
    "Remediation": o([
        { json: "Recommendation", js: "Recommendation", typ: r("Recommendation") },
    ], false),
    "Recommendation": o([
        { json: "Text", js: "Text", typ: "" },
        { json: "Url", js: "Url", typ: u(undefined, "") },
    ], false),
    "Resource": o([
        { json: "Type", js: "Type", typ: "" },
        { json: "Id", js: "Id", typ: "" },
        { json: "Partition", js: "Partition", typ: "" },
        { json: "Region", js: "Region", typ: "" },
    ], false),
    "Severity": o([
        { json: "Product", js: "Product", typ: 0 },
        { json: "Normalized", js: "Normalized", typ: 0 },
    ], false),
    "InsightResult": o([
        { json: "Admin", js: "Admin", typ: u(undefined, 0) },
        { json: "DenySlr_UI_User", js: "DenySlr_UI_User", typ: u(undefined, 0) },
    ], false),
};
