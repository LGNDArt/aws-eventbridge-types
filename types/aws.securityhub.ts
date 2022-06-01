// To parse this data:
//
//   import { Convert, AwsSecurityhub } from "./file";
//
//   const awsSecurityhub = Convert.toAwsSecurityhub(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSecurityhub {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsSecurityhubElement: AwsSecurityhubElement;
    Detail:                Detail;
    Finding:               Finding;
    Compliance:            Compliance;
    ProductFields:         ProductFields;
    Remediation:           Remediation;
    Recommendation:        Recommendation;
    Resource:              Resource;
    Severity:              Severity;
    InsightResult:         InsightResult;
}

export interface AwsSecurityhubElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSecurityhubElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsSecurityhubElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          ID;
    region:        Account;
    resources:     Resources;
    detail:        Items;
}

export interface Account {
    type: Type;
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface Items {
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

export interface Compliance {
    type:                 string;
    additionalProperties: boolean;
    properties:           ComplianceProperties;
    required:             string[];
    title:                string;
}

export interface ComplianceProperties {
    Status: Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    actionName:        Account;
    actionDescription: Account;
    insightName:       Account;
    insightArn:        Account;
    resultType:        Account;
    insightResults:    Findings;
    findings:          Findings;
}

export interface Findings {
    type:  string;
    items: Items;
}

export interface Finding {
    type:                 string;
    additionalProperties: boolean;
    properties:           FindingProperties;
    required:             string[];
    title:                string;
}

export interface FindingProperties {
    SchemaVersion:   ID;
    Id:              Account;
    ProductArn:      Account;
    GeneratorId:     Account;
    AwsAccountId:    Account;
    Types:           Resources;
    FirstObservedAt: ID;
    LastObservedAt:  ID;
    CreatedAt:       ID;
    UpdatedAt:       ID;
    Severity:        Items;
    Confidence:      Account;
    Title:           Account;
    Description:     Account;
    Remediation:     Items;
    ProductFields:   Items;
    Resources:       Findings;
    RecordState:     Account;
    WorkflowState:   Account;
    Compliance:      Items;
}

export interface InsightResult {
    type:                 string;
    additionalProperties: boolean;
    properties:           InsightResultProperties;
    required:             any[];
    title:                string;
}

export interface InsightResultProperties {
    Admin:           Account;
    DenySlr_UI_User: Account;
}

export interface ProductFields {
    type:                 string;
    additionalProperties: boolean;
    properties:           ProductFieldsProperties;
    required:             string[];
    title:                string;
}

export interface ProductFieldsProperties {
    "rule-arn":                      Account;
    "tags:0":                        Account;
    "tags:1":                        Account;
    "themes:0/theme":                Account;
    "themes:0/count":                ID;
    "dlpRisk:0/risk":                ID;
    "dlpRisk:0/count":               ID;
    "owner:0/name":                  Account;
    "owner:0/count":                 ID;
    "aws/securityhub/FindingId":     Account;
    "aws/securityhub/SeverityLabel": Account;
    "aws/securityhub/ProductName":   Account;
    "aws/securityhub/CompanyName":   Account;
    StandardsGuideArn:               Account;
    StandardsGuideSubscriptionArn:   Account;
    RuleId:                          Account;
    RecommendationUrl:               URL;
    RecordState:                     Account;
}

export interface URL {
    type:                Type;
    format:              string;
    "qt-uri-protocols":  string[];
    "qt-uri-extensions": string[];
}

export interface Recommendation {
    type:                 string;
    additionalProperties: boolean;
    properties:           RecommendationProperties;
    required:             string[];
    title:                string;
}

export interface RecommendationProperties {
    Text: Account;
    Url:  URL;
}

export interface Remediation {
    type:                 string;
    additionalProperties: boolean;
    properties:           RemediationProperties;
    required:             string[];
    title:                string;
}

export interface RemediationProperties {
    Recommendation: Items;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    Type:      Account;
    Id:        Account;
    Partition: Account;
    Region:    Account;
}

export interface Severity {
    type:                 string;
    additionalProperties: boolean;
    properties:           SeverityProperties;
    required:             string[];
    title:                string;
}

export interface SeverityProperties {
    Product:    Account;
    Normalized: Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSecurityhub(json: string): AwsSecurityhub {
        return cast(JSON.parse(json), r("AwsSecurityhub"));
    }

    public static awsSecurityhubToJson(value: AwsSecurityhub): string {
        return JSON.stringify(uncast(value, r("AwsSecurityhub")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSecurityhubElement", js: "AwsSecurityhubElement", typ: r("AwsSecurityhubElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Finding", js: "Finding", typ: r("Finding") },
        { json: "Compliance", js: "Compliance", typ: r("Compliance") },
        { json: "ProductFields", js: "ProductFields", typ: r("ProductFields") },
        { json: "Remediation", js: "Remediation", typ: r("Remediation") },
        { json: "Recommendation", js: "Recommendation", typ: r("Recommendation") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "Severity", js: "Severity", typ: r("Severity") },
        { json: "InsightResult", js: "InsightResult", typ: r("InsightResult") },
    ], false),
    "AwsSecurityhubElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSecurityhubElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSecurityhubElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Items": o([
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
    "Compliance": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ComplianceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ComplianceProperties": o([
        { json: "Status", js: "Status", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "actionName", js: "actionName", typ: r("Account") },
        { json: "actionDescription", js: "actionDescription", typ: r("Account") },
        { json: "insightName", js: "insightName", typ: r("Account") },
        { json: "insightArn", js: "insightArn", typ: r("Account") },
        { json: "resultType", js: "resultType", typ: r("Account") },
        { json: "insightResults", js: "insightResults", typ: r("Findings") },
        { json: "findings", js: "findings", typ: r("Findings") },
    ], false),
    "Findings": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "Finding": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FindingProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FindingProperties": o([
        { json: "SchemaVersion", js: "SchemaVersion", typ: r("ID") },
        { json: "Id", js: "Id", typ: r("Account") },
        { json: "ProductArn", js: "ProductArn", typ: r("Account") },
        { json: "GeneratorId", js: "GeneratorId", typ: r("Account") },
        { json: "AwsAccountId", js: "AwsAccountId", typ: r("Account") },
        { json: "Types", js: "Types", typ: r("Resources") },
        { json: "FirstObservedAt", js: "FirstObservedAt", typ: r("ID") },
        { json: "LastObservedAt", js: "LastObservedAt", typ: r("ID") },
        { json: "CreatedAt", js: "CreatedAt", typ: r("ID") },
        { json: "UpdatedAt", js: "UpdatedAt", typ: r("ID") },
        { json: "Severity", js: "Severity", typ: r("Items") },
        { json: "Confidence", js: "Confidence", typ: r("Account") },
        { json: "Title", js: "Title", typ: r("Account") },
        { json: "Description", js: "Description", typ: r("Account") },
        { json: "Remediation", js: "Remediation", typ: r("Items") },
        { json: "ProductFields", js: "ProductFields", typ: r("Items") },
        { json: "Resources", js: "Resources", typ: r("Findings") },
        { json: "RecordState", js: "RecordState", typ: r("Account") },
        { json: "WorkflowState", js: "WorkflowState", typ: r("Account") },
        { json: "Compliance", js: "Compliance", typ: r("Items") },
    ], false),
    "InsightResult": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InsightResultProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InsightResultProperties": o([
        { json: "Admin", js: "Admin", typ: r("Account") },
        { json: "DenySlr_UI_User", js: "DenySlr_UI_User", typ: r("Account") },
    ], false),
    "ProductFields": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ProductFieldsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ProductFieldsProperties": o([
        { json: "rule-arn", js: "rule-arn", typ: r("Account") },
        { json: "tags:0", js: "tags:0", typ: r("Account") },
        { json: "tags:1", js: "tags:1", typ: r("Account") },
        { json: "themes:0/theme", js: "themes:0/theme", typ: r("Account") },
        { json: "themes:0/count", js: "themes:0/count", typ: r("ID") },
        { json: "dlpRisk:0/risk", js: "dlpRisk:0/risk", typ: r("ID") },
        { json: "dlpRisk:0/count", js: "dlpRisk:0/count", typ: r("ID") },
        { json: "owner:0/name", js: "owner:0/name", typ: r("Account") },
        { json: "owner:0/count", js: "owner:0/count", typ: r("ID") },
        { json: "aws/securityhub/FindingId", js: "aws/securityhub/FindingId", typ: r("Account") },
        { json: "aws/securityhub/SeverityLabel", js: "aws/securityhub/SeverityLabel", typ: r("Account") },
        { json: "aws/securityhub/ProductName", js: "aws/securityhub/ProductName", typ: r("Account") },
        { json: "aws/securityhub/CompanyName", js: "aws/securityhub/CompanyName", typ: r("Account") },
        { json: "StandardsGuideArn", js: "StandardsGuideArn", typ: r("Account") },
        { json: "StandardsGuideSubscriptionArn", js: "StandardsGuideSubscriptionArn", typ: r("Account") },
        { json: "RuleId", js: "RuleId", typ: r("Account") },
        { json: "RecommendationUrl", js: "RecommendationUrl", typ: r("URL") },
        { json: "RecordState", js: "RecordState", typ: r("Account") },
    ], false),
    "URL": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
        { json: "qt-uri-extensions", js: "qt-uri-extensions", typ: a("") },
    ], false),
    "Recommendation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RecommendationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RecommendationProperties": o([
        { json: "Text", js: "Text", typ: r("Account") },
        { json: "Url", js: "Url", typ: r("URL") },
    ], false),
    "Remediation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RemediationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RemediationProperties": o([
        { json: "Recommendation", js: "Recommendation", typ: r("Items") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "Type", js: "Type", typ: r("Account") },
        { json: "Id", js: "Id", typ: r("Account") },
        { json: "Partition", js: "Partition", typ: r("Account") },
        { json: "Region", js: "Region", typ: r("Account") },
    ], false),
    "Severity": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SeverityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SeverityProperties": o([
        { json: "Product", js: "Product", typ: r("Account") },
        { json: "Normalized", js: "Normalized", typ: r("Account") },
    ], false),
    "Type": [
        "integer",
        "string",
    ],
};
